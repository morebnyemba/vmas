import logging
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from decimal import Decimal
from paynow import Paynow, StatusResponse, HashMismatchException
from .models import Payment, PaynowIntegration
from .serializers import PaymentSerializer, PaynowIntegrationSerializer

# Set up the logger
logger = logging.getLogger(__name__)

class PaynowIntegrationListAPIView(generics.ListAPIView):
    serializer_class = PaynowIntegrationSerializer
    queryset = PaynowIntegration.objects.filter(is_active=True)

    def get(self, request, *args, **kwargs):
        logger.info('Fetching active Paynow integrations.')
        return super().get(request, *args, **kwargs)


class PaymentCreateAPIView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        logger.info('Performing payment creation...')
        payment = serializer.save(user=self.request.user)
        payment.full_clean()
        logger.info(f'Payment created with reference: {payment.reference}')
        payment.initiate_paynow_payment()

    def create(self, request, *args, **kwargs):
        logger.info('Received payment creation request.')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        logger.info('Payment data validated successfully.')
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        response_data = {
            'success': True,
            'payment': serializer.data,
            'message': 'Payment initiated successfully'
        }
        logger.info(f'Payment initiated successfully with reference: {serializer.data["reference"]}')
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class PaymentRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    lookup_field = 'reference'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        logger.info('Fetching payment details for the user.')
        return self.queryset.filter(user=self.request.user)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookAPIView(generics.GenericAPIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        logger.info('Received webhook from Paynow.')
        try:
            # Ensure we can parse data safely
            if not isinstance(request.data, dict):
                logger.error('Invalid payload format.')
                return Response("Invalid payload format", status=status.HTTP_400_BAD_REQUEST)

            payload = request.data

            # Validate required parameters
            required_fields = {'integrationid', 'paynowreference', 'status', 'amount', 'hash'}
            missing = required_fields - payload.keys()
            if missing:
                logger.error(f'Missing parameters: {", ".join(missing)}')
                return Response(f"Missing parameters: {', '.join(missing)}",
                                status=status.HTTP_400_BAD_REQUEST)

            # Get integration using plaintext integration ID
            integration = PaynowIntegration.objects.get(
                integration_id=payload['integrationid']
            )
            logger.info(f'Integration found: {integration.name}')

            # Initialize Paynow client
            paynow = Paynow(
                integration_id=integration.integration_id,
                integration_key=integration.integration_key,
                return_url=integration.return_url,
                result_url=integration.result_url
            )

            # Verify hash
            if not paynow._Paynow__verify_hash(payload, integration.integration_key):
                logger.warning('Hash mismatch, invalid transaction signature.')
                raise HashMismatchException("Invalid transaction signature")

            # Parse status update
            status_response = StatusResponse(payload, update=True)

            # Update payment record
            payment = Payment.objects.get(
                paynow_payment_id=payload['paynowreference'],
                amount=Decimal(payload['amount']).quantize(Decimal('0.00'))
            )

            payment.status = 'Paid' if status_response.paid else 'Failed'
            payment.save()
            logger.info(f'Payment status updated: {payment.status} for reference {payment.reference}')

            return Response(status=status.HTTP_200_OK)

        except HashMismatchException as e:
            logger.error(f'Hash mismatch exception: {str(e)}')
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)
        except PaynowIntegration.DoesNotExist:
            logger.error('Paynow integration not found.')
            return Response("Invalid integration", status=status.HTTP_400_BAD_REQUEST)
        except Payment.DoesNotExist:
            logger.error('Payment not found for the given Paynow reference.')
            return Response("Payment not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'Error during webhook processing: {str(e)}')
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

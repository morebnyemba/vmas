# backend/payments/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Payment, PaynowIntegration
from .serializers import PaymentSerializer, PaynowIntegrationSerializer

class PaynowIntegrationListAPIView(generics.ListAPIView):
    serializer_class = PaynowIntegrationSerializer
    queryset = PaynowIntegration.objects.all()

    def get_queryset(self):
        return self.queryset.filter(is_active=True)

class PaymentCreateAPIView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        payment = serializer.save(user=self.request.user)
        payment.full_clean()
        payment.initiate_paynow_payment()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        response_data = {
            'success': True,
            'payment': serializer.data,
            'message': 'Payment initiated successfully'
        }
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

class PaymentRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    lookup_field = 'reference'
    permission_classes = [IsAuthenticated]

class PaymentWebhookAPIView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        payload = request.data
        try:
            paynow_ref = payload['paynowReference']
            payment_status = payload['status']
            amount = float(payload['amount'])

            payment = Payment.objects.get(
                paynow_payment_id=paynow_ref,
                amount=amount
            )

            status_map = {
                'paid': 'Paid',
                'awaiting_delivery': 'Sent',
                'cancelled': 'Cancelled',
                'failed': 'Failed'
            }
            
            new_status = status_map.get(payment_status.lower(), 'Failed')
            payment.status = new_status
            payment.save()

            return Response(status=status.HTTP_200_OK)

        except KeyError as e:
            return Response(f"Missing parameter: {str(e)}", status=status.HTTP_400_BAD_REQUEST)
        except Payment.DoesNotExist:
            return Response("Payment not found", status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
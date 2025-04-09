# backend/payments/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        # Initiate Paynow payment after saving the initial payment object
        serializer.instance.initiate_paynow_payment()
        # The initiate_paynow_payment method in the model will save the instance
        # again after interacting with Paynow.

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
    """
    Endpoint to receive Paynow webhook notifications.
    You'll need to implement the logic to verify the webhook signature
    and update your Payment model based on the received data.
    Consult the Paynow SDK documentation for webhook verification.
    """
    def post(self, request, *args, **kwargs):
        # Implement webhook verification and processing here
        # Example (you'll need to adapt this based on Paynow's requirements):
        # if paynow.verify_signature(request.POST, your_secret_key):
        #     payment_reference = request.POST.get('reference')
        #     status = request.POST.get('status')
        #     # Update your Payment model based on the status
        #     try:
        #         payment = Payment.objects.get(reference=payment_reference)
        #         payment.status = status
        #         payment.save()
        #         return Response(status=status.HTTP_200_OK)
        #     except Payment.DoesNotExist:
        #         return Response("Payment not found", status=status.HTTP_404_NOT_FOUND)
        # else:
        #     return Response("Invalid signature", status=status.HTTP_400_BAD_REQUEST)
        print("Paynow Webhook Received:", request.POST) # For debugging
        return Response(status=status.HTTP_200_OK)
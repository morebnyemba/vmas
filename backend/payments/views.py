from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework import generics, status
from rest_framework.response import Response
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
    
    def perform_create(self, serializer):
        payment = serializer.save(user=self.request.user)
        # Initialize payment with Paynow
        payment.initiate_paynow_payment()  # Your custom method
        payment.save()
        
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
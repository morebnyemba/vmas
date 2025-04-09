# backend/payments/urls.py
# api/urls.py
from django.urls import path
from .views import (
    PaynowIntegrationListAPIView,
    PaymentCreateAPIView,
    PaymentRetrieveAPIView,
    PaymentWebhookAPIView
)

urlpatterns = [
    # Payment Gateway Integrations
    path('paynow-integrations/', PaynowIntegrationListAPIView.as_view(), name='paynow-integrations'),

    # Payment Processing
    path('payments/', PaymentCreateAPIView.as_view(), name='payment-create'),
    path('payments/<uuid:reference>/', PaymentRetrieveAPIView.as_view(), name='payment-detail'),

    # Webhook
    path('webhook/paynow/', PaymentWebhookAPIView.as_view(), name='paynow-webhook'),
]
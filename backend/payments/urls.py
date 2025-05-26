# backend/payments/urls.py
from django.urls import path
from .views import (
    PaynowIntegrationListAPIView,
    PaymentCreateAPIView,
    PaymentRetrieveAPIView,
    PaymentWebhookAPIView
)

# Define the namespace for this app
app_name = 'payments'

urlpatterns = [
    # Payment Gateway Integrations
    path('paynow-integrations/', PaynowIntegrationListAPIView.as_view(), name='get_integrations'),

    # Payment Processing
    path('payments/', PaymentCreateAPIView.as_view(), name='create_payment'),
    path('payments/<uuid:reference>/', PaymentRetrieveAPIView.as_view(), name='retrieve_payment'),

    # Webhook
    path('webhook/paynow/', PaymentWebhookAPIView.as_view(), name='webhook'),
]

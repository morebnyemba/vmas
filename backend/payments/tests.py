from rest_framework import status
from rest_framework.test import APITestCase
from payments.models import Payment, PaynowIntegration
from django.urls import reverse


class PaymentsAppTests(APITestCase):
    def setUp(self):
        # Set up any required data for the tests, such as Paynow integrations
        self.paynow_integration = PaynowIntegration.objects.create(
            integration_id='test-integration-id',
            is_active=True
        )
    
    def test_create_payment_success(self):
        # Data for creating the payment
        payment_data = {
            'amount': 100.0,
            'currency': 'USD',
            'paynow_integration': self.paynow_integration.id,
            'buyer_phone': '+263123456789',
        }
        
        # Reverse the URL for payment creation
        url = reverse('payments:create_payment')
        
        # Send a POST request to create a payment
        response = self.client.post(url, payment_data, format='json')
        
        # Assert that the status code is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_get_active_integrations(self):
        # Reverse the URL for getting active integrations
        url = reverse('payments:get_integrations')
        
        # Send a GET request to fetch active integrations
        response = self.client.get(url)
        
        # Assert that the status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_retrieve_user_payment(self):
        # Assuming the payment object has a reference (UUID)
        payment = Payment.objects.create(
            amount=100.0,
            currency='USD',
            paynow_integration=self.paynow_integration,
            buyer_phone='+263123456789'
        )
        
        # Reverse the URL with 'reference' instead of 'payment_id'
        url = reverse('payments:retrieve_payment', kwargs={'reference': payment.reference})
        
        # Send a GET request to retrieve the payment
        response = self.client.get(url)
        
        # Assert that the status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_webhook_invalid_integration(self):
        # Data for a webhook with invalid integration (non-existent integration ID)
        webhook_data = {
            'integration_id': 'invalid-integration-id',
            'status': 'Success',
            'amount': 100.0,
            'currency': 'USD',
            'buyer_phone': '+263123456789',
        }
        
        # Reverse the URL for the webhook
        url = reverse('payments:webhook')
        
        # Send a POST request to the webhook endpoint with invalid data
        response = self.client.post(url, webhook_data, format='json')
        
        # Assert that the status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_webhook_missing_fields(self):
        # Data for a webhook with missing required fields (missing 'amount')
        webhook_data = {
            'integration_id': 'test-integration-id',
            'status': 'Success',
            'currency': 'USD',
            'buyer_phone': '+263123456789',
        }
        
        # Reverse the URL for the webhook
        url = reverse('payments:webhook')
        
        # Send a POST request to the webhook endpoint with missing fields
        response = self.client.post(url, webhook_data, format='json')
        
        # Assert that the status code is 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

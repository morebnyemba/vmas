# backend/payments/views.py
import logging
import hashlib # For Paynow hash validation in webhook

from django.shortcuts import get_object_or_404 # Not used in the final version, but good for general Django
from django.conf import settings # Potentially for SITE_URL or other settings
from django.http import JsonResponse, HttpResponseBadRequest, FileResponse # For webhook and PDF download

from rest_framework import generics, status, viewsets, mixins # viewsets and mixins for ReceiptViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser # Permissions
from rest_framework.decorators import action # For custom actions in ViewSet

from .models import Payment, PaynowIntegration, Receipt # Ensure Receipt is imported
from .serializers import (
    PaymentSerializer,
    PaynowIntegrationSerializer,
    ReceiptSerializer # Ensure ReceiptSerializer is imported
)
# tasks.py is crucial for async operations post-payment
from .tasks import process_successful_payment_task, check_pending_payments_task
# services.py might be used if you add manual triggers or other helper functions
# from .services import generate_and_save_receipt

logger = logging.getLogger(__name__)

class PaynowIntegrationListAPIView(generics.ListAPIView):
    queryset = PaynowIntegration.objects.filter(is_active=True)
    serializer_class = PaynowIntegrationSerializer
    permission_classes = [IsAuthenticated] # Or AllowAny if these are public

class PaymentCreateAPIView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        integration = serializer.validated_data.get('integration') # Resolved by serializer from integration_id
        amount = serializer.validated_data.get('amount')
        
        # The serializer's validate method already checks for integration currency and activity
        # Additional business logic specific to view can be here

        # Save the payment instance, associating the current user
        payment = serializer.save(user=user)
        logger.info(f"Payment {payment.reference} initial record created for user {user.email}.")

        # Attempt to initiate the Paynow payment process
        try:
            # This method should exist on your Payment model or be a separate service call
            # It would typically make an external API call to Paynow
            success, details = payment.initiate_paynow_payment() # Assuming this method returns (bool, dict)

            if success:
                # Update payment with details from Paynow if any (poll_url, payment_url, paynow_payment_id)
                payment.poll_url = details.get('poll_url', '')
                payment.payment_url = details.get('payment_url', '')
                # paynow_payment_id might only come after payment confirmation or in webhook
                payment.status = 'Sent' # Or 'Pending' - depends on your flow
                payment.save(update_fields=['poll_url', 'payment_url', 'status'])
                logger.info(f"Payment {payment.reference} successfully initiated with Paynow. URL: {payment.payment_url}")
                # The serializer's to_representation will now include these updated URLs.
            else:
                payment.status = 'Failed'
                payment.error_message = details.get('error', "Failed to initiate payment with Paynow.")
                payment.save(update_fields=['status', 'error_message'])
                logger.error(f"Failed to initiate Paynow payment for {payment.reference}: {payment.error_message}")
                # To provide specific error to client, raise DRFValidationError
                # For now, the client will get the payment object with 'Failed' status.
                # If you want to fail the creation request itself:
                # raise serializers.ValidationError({"detail": payment.error_message})

        except Exception as e:
            logger.error(f"Exception during Paynow initiation for {payment.reference}: {e}", exc_info=True)
            payment.status = 'Failed'
            payment.error_message = f"System error during payment initiation: {str(e)}"
            payment.save(update_fields=['status', 'error_message'])
            # Optionally raise an error to make the HTTP request fail
            # raise serializers.ValidationError({"detail": "A system error occurred during payment initiation."})
        
        # Serializer used for response will reflect the latest state of 'payment'
        # DRF CreateAPIView will return the serialized payment data with a 201 status.


class PaymentRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'reference' # Using the UUID reference field

    def get_queryset(self):
        # Ensure users can only retrieve their own payments unless they are staff
        user = self.request.user
        if user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)

class PaymentWebhookAPIView(generics.GenericAPIView):
    """
    Handles incoming webhook notifications from Paynow.
    This view should be publicly accessible but secured via hash verification.
    """
    permission_classes = [AllowAny] # Webhooks must be accessible without session auth

    def post(self, request, *args, **kwargs):
        data = request.data
        logger.info(f"Received Paynow webhook data: {data}")

        # Extract necessary fields from Paynow response (ensure keys match Paynow's actual response)
        reference = data.get('reference') # Your system's payment reference
        paynow_reference = data.get('paynowreference') # Paynow's own reference for the transaction
        amount_cents = data.get('amount') # Paynow usually sends amount in cents
        status = data.get('status') # e.g., 'Paid', 'Cancelled', 'Failed', 'Delivered'
        poll_url = data.get('pollurl')
        paynow_hash = data.get('hash') # The hash sent by Paynow for verification

        if not all([reference, paynow_reference, amount_cents, status, poll_url, paynow_hash]):
            logger.error("Webhook received with missing fields.")
            return HttpResponseBadRequest("Missing required fields in webhook data.")

        try:
            payment = Payment.objects.select_related('integration').get(reference=reference)
        except Payment.DoesNotExist:
            logger.error(f"Webhook for unknown payment reference: {reference}")
            # It's important to return a 200 OK even for unknown refs to prevent Paynow retries if it's truly not ours.
            # However, for internal tracking, an error is logged.
            # Depending on Paynow's retry policy, a 400 might be okay, but 200 is safer to acknowledge receipt.
            return Response({"status": "error", "message": "Payment reference not found."}, status=status.HTTP_200_OK)

        # Verify the hash (CRITICAL SECURITY STEP)
        integration_key = payment.integration.integration_key # Ensure this is the decrypted key
        
        # Construct the string to hash. The order and fields are CRITICAL and defined by Paynow.
        # This is an EXAMPLE string formation. YOU MUST VERIFY THE CORRECT FORMAT WITH PAYNOW DOCUMENTATION.
        # It often includes all POSTed values concatenated in a specific order, then append integration key.
        # For this example, let's assume the values from the request data are used directly.
        # Paynow might require specific formatting (e.g., amount in cents as string).
        # Create a string by concatenating all the received POST values that are part of hash calculation
        # (excluding the hash itself), in the order specified by Paynow, then append your integration key.
        # This part is highly dependent on Paynow's specific instructions for hash generation.
        # Example:
        fields_for_hash = [
            data.get('reference', ""),
            data.get('paynowreference', ""),
            data.get('amount', ""), # Amount as sent by Paynow (e.g. in cents)
            data.get('status', ""),
            data.get('pollurl', ""),
            # Add ANY OTHER fields Paynow includes in hash calculation, in their specified order
        ]
        string_to_hash_parts = [str(data.get(k, "")) for k in sorted(data.keys()) if k != 'hash'] # A common but potentially INCORRECT way
        # SAFER: Use the exact field list and order from Paynow documentation.
        # Example of specific field order (hypothetical, CHECK PAYNOW DOCS!):
        # string_values = [
        #     str(data.get('reference')), str(data.get('paynowreference')), ..., str(integration_key)
        # ]
        # For this example, let's use a placeholder for values that Paynow says to include:
        # THIS IS A PLACEHOLDER - CONSULT PAYNOW DOCUMENTATION FOR THE EXACT STRING
        values_to_hash = ""
        # Typically, it's a concatenation of the POST values followed by your integration key.
        # Let's assume Paynow requires these fields in this order:
        key_order_for_hash = ['reference', 'paynowreference', 'amount', 'status', 'pollurl'] # EXAMPLE ORDER
        for key in key_order_for_hash:
            values_to_hash += str(data.get(key, ""))
        values_to_hash += str(integration_key)

        calculated_hash = hashlib.sha512(values_to_hash.encode('utf-8')).hexdigest().upper()

        if calculated_hash != paynow_hash.upper():
            logger.error(f"Webhook hash mismatch for payment {reference}. Calculated: {calculated_hash}, Received: {paynow_hash}. String used (approx): '{values_to_hash_parts}' + key")
            # Still return 200 OK to acknowledge, but log the error and don't process.
            return Response({"status": "error", "message": "Hash verification failed."}, status=status.HTTP_200_OK)
        
        logger.info(f"Webhook hash verified for payment {reference}.")

        # Process payment status update
        # Check if this is an old/duplicate webhook to prevent reprocessing
        if payment.status == 'Paid' and status.lower() == 'paid':
            logger.info(f"Payment {reference} already marked as Paid. Webhook for status '{status}' acknowledged.")
            return Response({"status": "success", "message": "Webhook processed successfully, payment already Paid."}, status=status.HTTP_200_OK)

        original_status = payment.status
        
        if status.lower() == 'paid':
            payment.status = 'Paid'
            payment.paynow_payment_id = paynow_reference # Store Paynow's transaction ID
            payment.amount = payment.amount # Ensure amount is correctly handled if sent in cents
            payment.save(update_fields=['status', 'paynow_payment_id', 'amount'])
            logger.info(f"Payment {reference} updated to Paid. Queuing for post-processing.")
            process_successful_payment_task.delay(payment.id) # Trigger Celery task
        elif status.lower() in ['cancelled', 'failed', 'disputed', 'refunded']: # Handle other terminal statuses
            payment.status = status.capitalize()
            payment.error_message = f"Paynow status: {status}"
            payment.save(update_fields=['status', 'error_message'])
            logger.info(f"Payment {reference} updated to {payment.status}.")
        else: # Handle intermediate or unknown statuses
            logger.warning(f"Received unhandled Paynow status '{status}' for payment {reference}. Storing as error/note.")
            # payment.status = 'Sent' # Or a custom status like 'Pending Confirmation'
            payment.error_message = f"Paynow status update: {status}" # Log it
            payment.save(update_fields=['error_message'])

        if original_status != payment.status:
            logger.info(f"Payment {payment.reference} status changed from {original_status} to {payment.status} via webhook.")

        # Respond to Paynow to acknowledge receipt
        return Response({"status": "success", "message": "Webhook processed successfully."}, status=status.HTTP_200_OK)


class ReceiptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows receipts to be viewed.
    Users can only see their own receipts.
    Admins (is_staff=True) can see all receipts.
    """
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated] # Base permission

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            logger.debug(f"Admin user {user.email} fetching all receipts.")
            return Receipt.objects.all().select_related('payment', 'payment__user').order_by('-issued_at')
        else:
            logger.debug(f"User {user.email} fetching their receipts.")
            return Receipt.objects.filter(payment__user=user).select_related('payment').order_by('-issued_at')

    @action(detail=True, methods=['get'], url_path='download-pdf', permission_classes=[IsAuthenticated])
    def download_pdf(self, request, pk=None):
        """
        Allows downloading the PDF for a specific receipt.
        The `get_object()` method respects the `get_queryset()` filtering,
        ensuring users can only download PDFs of receipts they are allowed to see.
        """
        receipt = self.get_object() # Retrieves based on pk and filtered queryset
        if receipt.receipt_pdf and hasattr(receipt.receipt_pdf, 'path'):
            try:
                # For production, Nginx X-Accel-Redirect or similar is better.
                # FileResponse is good for development or internal serving.
                return FileResponse(receipt.receipt_pdf.open('rb'), 
                                    as_attachment=True, 
                                    filename=f"Receipt-{receipt.receipt_number}.pdf",
                                    content_type='application/pdf')
            except FileNotFoundError:
                logger.error(f"Receipt PDF file not found for {receipt.receipt_number} at path {receipt.receipt_pdf.path}")
                return Response({"error": "Receipt PDF file not found on server."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                logger.error(f"Error serving receipt PDF for {receipt.receipt_number}: {e}", exc_info=True)
                return Response({"error": "Could not serve PDF file due to a server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.warning(f"Receipt PDF not available for download for receipt {receipt.receipt_number} (pk: {pk})")
            return Response({"error": "Receipt PDF not available for this receipt."}, status=status.HTTP_404_NOT_FOUND)


# Example: Admin action to manually trigger receipt (if Celery task failed or for testing)
# This would typically be in an admin interface or a separate secure endpoint.
# class ManualReceiptGenerationAdminView(generics.GenericAPIView):
#     permission_classes = [IsAdminUser] # Ensure only admin users can access
#     serializer_class = ReceiptSerializer # For response

#     def post(self, request, payment_reference):
#         try:
#             payment = Payment.objects.get(reference=payment_reference)
#             if payment.status != 'Paid':
#                 return Response({"error": f"Payment {payment_reference} is not 'Paid'. Current status: {payment.status}."},
#                                 status=status.HTTP_400_BAD_REQUEST)
            
#             if hasattr(payment, 'receipt') and payment.receipt:
#                 serializer = ReceiptSerializer(payment.receipt, context={'request': request})
#                 return Response({"message": "Receipt already exists.", "receipt": serializer.data}, status=status.HTTP_200_OK)
            
#             # Assuming generate_and_save_receipt is available from .services
#             from .services import generate_and_save_receipt 
#             receipt = generate_and_save_receipt(payment)

#             if receipt:
#                 serializer = ReceiptSerializer(receipt, context={'request': request})
#                 return Response({"message": "Receipt generated successfully.", "receipt": serializer.data}, status=status.HTTP_201_CREATED)
#             else:
#                 return Response({"error": "Failed to generate receipt. Check server logs."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         except Payment.DoesNotExist:
#             return Response({"error": f"Payment with reference {payment_reference} not found."}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             logger.error(f"Manual receipt generation error for {payment_reference}: {e}", exc_info=True)
#             return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
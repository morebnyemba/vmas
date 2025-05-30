# backend/payments/tasks.py
from celery import shared_task
from django.conf import settings
import logging

from .models import Payment # , ServiceSubscription (if you have it)
# from core.tasks import send_email_task # If you want to use the generic email task from core

logger = logging.getLogger(__name__)

@shared_task(name="process_successful_payment_task", bind=True, max_retries=3)
def process_successful_payment_task(self, payment_id):
    """
    Celery task to handle post-successful payment actions.
    """
    try:
        payment = Payment.objects.get(pk=payment_id)
        logger.info(f"Processing successful payment for Payment ID: {payment_id}, Reference: {payment.reference}")

        if payment.status != 'paid': # Or whatever your successful status is
            logger.warning(f"Payment ID {payment_id} is not marked as successful (status: {payment.status}). Skipping post-payment processing.")
            return f"Payment ID {payment_id} not in a 'paid' state."

        # 1. Update related models (e.g., ServiceSubscription, Property listing status, etc.)
        # Example: if payment is for a ServiceSubscription
        # if hasattr(payment, 'service_subscription'):
        #     subscription = payment.service_subscription
        #     subscription.is_active = True
        #     subscription.start_date = timezone.now() # Or from payment date
        #     # Calculate end_date based on subscription duration
        #     subscription.save()
        #     logger.info(f"Activated/Updated service subscription {subscription.id} for payment {payment_id}")
        
        # 2. Send a detailed confirmation email/receipt
        subject = f"Your Payment Confirmation for {payment.reference}"
        message_body = f"""
        Dear {payment.buyer_email or 'Customer'},

        Thank you for your payment!
        
        Payment Reference: {payment.reference}
        Amount: {payment.currency} {payment.amount}
        Status: {payment.status}
        Date: {payment.created_at.strftime('%Y-%m-%d %H:%M:%S')}

        {f'Poll URL (for status check): {payment.poll_url}' if payment.poll_url else ''}

        Thank you for choosing Visit Masvingo.
        """
        # This uses the generic email task. Ensure it's imported or implement sending here.
        # from core.tasks import send_email_task
        # send_email_task.delay(
        #     subject=subject,
        #     message=message_body,
        #     recipient_list=[payment.buyer_email] if payment.buyer_email else [settings.ADMIN_EMAIL], # Fallback
        # )
        logger.info(f"Confirmation email queued for payment {payment_id} to {payment.buyer_email}")

        # 3. Notify admins or other relevant parties
        # admin_subject = f"New Successful Payment: {payment.reference}"
        # admin_message = f"Payment received: {payment.reference}, Amount: {payment.amount}, User: {payment.buyer_email}"
        # send_email_task.delay(admin_subject, admin_message, [settings.ADMIN_EMAIL_LIST])


        return f"Successfully processed post-payment actions for Payment ID: {payment_id}"

    except Payment.DoesNotExist:
        logger.warning(f"Payment with ID {payment_id} does not exist.")
        return f"Payment ID {payment_id} not found."
    except Exception as e:
        logger.error(f"Error processing successful payment for Payment ID {payment_id}: {e}", exc_info=True)
        self.retry(exc=e, countdown=60 * (self.request.retries + 1))
        return f"Failed: Error processing payment {payment_id}. Will retry."

@shared_task(name="check_pending_payments_task")
def check_pending_payments_task():
    """
    Periodically checks the status of pending payments with Paynow.
    This would require integrating with Paynow's API to query transaction statuses.
    """
    pending_payments = Payment.objects.filter(status='pending') # Or your equivalent status
    logger.info(f"Checking status for {pending_payments.count()} pending payments.")
    updated_count = 0
    for payment in pending_payments:
        # try:
        #     # This is highly dependent on Paynow's API and your Payment model
        #     # paynow_sdk = Paynow(...) # Initialize Paynow SDK
        #     # status_response = paynow_sdk.check_transaction_status(payment.poll_url or payment.reference)
        #     # new_status = status_response.get('status')
        #     # if new_status and new_status != payment.status:
        #     #     payment.status = new_status
        #     #     # Potentially update other fields based on response
        #     #     payment.paynow_reference = status_response.get('paynowreference', payment.paynow_reference)
        #     #     payment.save()
        #     #     updated_count += 1
        #     #     logger.info(f"Payment {payment.id} status updated to {new_status}.")
        #     #     if new_status == 'paid': # Or your success status
        #     #         process_successful_payment_task.delay(payment.id)
        # except Exception as e:
        #     logger.error(f"Error checking Paynow status for payment {payment.id}: {e}")
        pass # Placeholder for actual Paynow API call
    logger.info(f"Finished checking pending payments. Updated {updated_count} payments.")
    return f"Checked {pending_payments.count()} pending payments, updated {updated_count}."

# backend/payments/tasks.py
from celery import shared_task
from django.conf import settings
import logging

from .models import Payment
from .services import generate_and_save_receipt # Updated import
# from core.tasks import send_email_task

logger = logging.getLogger(__name__)

@shared_task(name="process_successful_payment_task", bind=True, max_retries=3)
def process_successful_payment_task(self, payment_id):
    try:
        payment = Payment.objects.get(pk=payment_id)
        logger.info(f"Processing successful payment for Payment ID: {payment_id}, Reference: {payment.reference}")

        if payment.status != 'Paid':
            logger.warning(f"Payment ID {payment_id} is not 'Paid' (status: {payment.status}). Skipping.")
            return f"Payment ID {payment_id} not in 'Paid' state."

        # 1. Generate and Save Receipt (this now includes PDF generation)
        receipt = generate_and_save_receipt(payment) # Use the new service function
        
        if receipt:
            logger.info(f"Receipt {receipt.receipt_number} processed for payment {payment_id}.")
            if receipt.receipt_pdf:
                logger.info(f"PDF available at: {receipt.receipt_pdf.url}")
        else:
            logger.error(f"Failed to generate or save receipt for payment {payment_id}.")

        # 2. Update related models (e.g., subscriptions)
        # ... (your existing logic) ...
        
        # 3. Send confirmation email (potentially with receipt attached or linked)
        user = payment.user
        if user and user.email: # type: ignore
            subject = f"Payment Confirmation & Receipt - Order {payment.reference}"
            message_body = f"Dear {user.get_full_name() or 'Customer'},\n\nThank you for your payment..." # type: ignore
            if receipt:
                message_body += f"\nReceipt Number: {receipt.receipt_number}"
                if receipt.receipt_pdf:
                    # For linking: Construct full URL if your email client supports it.
                    # pdf_url = settings.SITE_URL + receipt.receipt_pdf.url # Assuming SITE_URL is configured
                    # message_body += f"\nView your receipt PDF: {pdf_url}"
                    pass # Attachment logic would go here if sending email directly
            
            # html_message_content = ... (HTML email)
            
            # Example: Using your core.tasks.send_email_task
            # email_context = {
            #     'user_name': user.get_full_name() or 'Customer',
            #     'payment_reference': payment.reference,
            #     'amount': payment.amount,
            #     'currency': payment.currency,
            #     'receipt_number': receipt.receipt_number if receipt else 'N/A',
            #     'receipt_pdf_url': settings.YOUR_DOMAIN + receipt.receipt_pdf.url if receipt and receipt.receipt_pdf else None
            # }
            # send_email_task.delay(
            #     subject=subject,
            #     template_name='emails/payment_confirmation.html', # Example template
            #     context=email_context,
            #     recipient_list=[user.email],
            #     # For attaching PDF: you might need to modify send_email_task
            #     # or use Django's EmailMessage directly here if attaching.
            #     # attachments=[(f'Receipt-{receipt.receipt_number}.pdf', receipt.receipt_pdf.read(), 'application/pdf')] if receipt and receipt.receipt_pdf else None
            # )
            logger.info(f"Confirmation email queued for payment {payment_id} to {user.email}") # type: ignore
        else:
            logger.warning(f"No user or email for payment {payment_id}. Cannot send confirmation.")

        return f"Successfully processed post-payment actions for Payment ID: {payment_id}"

    except Payment.DoesNotExist:
        logger.warning(f"Payment with ID {payment_id} does not exist.")
        return f"Payment ID {payment_id} not found."
    except Exception as e:
        logger.error(f"Error in process_successful_payment_task for {payment_id}: {e}", exc_info=True)
        self.retry(exc=e, countdown=60 * (self.request.retries + 1)) # type: ignore
        return f"Failed: Error processing payment {payment_id}. Will retry."

# ... (other tasks)
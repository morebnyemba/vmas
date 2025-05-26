# backend/core/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task(name="send_email_task") # Naming the task is good practice
def send_email_task(subject, message, recipient_list, from_email=None, html_message=None):
    """
    A Celery task to send an email.
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL
    try:
        send_mail(
            subject,
            message, # Plain text message
            from_email,
            recipient_list, # List of recipients
            html_message=html_message, # Optional HTML message
            fail_silently=False,
        )
        logger.info(f"Email sent to {recipient_list} with subject: {subject}")
        return f"Email successfully sent to {recipient_list}"
    except Exception as e:
        logger.error(f"Error sending email to {recipient_list}: {e}", exc_info=True)
        # You might want to retry the task here based on the exception
        # self.retry(exc=e, countdown=60) # Example: retry after 60 seconds
        # To use self.retry, the task needs to be bound: @shared_task(bind=True)
        raise # Reraise the exception if you want Celery to mark it as failed


@shared_task(name="send_verification_email_task")
def send_verification_email_task(user_id, verification_url):
    """
    Celery task to send a verification email.
    """
    try:
        user = User.objects.get(pk=user_id)
        subject = 'Verify your email address'
        text_content = f"""
        Hi {user.get_full_name() or user.email},

        Thank you for registering at Visit Masvingo.
        Please click the link below to verify your email address:
        {verification_url}

        If you did not register, please ignore this email.

        Thanks,
        The Visit Masvingo Team
        """
        html_content = f"""
        <p>Hi {user.get_full_name() or user.email},</p>
        <p>Thank you for registering at Visit Masvingo.</p>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="{verification_url}">Verify Email</a></p>
        <p>If you did not register, please ignore this email.</p>
        <p>Thanks,<br>The Visit Masvingo Team</p>
        """
        
        # Call the generic email sending task
        send_email_task.delay(
            subject=subject,
            message=text_content,
            recipient_list=[user.email],
            html_message=html_content
        )
        logger.info(f"Verification email task queued for user {user.email}")
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} does not exist. Cannot send verification email.")
    except Exception as e:
        logger.error(f"Error in send_verification_email_task for user_id {user_id}: {e}", exc_info=True)
        raise

# You can add other tasks here, e.g., for image processing:
# @shared_task(name="process_property_image_task")
# def process_property_image_task(image_id):
#     from .models import PropertyImage # Assuming PropertyImage is in core, adjust if it's in properties app
#     try:
#         image_instance = PropertyImage.objects.get(pk=image_id)
#         # ... your image processing logic ...
#         # For example, generating a thumbnail:
#         # from PIL import Image
#         # from django.core.files.base import ContentFile
#         # import io
#
#         # with Image.open(image_instance.image.path) as img:
#         #     img.thumbnail((100, 100)) # size
#         #     thumb_io = io.BytesIO()
#         #     img.save(thumb_io, format=img.format or 'JPEG')
#         #     image_instance.thumbnail.save(f'thumb_{image_instance.image.name}', ContentFile(thumb_io.getvalue()), save=False)
#         #     image_instance.save(update_fields=['thumbnail'])
#         logger.info(f"Processed image {image_instance.id}")
#     except PropertyImage.DoesNotExist:
#         logger.error(f"PropertyImage with id {image_id} does not exist.")
#     except Exception as e:
#         logger.error(f"Error processing image {image_id}: {e}", exc_info=True)
#         raise

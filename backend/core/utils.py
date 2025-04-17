from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
import os

def generate_verification_link(user):
    token = PasswordResetTokenGenerator().make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    return f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"

def send_verification_email(user):
    subject = "Verify Your Email Address"
    verification_link = generate_verification_link(user)
    
    context = {
        'user': user,
        'verification_link': verification_link
    }
    
    html_message = render_to_string('emails/verify_email.html', context)
    plain_message = strip_tags(html_message)
    
    # Save email to file system
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False
    )
    
    # Create reference copy
    email_dir = settings.EMAIL_FILE_PATH / 'reference_copies'
    os.makedirs(email_dir, exist_ok=True)
    with open(email_dir / f'verification_{user.id}.html', 'w') as f:
        f.write(html_message)
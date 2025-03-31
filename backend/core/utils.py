from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_verification_email(user):
    subject = "Verify Your Email Address"
    html_message = render_to_string('emails/verify_email.html', {
        'user': user,
        'verification_link': generate_verification_link(user)
    })
    plain_message = strip_tags(html_message)
    send_mail(
        subject,
        plain_message,
        'noreply@yourdomain.com',
        [user.email],
        html_message=html_message
    )
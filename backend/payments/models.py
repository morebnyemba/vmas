# backend/payments/models.py
from django.db import models
from encrypted_model_fields.fields import EncryptedCharField, EncryptedTextField
from core.models import User
import uuid
from paynow import Paynow  # Import the Paynow SDK

class PaynowIntegration(models.Model):
    """Securely stores Paynow API credentials (encrypted at DB level)."""
    name = models.CharField(max_length=100, unique=True)
    integration_id = EncryptedCharField(max_length=100)  # Encrypted
    integration_key = EncryptedCharField(max_length=100)  # Encrypted
    return_url = models.URLField(max_length=200)
    result_url = models.URLField(max_length=200)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Paynow Integration"
        verbose_name_plural = "Paynow Integrations"


class Payment(models.Model):
    """Tracks payment transactions with encrypted sensitive fields."""
    STATUS_CHOICES = [
        ('Created', 'Created'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]

    # Payment details
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    reference = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Created')

    # Paynow-specific fields (encrypted)
    integration = models.ForeignKey(
        PaynowIntegration,
        on_delete=models.PROTECT
    )
    paynow_payment_id = EncryptedCharField(max_length=100, blank=True)  # Encrypted
    poll_url = models.URLField(max_length=500, blank=True)
    payment_url = models.URLField(max_length=500, blank=True) # Add payment_url field
    error_message = EncryptedTextField(blank=True)  # Encrypted (for long error logs)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.reference} - {self.status} (${self.amount} {self.currency})"

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['reference']),
        ]
        ordering = ['-created_at']

    def initiate_paynow_payment(self):
        """Initiates a payment with Paynow using the SDK."""
        if not self.integration or not self.integration.is_active:
            self.status = 'Failed'
            self.error_message = "No active Paynow integration found."
            self.save()
            return

        paynow = Paynow(
            integration_id=self.integration.integration_id,
            integration_key=self.integration.integration_key,
            return_url=self.integration.return_url,
            result_url=self.integration.result_url
        )

        payment = paynow.create_payment(
            reference=str(self.reference),
            amount=float(self.amount),
            buyer_email=self.user.email if self.user else None,  # Assuming User model has email
            buyer_phone=None  # You might want to add a phone number field
        )

        try:
            response = payment.send()

            if response.success:
                self.paynow_payment_id = response.paynow_reference
                self.poll_url = response.poll_url
                self.payment_url = response.payment_url
                self.status = 'Sent'
            else:
                self.status = 'Failed'
                self.error_message = response.error
        except Exception as e:
            self.status = 'Failed'
            self.error_message = str(e)
        finally:
            self.save()
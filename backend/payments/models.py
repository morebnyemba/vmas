from django.db import models
from encrypted_model_fields.fields import EncryptedCharField, EncryptedTextField
from core.models import User
import uuid

class PaynowIntegration(models.Model):
    """Securely stores Paynow API credentials (encrypted at DB level)."""
    name = models.CharField(max_length=100, unique=True)
    integration_id = EncryptedCharField(max_length=100)  # Encrypted
    integration_key = EncryptedCharField(max_length=100)  # Encrypted
    return_url = models.URLField(max_length=200)
    result_url = models.URLField(max_length=200)

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
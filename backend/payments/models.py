import uuid
import logging
from decimal import Decimal
from django.db import models
from django.core.exceptions import ValidationError
from encrypted_model_fields.fields import EncryptedCharField, EncryptedTextField
from core.models import User
from paynow import Paynow
from paynow.model import InitResponse
from urllib.parse import urlparse, parse_qs
from django.utils.translation import gettext_lazy as _
# Logger
logger = logging.getLogger(__name__)

class PaynowIntegration(models.Model):
    name = models.CharField(max_length=100, unique=True)
    integration_id = models.CharField(max_length=100)
    integration_key = EncryptedCharField(max_length=100)
    return_url = models.URLField(max_length=200)
    result_url = models.URLField(max_length=200)
    is_active = models.BooleanField(default=True)
    currency = models.CharField(max_length=3, default='USD')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Paynow Integration"
        verbose_name_plural = "Paynow Integrations"

class Payment(models.Model):
    STATUS_CHOICES = [
        ('Created', 'Created'),
        ('Sent', 'Sent'),
        ('Paid', 'Paid'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Created')
    buyer_phone = models.CharField(max_length=20, blank=True, null=True)

    integration = models.ForeignKey(PaynowIntegration, on_delete=models.PROTECT)
    paynow_payment_id = EncryptedCharField(max_length=100, blank=True)
    poll_url = models.URLField(max_length=500, blank=True)
    payment_url = models.URLField(max_length=500, blank=True)
    error_message = EncryptedTextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.reference} - {self.status} (${self.amount} {self.currency})"

    def clean(self):
        if self.integration and self.currency != self.integration.currency:
            raise ValidationError(
                f"Payment currency {self.currency} does not match integration's currency {self.integration.currency}"
            )

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['reference']),
        ]
        ordering = ['-created_at']

    def initiate_paynow_payment(self):
        retries = 3
        for attempt in range(retries):
            try:
                logger.info(f"[{self.reference}] Attempt {attempt + 1}: Starting Paynow initiation.")

                if not self.integration or not self.integration.is_active:
                    raise ValueError("No active Paynow integration found.")

                if self.currency != self.integration.currency:
                    raise ValueError("Currency mismatch with integration")

                paynow = Paynow(
                    self.integration.integration_id,
                    self.integration.integration_key,
                    self.integration.return_url,
                    self.integration.result_url
                )

                logger.debug(f"[{self.reference}] Using integration {self.integration.name}.")

                email = self.user.email if self.user and self.user.email else 'test@example.com'
                item_desc = f"Payment {self.reference}"
                payment = paynow.create_payment(f"Order {self.reference}", email)
                payment.add(item_desc, float(self.amount.quantize(Decimal("0.00"))))

                logger.info(f"[{self.reference}] Sending payment to Paynow...")
                logger.debug(f"[{self.reference}] Payment details: email={email}, item={item_desc}, amount={self.amount}")

                response = paynow.send(payment)

                logger.debug(f"[{self.reference}] Paynow response object: {response}")
                logger.debug(f"[{self.reference}] Paynow response class: {type(response)}")
                logger.debug(f"[{self.reference}] Paynow raw response vars: {vars(response)}")

                if isinstance(response, InitResponse):
                    if response.success:
                        self.poll_url = response.poll_url
                        self.payment_url = response.redirect_url

                        # Extract reference (GUID) from poll_url
                        parsed_url = urlparse(self.poll_url)
                        query_params = parse_qs(parsed_url.query)
                        self.paynow_payment_id = query_params.get('guid', [None])[0]

                        self.status = 'Sent'
                        logger.info(f"[{self.reference}] Payment initiated successfully.")
                    else:
                        self.status = 'Failed'
                        self.error_message = response.error
                        logger.error(
                            f"[{self.reference}] Payment initiation failed: {response.error} | "
                            f"Status: {getattr(response, 'status', 'N/A')} | "
                            f"PollUrl: {getattr(response, 'poll_url', 'N/A')} | "
                            f"RedirectUrl: {getattr(response, 'redirect_url', 'N/A')} | "
                            f"Reference: {getattr(response, 'reference', 'N/A')} | "
                            f"Hash: {getattr(response, 'hash', 'N/A')}"
                        )
                else:
                    self.status = 'Failed'
                    self.error_message = 'Unexpected response from Paynow'
                    logger.error(f"[{self.reference}] Payment failed: Unexpected response from Paynow (type={type(response)})")

                self.save()
                break

            except Exception as e:
                logger.error(f"[{self.reference}] Attempt {attempt + 1} failed: {str(e)}")
                if attempt == retries - 1:
                    self.status = 'Failed'
                    self.error_message = f"Failed after {retries} attempts: {str(e)}"
                    self.save()
class Receipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(_('Receipt Number'), max_length=50, unique=True, blank=True)
    issued_at = models.DateTimeField(_('Issued At'), auto_now_add=True)
    
    customer_name = models.CharField(_('Customer Name'), max_length=255, blank=True)
    customer_email = models.EmailField(_('Customer Email'), blank=True)
    customer_phone = models.CharField(_('Customer Phone'), max_length=20, blank=True, null=True)
    
    amount_paid = models.DecimalField(_('Amount Paid'), max_digits=10, decimal_places=2)
    currency = models.CharField(_('Currency'), max_length=3)
    payment_method_details = models.CharField(_('Payment Method'), max_length=100, blank=True)
    
    items_description = models.TextField(_('Items/Services Description'), blank=True)
    # If you prefer structured item details with ReportLab, you might process a JSONField here
    # or pass structured data directly to the ReportLab generation function.
    # itemized_details = models.JSONField(_('Itemized Details'), default=list, blank=True) 
    
    receipt_pdf = models.FileField(_('Receipt PDF'), upload_to='receipts/pdfs/', blank=True, null=True)
    notes = models.TextField(_('Additional Notes'), blank=True, null=True)

    def __str__(self):
        return f"Receipt {self.receipt_number} for Payment {self.payment.reference}"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            # Generate a unique receipt number
            today_str = self.issued_at.strftime('%Y%m%d')
            last_receipt_today = Receipt.objects.filter(receipt_number__startswith=f"RCPT-{today_str}-").order_by('receipt_number').last()
            if last_receipt_today:
                try:
                    last_num_str = last_receipt_today.receipt_number.split('-')[-1]
                    new_num = int(last_num_str) + 1
                except (ValueError, IndexError):
                    new_num = 1 # Fallback
            else:
                new_num = 1
            self.receipt_number = f"RCPT-{today_str}-{new_num:04d}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-issued_at']
        verbose_name = _('Receipt')
        verbose_name_plural = _('Receipts')

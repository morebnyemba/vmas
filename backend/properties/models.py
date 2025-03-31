from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from core.models import User, Agency  # Using your existing Agency model from core
from datetime import date

class Property(models.Model):
    PROPERTY_TYPES = [
        ('apartment', _('Apartment')),
        ('house', _('House')),
        ('land', _('Land')),
        ('commercial', _('Commercial')),
    ]
    STATUS_CHOICES = [
        ('available', _('Available')),
        ('sold', _('Sold')),
        ('rented', _('Rented')),
        ('under_maintenance', _('Under Maintenance')),
    ]
    
    # Basic Information
    title = models.CharField(_('Title'), max_length=255)
    description = models.TextField(_('Description'))
    property_type = models.CharField(_('Type'), max_length=20, choices=PROPERTY_TYPES)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='available')
    featured = models.BooleanField(_('Featured Property'), default=False,
                                  help_text=_('Mark this property as featured'))
    
    # Location Details
    address = models.CharField(_('Address'), max_length=255)
    city = models.CharField(_('City'), max_length=100)
    state = models.CharField(_('State'), max_length=100)
    zip_code = models.CharField(_('Zip Code'), max_length=20)
    
    # Pricing & Measurements
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    viewing_fee = models.DecimalField(
        _('Viewing Fee'),
        max_digits=10,
        decimal_places=2,
        default=50.00,
        help_text=_('Fee required to view this property')
    )
    bedrooms = models.IntegerField(_('Bedrooms'), default=0)
    bathrooms = models.DecimalField(_('Bathrooms'), max_digits=3, decimal_places=1, default=0)
    area = models.DecimalField(_('Area (sq ft)'), max_digits=10, decimal_places=2)
    
    # Relationships
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties',
        verbose_name=_('Owner')
    )
    listing_agency = models.ForeignKey(
        Agency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listed_properties',
        verbose_name=_('Listing Agency'),
        help_text=_('Agency that listed this property')
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_property_type_display()})"

    class Meta:
        verbose_name = _('Property')
        verbose_name_plural = _('Properties')
        ordering = ['-created_at']

class PropertyImage(models.Model):
    PROCESSING_STATUS = [
        ('pending', _('Pending Processing')),
        ('processed', _('Processed')),
        ('failed', _('Processing Failed')),
    ]
    
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('Property')
    )
    image = models.ImageField(
        _('Image'),
        upload_to='property_images/',
        help_text=_('Upload high-quality property photos (JPEG/PNG)')
    )
    thumbnail = models.ImageField(
        _('Thumbnail'),
        upload_to='property_thumbnails/',
        null=True,
        blank=True,
        help_text=_('Automatically generated thumbnail image')
    )
    processing_status = models.CharField(
        _('Processing Status'),
        max_length=20,
        choices=PROCESSING_STATUS,
        default='pending'
    )
    is_primary = models.BooleanField(_('Primary Image'), default=False)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"
    
    def clean(self):
        if self.is_primary:
            existing_primary = PropertyImage.objects.filter(
                property=self.property,
                is_primary=True
            ).exclude(pk=self.pk).exists()
            if existing_primary:
                raise ValidationError(_('A primary image already exists for this property'))

    class Meta:
        verbose_name = _('Property Image')
        verbose_name_plural = _('Property Images')

class PropertyVideo(models.Model):
    PROCESSING_STATUS = [
        ('pending', _('Pending Processing')),
        ('processed', _('Processed')),
        ('failed', _('Processing Failed')),
    ]
    
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='videos',
        verbose_name=_('Property')
    )
    video_file = models.FileField(
        _('Video'),
        upload_to='property_videos/',
        help_text=_('Upload MP4/MOV file for 360 view (max 500MB)')
    )
    thumbnail = models.ImageField(
        _('Video Thumbnail'),
        upload_to='video_thumbnails/',
        null=True,
        blank=True,
        help_text=_('Automatically generated video thumbnail')
    )
    processing_status = models.CharField(
        _('Processing Status'),
        max_length=20,
        choices=PROCESSING_STATUS,
        default='pending'
    )
    duration = models.PositiveIntegerField(
        _('Duration (seconds)'),
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"Video for {self.property.title}"
    
    def clean(self):
        if self.video_file:
            file_size = self.video_file.size
            if file_size > 524288000:  # 500MB
                raise ValidationError(_('Maximum video file size is 500MB'))
            if not self.video_file.name.lower().endswith(('.mp4', '.mov')):
                raise ValidationError(_('Only MP4 and MOV files are allowed'))

    class Meta:
        verbose_name = _('Property Video')
        verbose_name_plural = _('Property Videos')

class ServiceSubscription(models.Model):
    SERVICE_TYPES = [
        ('viewing', _('Property Viewing Access')),
        ('rental', _('Rental Processing')),
        ('purchase', _('Purchase Processing')),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name=_('User')
    )
    service_type = models.CharField(
        _('Service Type'),
        max_length=20,
        choices=SERVICE_TYPES
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name=_('Property')
    )
    valid_until = models.DateTimeField(
        _('Valid Until'),
        help_text=_('Subscription expiration date')
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property', 'service_type')
        verbose_name = _('Service Subscription')
        verbose_name_plural = _('Service Subscriptions')

    def is_active(self):
        return self.valid_until > timezone.now()

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('admin', _('Administration Fee')),
        ('processing', _('Processing Fee')),
        ('commitment', _('Commitment Fee')),
        ('viewing', _('Viewing Fee')),
        ('rent', _('Rent Payment')),
        ('purchase', _('Purchase Payment')),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions',
        verbose_name=_('User')
    )
    transaction_type = models.CharField(
        _('Type'),
        max_length=20,
        choices=TRANSACTION_TYPES
    )
    amount = models.DecimalField(
        _('Amount'),
        max_digits=10,
        decimal_places=2
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Property')
    )
    subscription = models.ForeignKey(
        ServiceSubscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Service Subscription')
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    payment_id = models.CharField(
        _('Payment ID'),
        max_length=255,
        unique=True,
        help_text=_('Unique identifier from payment processor')
    )

    class Meta:
        verbose_name = _('Transaction')
        verbose_name_plural = _('Transactions')
        ordering = ['-created_at']

class RentalContract(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='rental_contracts',
        verbose_name=_('Property')
    )
    tenant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='rental_contracts',
        verbose_name=_('Tenant')
    )
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'))
    monthly_rent = models.DecimalField(
        _('Monthly Rent'),
        max_digits=10,
        decimal_places=2
    )
    security_deposit = models.DecimalField(
        _('Security Deposit'),
        max_digits=10,
        decimal_places=2
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    is_active = models.BooleanField(_('Active'), default=True)

    def total_fees(self):
        return self.transactions.aggregate(
            total=models.Sum('amount')
        )['total'] or 0

    class Meta:
        verbose_name = _('Rental Contract')
        verbose_name_plural = _('Rental Contracts')

class SaleContract(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='sale_contracts',
        verbose_name=_('Property')
    )
    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='purchase_contracts',
        verbose_name=_('Buyer')
    )
    sale_price = models.DecimalField(
        _('Sale Price'),
        max_digits=10,
        decimal_places=2
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    is_completed = models.BooleanField(_('Completed'), default=False)

    def total_fees(self):
        return self.transactions.aggregate(
            total=models.Sum('amount')
        )['total'] or 0

    class Meta:
        verbose_name = _('Sale Contract')
        verbose_name_plural = _('Sale Contracts')
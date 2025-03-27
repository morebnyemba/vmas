from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from core.models import User
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
    
    # Location Details
    address = models.CharField(_('Address'), max_length=255)
    city = models.CharField(_('City'), max_length=100)
    state = models.CharField(_('State'), max_length=100)
    zip_code = models.CharField(_('Zip Code'), max_length=20)
    
    # Pricing & Measurements
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
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
    
    # Timestamps
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_property_type_display()})"

    def get_absolute_url(self):
        return reverse('property-detail', kwargs={'pk': self.pk})

    def is_available(self):
        return self.status == 'available'
    
    def mark_as_sold(self):
        self.status = 'sold'
        self.save()
    
    class Meta:
        verbose_name = _('Property')
        verbose_name_plural = _('Properties')
        ordering = ['-created_at']

class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name=_('Property')
    )
    image = models.ImageField(
        _('Image'),
        upload_to='property_images/',
        help_text=_('Upload high-quality property photos')
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
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='videos',
        verbose_name=_('Property')
    )
    video_file = models.FileField(
        _('360 Video'),
        upload_to='property_videos/',
        help_text=_('Upload MP4/MOV file for 360 view (max 500MB)')
    )
    duration = models.PositiveIntegerField(
        _('Duration (seconds)'),
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"360 Video for {self.property.title}"
    
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
        related_name='rentals',
        verbose_name=_('Tenant')
    )
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'))
    monthly_rent = models.DecimalField(_('Monthly Rent'), max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(_('Security Deposit'), max_digits=10, decimal_places=2)
    is_active = models.BooleanField(_('Active Contract'), default=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"Rental Contract: {self.property.title} - {self.tenant}"

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError(_('End date must be after start date'))
        if self.start_date < date.today():
            raise ValidationError(_('Start date cannot be in the past'))
    
    def save(self, *args, **kwargs):
        self.property.status = 'rented'
        self.property.save()
        super().save(*args, **kwargs)
    
    def contract_duration(self):
        return (self.end_date - self.start_date).days
    
    def total_rent_value(self):
        return self.monthly_rent * (self.contract_duration() // 30)
    
    class Meta:
        ordering = ['-start_date']

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
        related_name='purchases',
        verbose_name=_('Buyer')
    )
    sale_price = models.DecimalField(_('Sale Price'), max_digits=10, decimal_places=2)
    sale_date = models.DateField(_('Sale Date'), default=date.today)
    closing_costs = models.DecimalField(_('Closing Costs'), max_digits=10, decimal_places=2, default=0)
    commission_rate = models.DecimalField(_('Commission Rate'), max_digits=5, decimal_places=2, default=2.5)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    def __str__(self):
        return f"Sale Contract: {self.property.title} - {self.buyer}"
    
    def clean(self):
        if self.sale_date > date.today():
            raise ValidationError(_('Sale date cannot be in the future'))
    
    def save(self, *args, **kwargs):
        self.property.status = 'sold'
        self.property.save()
        super().save(*args, **kwargs)
    
    def total_commission(self):
        return (self.commission_rate / 100) * self.sale_price
    
    def total_transaction_value(self):
        return self.sale_price + self.closing_costs
    
    class Meta:
        ordering = ['-sale_date']
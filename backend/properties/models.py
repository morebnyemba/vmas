# properties/models.py
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from core.models import User, Agency
from datetime import date
import magic


class PlaceOfInterest(models.Model):
    PLACE_TYPES = [
        ('school', _('School')),
        ('hospital', _('Hospital')),
        ('park', _('Park')),
        ('shopping', _('Shopping Center')),
        ('transport', _('Public Transport')),
        ('restaurant', _('Restaurant')),
        ('other', _('Other')),
    ]


    name = models.CharField(_('Name'), max_length=255)
    place_type = models.CharField(_('Type'), max_length=20, choices=PLACE_TYPES, default='other')
    address = models.CharField(_('Address'), max_length=255, blank=True)
    latitude = models.DecimalField(_('Latitude'), max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=9, decimal_places=6, null=True, blank=True)


    def __str__(self):
        return f"{self.get_place_type_display()}: {self.name}"


    class Meta:
        verbose_name = _('Place of Interest')
        verbose_name_plural = _('Places of Interest')


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
    LISTING_TYPES = [
        ('sale', _('For Sale')),
        ('rent', _('For Rent')),
        ('both', _('For Sale and Rent')),
    ]


    # Basic Information
    title = models.CharField(_('Title'), max_length=255)
    description = models.TextField(_('Description'))
    property_type = models.CharField(_('Type'), max_length=20, choices=PROPERTY_TYPES)
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='available')
    listing_type = models.CharField(_('Listing Type'), max_length=10, choices=LISTING_TYPES, default='sale')
    featured = models.BooleanField(_('Featured Property'), default=False)


    # Location Details
    address = models.CharField(_('Address'), max_length=255)
    city = models.CharField(_('City'), max_length=100)
    state = models.CharField(_('State'), max_length=100)
    zip_code = models.CharField(_('Zip Code'), max_length=20)


    # Pricing & Measurements
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    viewing_fee = models.DecimalField(_('Viewing Fee'), max_digits=10, decimal_places=2, default=50.00)
    bedrooms = models.IntegerField(_('Bedrooms'), default=0)
    bathrooms = models.DecimalField(_('Bathrooms'), max_digits=3, decimal_places=1, default=0)
    area = models.DecimalField(_('Area (sq ft)'), max_digits=10, decimal_places=2)


    # Relationships
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    listing_agency = models.ForeignKey(Agency, on_delete=models.SET_NULL, null=True, blank=True, related_name='listed_properties')
    places_of_interest = models.ManyToManyField(PlaceOfInterest, through='PropertyPlaceOfInterest', related_name='properties')


    # Timestamps
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)


    def __str__(self):
        return f"{self.title} ({self.get_property_type_display()})"


    def clean(self):
        super().clean()  # Always call super().clean()
        if self.listing_type == 'rent' and self.status == 'sold':
            raise ValidationError(_("A rental property cannot have status 'sold'"))
        if self.listing_type == 'sale' and self.status == 'rented':
            raise ValidationError(_("A sale property cannot have status 'rented'"))


    class Meta:
        verbose_name = _('Property')
        verbose_name_plural = _('Properties')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['price']),  # Index on price
            models.Index(fields=['city']),  # Index on city
            models.Index(fields=['property_type', 'status']), #複合索引
        ]


class PropertyPlaceOfInterest(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_places')
    place = models.ForeignKey(PlaceOfInterest, on_delete=models.CASCADE)
    distance = models.DecimalField(_('Distance (miles)'), max_digits=5, decimal_places=1)


    class Meta:
        unique_together = ('property', 'place')
        verbose_name = _('Property Place of Interest')
        verbose_name_plural = _('Property Places of Interest')


    def __str__(self):
        return f"{self.place.name} ({self.distance}mi from {self.property.title})"


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(_('Image'), upload_to='property_images/')
    thumbnail = models.ImageField(_('Thumbnail'), upload_to='property_thumbnails/', null=True, blank=True)
    is_primary = models.BooleanField(_('Primary Image'), default=False)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)


    def __str__(self):
        return f"Image for {self.property.title}"


    def clean(self):
        super().clean()  # Always call super().clean()
        if self.image:
            mime = magic.Magic(mime=True)
            file_mime = mime.from_buffer(self.image.read(2048))  # Read the first 2048 bytes
            if file_mime not in ['image/jpeg', 'image/png', 'image/gif']:
                raise ValidationError(_('Only JPEG, PNG, and GIF images are allowed.'))
            self.image.seek(0)  # Reset file pointer after reading


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
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='videos')
    video_file = models.FileField(_('Video'), upload_to='property_videos/')
    thumbnail = models.ImageField(_('Video Thumbnail'), upload_to='video_thumbnails/', null=True, blank=True)
    duration = models.PositiveIntegerField(_('Duration (seconds)'), blank=True, null=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)


    def __str__(self):
        return f"Video for {self.property.title}"


    def clean(self):
        super().clean()  # Always call super().clean()
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


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    service_type = models.CharField(_('Service Type'), max_length=20, choices=SERVICE_TYPES)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='subscriptions')
    valid_until = models.DateTimeField(_('Valid Until'))
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


    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(_('Type'), max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(_('Amount'), max_digits=10, decimal_places=2)
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True)
    subscription = models.ForeignKey(ServiceSubscription, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    payment_id = models.CharField(_('Payment ID'), max_length=255, unique=True)


    class Meta:
        verbose_name = _('Transaction')
        verbose_name_plural = _('Transactions')
        ordering = ['-created_at']


class RentalContract(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='rental_contracts')
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rental_contracts')
    start_date = models.DateField(_('Start Date'))
    end_date = models.DateField(_('End Date'))
    monthly_rent = models.DecimalField(_('Monthly Rent'), max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(_('Security Deposit'), max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    is_active = models.BooleanField(_('Active'), default=True)


    def total_fees(self):
        return self.transactions.aggregate(total=models.Sum('amount'))['total'] or 0


    class Meta:
        verbose_name = _('Rental Contract')
        verbose_name_plural = _('Rental Contracts')


class SaleContract(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='sale_contracts')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchase_contracts')
    sale_price = models.DecimalField(_('Sale Price'), max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    is_completed = models.BooleanField(_('Completed'), default=False)


    def total_fees(self):
        return self.transactions.aggregate(total=models.Sum('amount'))['total'] or 0


    class Meta:
        verbose_name = _('Sale Contract')
        verbose_name_plural = _('Sale Contracts')


class PropertyInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='interests')
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)


    class Meta:
        unique_together = ('user', 'property')
        verbose_name = _('Property Interest')
        verbose_name_plural = _('Property Interests')


    def __str__(self):
        return f"{self.user.username} - {self.property.title}"
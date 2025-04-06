from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.core.validators import validate_email, RegexValidator
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from datetime import date
import json
from django.core.exceptions import ValidationError
from encrypted_model_fields.fields import EncryptedCharField, EncryptedTextField
from django.db.models import Q
from phonenumber_field.modelfields import PhoneNumberField

class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')

        validate_email(email)
        email = self.normalize_email(email).lower()
        
        user = self.model(
            email=email,
            first_name=first_name.strip(),
            last_name=last_name.strip(),
            **extra_fields
        )
        
        if password:
            from django.contrib.auth.password_validation import validate_password
            validate_password(password)
            user.set_password(password)
            
        user.full_clean()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_agent(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('role', 'agent')
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_customer(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('role', 'customer')
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_agency_admin(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('role', 'agency_admin')
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def get_active_agents(self):
        return self.filter(role='agent', is_active=True).select_related('agency')

    def get_agency_agents(self, agency):
        return self.filter(agency=agency, role='agent', is_active=True)

class License(models.Model):
    LICENSE_TYPES = (
        ('sales', _('Sales License')),
        ('broker', _('Broker License')),
        ('appraiser', _('Appraiser License')),
    )
    
    number = models.CharField(_('License Number'), max_length=100)
    type = models.CharField(_('License Type'), max_length=20, choices=LICENSE_TYPES)
    state = models.CharField(_('Issuing State'), max_length=100)
    expiry_date = models.DateField(_('Expiry Date'))
    verified = models.BooleanField(_('Verified'), default=False)
    verified_at = models.DateTimeField(_('Verified At'), blank=True, null=True)
    document = models.FileField(
        _('License Document'),
        upload_to='licenses/',
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['-expiry_date']
        
    def __str__(self):
        return f"{self.get_type_display()} - {self.number}"

class Specialization(models.Model):
    name = models.CharField(_('Name'), max_length=100)
    description = models.TextField(_('Description'), blank=True)

    class Meta:
        ordering = ['name']
        
    def __str__(self):
        return self.name

class Agency(models.Model):
    name = models.CharField(_('Agency Name'), max_length=255, unique=True)
    description = models.TextField(_('Description'), blank=True, null=True)
    website = models.URLField(_('Website'), blank=True, null=True)
    logo = models.ImageField(_('Logo'), upload_to='agency_logos/', blank=True, null=True)
    verified = models.BooleanField(_('Verified'), default=False)
    verified_at = models.DateTimeField(_('Verified At'), blank=True, null=True)
    founded_date = models.DateField(_('Founded Date'), blank=True, null=True)
    address = models.TextField(_('Address'), blank=True, null=True)
    latitude = models.FloatField(_('Latitude'), blank=True, null=True)
    longitude = models.FloatField(_('Longitude'), blank=True, null=True)
    service_areas = models.JSONField(
        blank=True,
        default=list,
        verbose_name=_('Service Areas')
    )
    languages = models.JSONField(
        blank=True,
        default=list,
        verbose_name=_('Languages Spoken')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = _('Agencies')
        ordering = ['name']

    def clean(self):
        if self.verified and not self.verified_at:
            self.verified_at = timezone.now()
        super().clean()

    @property
    def active_agents(self):
        return self.members.filter(role='agent', is_active=True)

    @property
    def agent_count(self):
        return self.active_agents.count()

class User(AbstractBaseUser, PermissionsMixin):
    # Core Fields
    email = models.EmailField(_('Email address'), max_length=255, unique=True, db_index=True)
    first_name = models.CharField(_('First name'), max_length=255)
    last_name = models.CharField(_('Last name'), max_length=255)
    is_active = models.BooleanField(_('Active'), default=True)
    is_staff = models.BooleanField(_('Staff status'), default=False)
    date_of_birth = models.DateField(_('Date of Birth'), blank=True, null=True)
    
    # Profile Fields
    profile_picture = models.ImageField(_('Profile Picture'), upload_to='profile_pics/', blank=True, null=True)
    cover_photo = models.ImageField(_('Cover Photo'), upload_to='cover_photos/', blank=True, null=True)
    bio = models.TextField(_('Bio'), blank=True, null=True)
    
    GENDER_CHOICES = (
        ('male', _('Male')),
        ('female', _('Female')),
        ('other', _('Other')),
        ('prefer_not_to_say', _('Prefer not to say')),
    )
    gender = models.CharField(_('Gender'), max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    
    # Contact Information
    phone_number = PhoneNumberField(_('Phone number'), blank=True, null=True, unique=True)
    alternate_phone = PhoneNumberField(_('Alternate phone'), blank=True, null=True)
    email_verified = models.BooleanField(_('Email Verified'), default=False)
    email_verified_at = models.DateTimeField(_('Email Verified At'), blank=True, null=True)
    phone_verified = models.BooleanField(_('Phone Verified'), default=False)
    phone_verified_at = models.DateTimeField(_('Phone Verified At'), blank=True, null=True)
    
    # Agent-Specific Fields
    licenses = models.ManyToManyField(License, verbose_name=_('Licenses'), blank=True)
    specializations = models.ManyToManyField(Specialization, verbose_name=_('Specializations'), blank=True)
    years_of_experience = models.PositiveIntegerField(_('Years of Experience'), blank=True, null=True)
    languages = models.JSONField(blank=True, default=list, verbose_name=_('Languages Spoken'))
    service_areas = models.JSONField(blank=True, default=list, verbose_name=_('Service Areas'))
    average_response_time = models.PositiveIntegerField(_('Average Response Time (hours)'), blank=True, null=True)
    rating = models.DecimalField(_('Rating'), max_digits=3, decimal_places=2, blank=True, null=True)
    reviews_count = models.PositiveIntegerField(_('Reviews Count'), default=0)
    
    # Social Media Links
    facebook_url = models.URLField(_('Facebook Profile'), blank=True, null=True)
    linkedin_url = models.URLField(_('LinkedIn Profile'), blank=True, null=True)
    twitter_url = models.URLField(_('Twitter Profile'), blank=True, null=True)
    instagram_url = models.URLField(_('Instagram Profile'), blank=True, null=True)
    
    # Security Fields
    failed_login_attempts = models.PositiveIntegerField(_('Failed Login Attempts'), default=0)
    account_locked_until = models.DateTimeField(_('Account Locked Until'), blank=True, null=True)
    tfa_enabled = models.BooleanField(_('2FA Enabled'), default=False)
    tfa_secret = EncryptedCharField(_('2FA Secret'), max_length=255, blank=True, null=True)
    
    # Activity Tracking
    last_login = models.DateTimeField(_('Last Login'), blank=True, null=True)
    last_activity = models.DateTimeField(_('Last Activity'), blank=True, null=True)
    is_online = models.BooleanField(_('Online Status'), default=False)
    last_seen = models.DateTimeField(_('Last Seen'), blank=True, null=True)
    
    # Preferences
    notification_preferences = models.JSONField(_('Notification Preferences'), default=dict, blank=True)
    communication_preferences = models.JSONField(_('Communication Preferences'), default=dict, blank=True)
    
    # Agency Fields
    agency = models.ForeignKey(
        Agency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members'
    )
    agency_role = models.CharField(
        _('Agency Role'),
        max_length=50,
        blank=True,
        null=True,
        choices=(
            ('agent', _('Agent')),
            ('manager', _('Manager')),
            ('admin', _('Administrator')),
            ('owner', _('Owner')),
        )
    )
    agency_verified = models.BooleanField(_('Agency Verified'), default=False)
    agency_verified_at = models.DateTimeField(_('Agency Verified At'), blank=True, null=True)
    verification_documents = models.FileField(
        _('Verification Documents'),
        upload_to='verifications/',
        blank=True,
        null=True
    )
    
    # Roles
    USER_ROLES = (
        ('customer', _('Customer')),
        ('admin', _('Admin')),
        ('agent', _('Agent')),
        ('agency_admin', _('Agency Admin')),
        ('agency_staff', _('Agency Staff')),
    )
    role = models.CharField(
        _('Role'),
        max_length=20,
        choices=USER_ROLES,
        default='customer'
    )

    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        indexes = [
            models.Index(fields=['email', 'created_at']),
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['agency', 'role']),
            models.Index(fields=['is_active', 'role']),
            models.Index(fields=['rating']),
            models.Index(fields=['years_of_experience']),
        ]
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return f"{self.full_name} ({self.email})"

    def clean(self):
        if self.role not in ['agent', 'agency_admin', 'agency_staff'] and self.agency:
            raise ValidationError("Non-agency roles cannot be associated with an agency.")
        
        if self.email_verified and not self.email_verified_at:
            self.email_verified_at = timezone.now()
        if self.phone_verified and not self.phone_verified_at:
            self.phone_verified_at = timezone.now()
        if self.agency_verified and not self.agency_verified_at:
            self.agency_verified_at = timezone.now()

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        self.first_name = self.first_name.strip()
        self.last_name = self.last_name.strip()
        
        # Set staff status based on role
        self.is_staff = self.role in ['admin', 'agent', 'agency_admin', 'agency_staff']
            
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_agent(self):
        return self.role == 'agent'

    @property
    def is_agency_admin(self):
        return self.role == 'agency_admin'

    @property
    def is_independent_agent(self):
        return self.role == 'agent' and not self.agency

    @property
    def active_licenses(self):
        """Returns only active (non-expired) licenses"""
        today = date.today()
        return self.licenses.filter(expiry_date__gte=today)

    def get_service_areas(self):
        """Returns combined service areas (agent + agency)"""
        if self.agency:
            return list(set(self.service_areas + self.agency.service_areas))
        return self.service_areas

    def update_rating(self, new_rating):
        """Update agent rating with new review"""
        if not self.rating:
            self.rating = new_rating
        else:
            total_rating = self.rating * self.reviews_count
            self.rating = (total_rating + new_rating) / (self.reviews_count + 1)
        self.reviews_count += 1
        self.save(update_fields=['rating', 'reviews_count'])

    def get_absolute_url(self):
        """Get URL for user's public profile"""
        if self.is_agent:
            return reverse('agent_profile', kwargs={'pk': self.pk})
        return reverse('user_profile', kwargs={'pk': self.pk})

class AgentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='agent_profile',
        limit_choices_to={'role': 'agent'}
    )
    professional_title = models.CharField(_('Professional Title'), max_length=100, blank=True)
    certifications = models.TextField(_('Certifications'), blank=True)
    education = models.TextField(_('Education'), blank=True)
    awards = models.TextField(_('Awards & Recognition'), blank=True)
    specialties = models.TextField(_('Specialties'), blank=True)
    testimonial_video = models.URLField(_('Testimonial Video URL'), blank=True)
    office_hours = models.JSONField(_('Office Hours'), default=dict, blank=True)
    appointment_slots = models.JSONField(_('Available Appointment Slots'), default=list, blank=True)

    class Meta:
        verbose_name = _('Agent Profile')
        verbose_name_plural = _('Agent Profiles')

    def __str__(self):
        return f"Profile for {self.user.full_name}"

class UserActivityLog(models.Model):
    ACTION_CHOICES = (
        ('login', _('Login')),
        ('logout', _('Logout')),
        ('profile_update', _('Profile Update')),
        ('password_change', _('Password Change')),
        ('property_view', _('Property View')),
        ('property_save', _('Property Saved')),
        ('property_contact', _('Property Contact')),
        ('agent_contact', _('Agent Contact')),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(_('Action'), max_length=50, choices=ACTION_CHOICES)
    details = models.JSONField(_('Details'), default=dict, blank=True)
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True)
    ip_address = models.GenericIPAddressField(_('IP Address'), blank=True, null=True)
    user_agent = models.TextField(_('User Agent'), blank=True, null=True)
    device_id = models.CharField(_('Device ID'), max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = _('User Activity Log')
        verbose_name_plural = _('User Activity Logs')

    def __str__(self):
        return f"{self.user} - {self.get_action_display()} at {self.timestamp}"

class UserDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    device_name = models.CharField(_('Device Name'), max_length=255)
    device_type = models.CharField(_('Device Type'), max_length=100)
    os = models.CharField(_('Operating System'), max_length=100)
    browser = models.CharField(_('Browser'), max_length=100)
    ip_address = models.GenericIPAddressField(_('IP Address'))
    last_used = models.DateTimeField(_('Last Used'))
    is_trusted = models.BooleanField(_('Trusted Device'), default=False)

    class Meta:
        verbose_name = _('User Device')
        verbose_name_plural = _('User Devices')

    def __str__(self):
        return f"{self.user}'s {self.device_name}"

class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    property = models.ForeignKey(
        'properties.Property',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    agent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        limit_choices_to={'role': 'agent'},
        related_name='favorited_by'
    )
    search_parameters = models.JSONField(_('Search Parameters'), blank=True, null=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)

    class Meta:
        unique_together = [
            ('user', 'property'),
            ('user', 'agent')
        ]
        verbose_name = _('User Favorite')
        verbose_name_plural = _('User Favorites')

    def clean(self):
        if not self.property and not self.agent and not self.search_parameters:
            raise ValidationError(_('Either property, agent or search parameters must be set.'))
        if self.property and self.agent:
            raise ValidationError(_('Cannot favorite both property and agent in the same record.'))

    def __str__(self):
        if self.property:
            return f"{self.user}'s favorite property {self.property}"
        elif self.agent:
            return f"{self.user}'s favorite agent {self.agent}"
        return f"{self.user}'s saved search"
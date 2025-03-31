from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.core.validators import validate_email, RegexValidator, URLValidator
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from datetime import date
import json


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and saves a new user with required fields"""
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
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and saves a new superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_staff_user(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates a staff user"""
        extra_fields.setdefault('role', 'staff')
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_customer(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates a customer user"""
        extra_fields.setdefault('role', 'customer')
        return self.create_user(email, first_name, last_name, password, **extra_fields)

    def create_agency(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates an agency user"""
        extra_fields.setdefault('role', 'agency')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_company_member', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)


class Agency(models.Model):
    name = models.CharField(_('Agency Name'), max_length=255, unique=True)
    description = models.TextField(_('Description'), blank=True, null=True)
    website = models.URLField(_('Website'), blank=True, null=True)
    verified = models.BooleanField(_('Verified'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = _('Agencies')


class AgencyPermissionsMixin:
    def has_agency_perm(self, perm):
        return self.get_agency_permissions().get(perm, False)

    def can_manage_agency_content(self):
        return self.role == 'agency' and self.agency_verified


class User(AbstractBaseUser, PermissionsMixin, AgencyPermissionsMixin):
    # Core Fields
    email = models.EmailField(_('Email address'), max_length=255, unique=True, db_index=True)
    first_name = models.CharField(_('First name'), max_length=255)
    last_name = models.CharField(_('Last name'), max_length=255)
    is_active = models.BooleanField(_('Active'), default=True)
    is_staff = models.BooleanField(_('Staff status'), default=False)
    
    # Profile Fields
    profile_picture = models.ImageField(
        _('Profile Picture'),
        upload_to='profile_pics/',
        blank=True,
        null=True
    )
    bio = models.TextField(_('Bio'), blank=True, null=True)
    GENDER_CHOICES = (
        ('male', _('Male')),
        ('female', _('Female')),
        ('other', _('Other')),
        ('prefer_not_to_say', _('Prefer not to say')),
    )
    gender = models.CharField(
        _('Gender'),
        max_length=20,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )
    
    # Contact Information
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message=_("Phone number must be in the format: '+999999999'. Up to 15 digits.")
    )
    phone_number = models.CharField(
        _('Phone number'),
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True,
        unique=True
    )
    email_verified = models.BooleanField(_('Email Verified'), default=False)
    phone_verified = models.BooleanField(_('Phone Verified'), default=False)
    
    # Security Fields
    failed_login_attempts = models.PositiveIntegerField(_('Failed Login Attempts'), default=0)
    account_locked_until = models.DateTimeField(_('Account Locked Until'), blank=True, null=True)
    tfa_enabled = models.BooleanField(_('2FA Enabled'), default=False)
    tfa_secret = models.CharField(_('2FA Secret'), max_length=255, blank=True, null=True)
    
    # Activity Tracking
    last_login = models.DateTimeField(_('Last Login'), blank=True, null=True)
    last_activity = models.DateTimeField(_('Last Activity'), blank=True, null=True)
    is_online = models.BooleanField(_('Online Status'), default=False)
    
    # Preferences
    notification_preferences = models.JSONField(
        _('Notification Preferences'),
        default=dict,
        blank=True,
        encoder=json.JSONEncoder,
        decoder=json.JSONDecoder
    )
    
    # Legal & Compliance
    terms_accepted = models.BooleanField(_('Terms Accepted'), default=False)
    terms_accepted_at = models.DateTimeField(_('Terms Accepted At'), blank=True, null=True)
    privacy_policy_accepted = models.BooleanField(_('Privacy Policy Accepted'), default=False)
    privacy_policy_accepted_at = models.DateTimeField(_('Privacy Policy Accepted At'), blank=True, null=True)
    
    # Account Management
    deactivation_reason = models.TextField(_('Deactivation Reason'), blank=True, null=True)
    deactivation_date = models.DateTimeField(_('Deactivation Date'), blank=True, null=True)
    
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
            ('owner', _('Owner')),
        )
    )
    agency_verified = models.BooleanField(_('Agency Verified'), default=False)
    verification_documents = models.FileField(
        _('Verification Documents'),
        upload_to='agency_verifications/',
        blank=True,
        null=True
    )
    
    # Company Information
    is_company_member = models.BooleanField(_('Company member'), default=False)
    company_name = models.CharField(_('Company name'), max_length=255, blank=True, null=True)
    position = models.CharField(_('Position'), max_length=255, blank=True, null=True)

    # Roles
    USER_ROLES = (
        ('customer', _('Customer')),
        ('admin', _('Admin')),
        ('staff', _('Staff')),
        ('agency', _('Agency')),
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
        ]

    def __str__(self):
        return self.get_full_name() or self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def get_age(self):
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < 
                (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None

    # Verification Methods
    def verify_email(self):
        self.email_verified = True
        self.save(update_fields=['email_verified'])

    def verify_phone(self):
        self.phone_verified = True
        self.save(update_fields=['phone_verified'])

    # Security Methods
    def increment_failed_login_attempts(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            self.account_locked_until = timezone.now() + timezone.timedelta(minutes=15)
        self.save(update_fields=['failed_login_attempts', 'account_locked_until'])

    def reset_login_attempts(self):
        self.failed_login_attempts = 0
        self.account_locked_until = None
        self.save(update_fields=['failed_login_attempts', 'account_locked_until'])

    # Activity Methods
    def update_last_activity(self):
        self.last_activity = timezone.now()
        self.save(update_fields=['last_activity'])

    # 2FA Methods
    def enable_2fa(self, secret):
        self.tfa_enabled = True
        self.tfa_secret = secret
        self.save(update_fields=['tfa_enabled', 'tfa_secret'])

    def disable_2fa(self):
        self.tfa_enabled = False
        self.tfa_secret = None
        self.save(update_fields=['tfa_enabled', 'tfa_secret'])

    # Account Management
    def deactivate_account(self, reason):
        self.is_active = False
        self.deactivation_reason = reason
        self.deactivation_date = timezone.now()
        self.save(update_fields=['is_active', 'deactivation_reason', 'deactivation_date'])

    def reactivate_account(self):
        self.is_active = True
        self.deactivation_reason = None
        self.deactivation_date = None
        self.save(update_fields=['is_active', 'deactivation_reason', 'deactivation_date'])

    # Agency Methods
    def is_agency_member(self):
        return self.role == 'agency' and self.agency is not None

    def get_agency_permissions(self):
        if self.is_agency_member():
            return {
                'can_manage_listings': True,
                'can_manage_clients': self.agency_role in ['manager', 'owner'],
                'can_manage_agency': self.agency_role == 'owner'
            }
        return {}

    def transfer_agency_ownership(self, new_owner):
        if self.agency_role == 'owner' and self.agency == new_owner.agency:
            self.agency_role = 'manager'
            new_owner.agency_role = 'owner'
            self.save()
            new_owner.save()

    def request_agency_verification(self, documents):
        if self.role == 'agency':
            self.verification_documents = documents
            self.save()
            # Trigger verification workflow
            self.send_verification_request_email()

    def verify_agency(self):
        self.agency_verified = True
        self.save()
        self.send_verification_confirmation_email()

    # Permissions
    def has_permission(self, perm, obj=None):
        if self.is_superuser:
            return True
        return super().has_permission(perm, obj)

    def has_role(self, role):
        return self.role == role

    def save(self, *args, **kwargs):
        """Handle field normalization and role-based logic"""
        # Normalize fields
        self.email = self.email.lower().strip()
        self.first_name = self.first_name.strip()
        self.last_name = self.last_name.strip()
        
        # Auto-set company name for agency members
        if self.role == 'agency' and self.agency:
            self.company_name = self.agency.name
        
        # Set staff status based on role
        if self.role in ['admin', 'staff', 'agency']:
            self.is_staff = True
        else:
            self.is_staff = False
            
        super().save(*args, **kwargs)


class UserActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(_('Action'), max_length=255)
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True)
    ip_address = models.GenericIPAddressField(_('IP Address'), blank=True, null=True)
    user_agent = models.TextField(_('User Agent'), blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = _('User Activity Log')
        verbose_name_plural = _('User Activity Logs')

    def __str__(self):
        return f"{self.user} - {self.action}"


class LoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    timestamp = models.DateTimeField(_('Timestamp'), auto_now_add=True)
    ip_address = models.GenericIPAddressField(_('IP Address'))
    user_agent = models.TextField(_('User Agent'), blank=True, null=True)
    success = models.BooleanField(_('Success'), default=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = _('Login History')
        verbose_name_plural = _('Login Histories')

    def __str__(self):
        return f"{self.user} - {self.timestamp}"
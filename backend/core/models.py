from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.core.validators import validate_email, RegexValidator
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and saves a new user with required fields: email, first_name, last_name."""
        if not email:
            raise ValueError('Users must have an email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')

        validate_email(email)
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        """Creates and saves a new superuser with admin role and staff permissions."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('role') != 'admin':
            raise ValueError('Superuser must have role="admin".')
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('Email address'), max_length=255, unique=True)
    first_name = models.CharField(_('First name'), max_length=255)
    last_name = models.CharField(_('Last name'), max_length=255)
    is_active = models.BooleanField(_('Active'), default=True)
    is_staff = models.BooleanField(_('Staff status'), default=False)

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
    date_of_birth = models.DateField(_('Date of birth'), blank=True, null=True)
    address = models.CharField(_('Address'), max_length=255, blank=True, null=True)

    is_company_member = models.BooleanField(_('Company member'), default=False)
    company_name = models.CharField(_('Company name'), max_length=255, blank=True, null=True)
    position = models.CharField(_('Position'), max_length=255, blank=True, null=True)

    USER_ROLES = (
        ('customer', _('Customer')),
        ('admin', _('Admin')),
        ('staff', _('Staff')),
    )
    role = models.CharField(
        _('Role'),
        max_length=20,
        choices=USER_ROLES,
        default='customer'
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def save(self, *args, **kwargs):
        """Override save to automatically set is_staff based on role."""
        if self.role in ['admin', 'staff']:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)

    def send_email_verification(self):
        # Implementation logic for email verification
        pass

    def send_phone_verification(self):
        # Implementation logic for SMS verification
        pass

    def __str__(self):
        return self.email

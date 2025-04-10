# Generated by Django 5.1.7 on 2025-04-01 10:40

import django.core.validators
import encrypted_model_fields.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('core', '0002_agency_loginhistory_useractivitylog_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='agency',
            options={'ordering': ['name'], 'verbose_name_plural': 'Agencies'},
        ),
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'User', 'verbose_name_plural': 'Users'},
        ),
        migrations.AddField(
            model_name='agency',
            name='verified_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Verified At'),
        ),
        migrations.AddField(
            model_name='loginhistory',
            name='failure_reason',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Failure Reason'),
        ),
        migrations.AddField(
            model_name='user',
            name='agency_verified_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Agency Verified At'),
        ),
        migrations.AddField(
            model_name='user',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True, verbose_name='Date of Birth'),
        ),
        migrations.AddField(
            model_name='user',
            name='email_verified_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Email Verified At'),
        ),
        migrations.AddField(
            model_name='user',
            name='phone_verified_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Phone Verified At'),
        ),
        migrations.AddField(
            model_name='useractivitylog',
            name='details',
            field=models.JSONField(blank=True, default=dict, verbose_name='Details'),
        ),
        migrations.AlterField(
            model_name='user',
            name='deactivation_reason',
            field=encrypted_model_fields.fields.EncryptedTextField(blank=True, null=True, verbose_name='Deactivation Reason'),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=17, null=True, unique=True, validators=[django.core.validators.RegexValidator(message="Phone number must be in format: '+999999999'. Up to 15 digits.", regex='^\\+?1?\\d{9,15}$')], verbose_name='Phone number'),
        ),
        migrations.AlterField(
            model_name='user',
            name='tfa_secret',
            field=encrypted_model_fields.fields.EncryptedCharField(blank=True, null=True, verbose_name='2FA Secret'),
        ),
        migrations.AlterField(
            model_name='useractivitylog',
            name='action',
            field=models.CharField(choices=[('login', 'Login'), ('logout', 'Logout'), ('profile_update', 'Profile Update'), ('password_change', 'Password Change')], max_length=50, verbose_name='Action'),
        ),
        migrations.AddIndex(
            model_name='user',
            index=models.Index(fields=['is_active', 'role'], name='core_user_is_acti_a9bcc3_idx'),
        ),
    ]

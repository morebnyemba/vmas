# Generated by Django 5.1.7 on 2025-04-08 12:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_license_specialization_userdevice_userfavorite_and_more'),
        ('properties', '0006_remove_propertyimage_processing_status_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['price'], name='properties__price_32e7c2_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['city'], name='properties__city_74fa1a_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['property_type', 'status'], name='properties__propert_487234_idx'),
        ),
    ]

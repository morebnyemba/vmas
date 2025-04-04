# Generated by Django 5.1.7 on 2025-03-27 02:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('description', models.TextField(verbose_name='Description')),
                ('property_type', models.CharField(choices=[('apartment', 'Apartment'), ('house', 'House'), ('land', 'Land'), ('commercial', 'Commercial')], max_length=20, verbose_name='Property Type')),
                ('address', models.CharField(max_length=255, verbose_name='Address')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('zip_code', models.CharField(max_length=20, verbose_name='Zip Code')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price')),
                ('bedrooms', models.IntegerField(default=0, verbose_name='Bedrooms')),
                ('bathrooms', models.DecimalField(decimal_places=1, default=0, max_digits=3, verbose_name='Bathrooms')),
                ('area', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Area (sq ft)')),
                ('status', models.CharField(choices=[('available', 'Available'), ('sold', 'Sold'), ('rented', 'Rented'), ('under_maintenance', 'Under Maintenance')], default='available', max_length=20, verbose_name='Status')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='properties', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='property_images/', verbose_name='Image')),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='properties.property')),
            ],
        ),
    ]

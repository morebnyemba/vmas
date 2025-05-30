# Generated by Django 5.1.7 on 2025-03-28 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0002_alter_property_options_alter_propertyimage_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='featured',
            field=models.BooleanField(default=False, help_text='Mark this property as featured', verbose_name='Featured Property'),
        ),
        migrations.AddField(
            model_name='propertyimage',
            name='processing_status',
            field=models.CharField(choices=[('pending', 'Pending Processing'), ('processed', 'Processed'), ('failed', 'Processing Failed')], default='pending', max_length=20, verbose_name='Processing Status'),
        ),
        migrations.AddField(
            model_name='propertyimage',
            name='thumbnail',
            field=models.ImageField(blank=True, help_text='Automatically generated thumbnail image', null=True, upload_to='property_thumbnails/', verbose_name='Thumbnail'),
        ),
        migrations.AddField(
            model_name='propertyvideo',
            name='processing_status',
            field=models.CharField(choices=[('pending', 'Pending Processing'), ('processed', 'Processed'), ('failed', 'Processing Failed')], default='pending', max_length=20, verbose_name='Processing Status'),
        ),
        migrations.AddField(
            model_name='propertyvideo',
            name='thumbnail',
            field=models.ImageField(blank=True, help_text='Automatically generated video thumbnail', null=True, upload_to='video_thumbnails/', verbose_name='Video Thumbnail'),
        ),
        migrations.AddField(
            model_name='rentalcontract',
            name='administration_fee',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Administrative processing fee', max_digits=10, verbose_name='Administration Fee'),
        ),
        migrations.AddField(
            model_name='rentalcontract',
            name='appointment_fee',
            field=models.DecimalField(decimal_places=2, default=0, help_text='Fee for property viewing appointments', max_digits=10, verbose_name='Appointment Fee'),
        ),
        migrations.AddField(
            model_name='rentalcontract',
            name='commitment_fee',
            field=models.DecimalField(decimal_places=2, default=0, help_text='One-time commitment fee for reserving the property', max_digits=10, verbose_name='Commitment Fee'),
        ),
        migrations.AlterField(
            model_name='propertyimage',
            name='image',
            field=models.ImageField(help_text='Upload high-quality property photos (JPEG/PNG)', upload_to='property_images/', verbose_name='Image'),
        ),
        migrations.AlterField(
            model_name='propertyvideo',
            name='video_file',
            field=models.FileField(help_text='Upload MP4/MOV file for 360 view (max 500MB)', upload_to='property_videos/', verbose_name='Video'),
        ),
    ]

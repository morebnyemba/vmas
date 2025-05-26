# backend/properties/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PropertyImage, PropertyVideo
from .tasks import process_property_image_task, process_property_video_task
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=PropertyImage)
def schedule_property_image_processing(sender, instance, created, **kwargs):
    # Check if the image field was actually updated or if it's a new instance with an image
    if instance.image and (created or (kwargs.get('update_fields') and 'image' in kwargs['update_fields'])) :
        logger.info(f"PropertyImage post_save signal: Scheduling image processing for ID {instance.id}")
        process_property_image_task.delay(instance.id)
    elif created and not instance.image:
        logger.warning(f"PropertyImage post_save signal: Instance {instance.id} created without an image.")


@receiver(post_save, sender=PropertyVideo)
def schedule_property_video_processing(sender, instance, created, **kwargs):
    if instance.video and (created or (kwargs.get('update_fields') and 'video' in kwargs['update_fields'])):
        logger.info(f"PropertyVideo post_save signal: Scheduling video processing for ID {instance.id}")
        process_property_video_task.delay(instance.id)
    elif created and not instance.video:
        logger.warning(f"PropertyVideo post_save signal: Instance {instance.id} created without a video.")


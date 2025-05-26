# backend/properties/tasks.py
from celery import shared_task
from django.conf import settings
import logging
from PIL import Image as PillowImage # Renamed to avoid conflict if you have a model named Image
from django.core.files.base import ContentFile
import io

from .models import PropertyImage, PropertyVideo # Make sure models are correctly imported

logger = logging.getLogger(__name__)

@shared_task(name="process_property_image_task", bind=True, max_retries=3)
def process_property_image_task(self, property_image_id):
    """
    Celery task to process a property image:
    - Generate thumbnail
    - Potentially compress/optimize (basic example here)
    """
    try:
        image_instance = PropertyImage.objects.get(pk=property_image_id)
        logger.info(f"Processing image: {image_instance.image.name} for PropertyImage ID: {property_image_id}")

        if not image_instance.image:
            logger.warning(f"No image file found for PropertyImage ID: {property_image_id}")
            return "No image file found."

        try:
            # Open the original image using Pillow
            img = PillowImage.open(image_instance.image)
            original_format = img.format or 'JPEG' # Keep original format or default to JPEG

            # 1. Generate Thumbnail
            thumb_size = (200, 200) # Define your thumbnail size
            thumb_img = img.copy()
            thumb_img.thumbnail(thumb_size)
            
            thumb_io = io.BytesIO()
            thumb_img.save(thumb_io, format=original_format, quality=85) # Adjust quality
            thumb_io.seek(0)
            
            # Construct a unique thumbnail name
            original_filename = image_instance.image.name.split('/')[-1]
            thumb_filename = f"thumb_{original_filename}"
            
            image_instance.thumbnail.save(thumb_filename, ContentFile(thumb_io.read()), save=False)
            logger.info(f"Thumbnail generated for PropertyImage ID: {property_image_id}")

            # 2. Basic Optimization (example: re-saving with quality)
            # More advanced optimization might involve tools like optipng, jpegoptim
            # or cloud services.
            # For simplicity, we'll just re-save the original with a set quality if it's JPEG/PNG
            # if original_format.upper() in ['JPEG', 'JPG', 'PNG']:
            #     optimized_io = io.BytesIO()
            #     img.save(optimized_io, format=original_format, quality=85, optimize=True) # Adjust quality
            #     optimized_io.seek(0)
            #     image_instance.image.save(original_filename, ContentFile(optimized_io.read()), save=False)
            #     logger.info(f"Image optimized for PropertyImage ID: {property_image_id}")
            
            image_instance.save(update_fields=['thumbnail']) # Add 'image' here if you re-save the original
            
            return f"Successfully processed image for PropertyImage ID: {property_image_id}"

        except FileNotFoundError:
            logger.error(f"Original image file not found for PropertyImage ID: {property_image_id} at path {image_instance.image.path if image_instance.image else 'N/A'}")
            # Don't retry if file not found
            return f"Failed: Original image file not found for PropertyImage ID: {property_image_id}"
        except Exception as e:
            logger.error(f"Error processing image for PropertyImage ID {property_image_id}: {e}", exc_info=True)
            # Retry with a countdown (e.g., 1 min, 5 mins, 10 mins)
            self.retry(exc=e, countdown=60 * (self.request.retries + 1))
            return f"Failed: Error processing image for PropertyImage ID {property_image_id}. Will retry."


    except PropertyImage.DoesNotExist:
        logger.warning(f"PropertyImage with ID {property_image_id} does not exist. Cannot process.")
        return f"PropertyImage with ID {property_image_id} not found."
    except Exception as e:
        logger.error(f"General error in task for PropertyImage ID {property_image_id}: {e}", exc_info=True)
        # This is a catch-all, may not need retry if it's outside the inner try-except
        raise # Reraise to mark task as failed if not handled by inner retry

@shared_task(name="process_property_video_task", bind=True, max_retries=3)
def process_property_video_task(self, property_video_id):
    """
    Celery task to process a property video.
    Placeholder for actual video processing (e.g., thumbnail, transcoding).
    Requires tools like FFmpeg.
    """
    try:
        video_instance = PropertyVideo.objects.get(pk=property_video_id)
        logger.info(f"Attempting to process video: {video_instance.video.name} for PropertyVideo ID: {property_video_id}")
        
        # Actual video processing logic here.
        # This is complex and usually involves calling FFmpeg as a subprocess.
        # Example placeholder:
        # 1. Generate thumbnail from video
        # 2. Transcode to web-friendly formats (e.g., MP4 H.264)
        
        # For now, just log and return
        logger.info(f"Placeholder: Video processing for PropertyVideo ID {property_video_id} would happen here.")
        # video_instance.processed = True # Example field
        # video_instance.save()
        return f"Placeholder: Successfully processed video for PropertyVideo ID: {property_video_id}"
        
    except PropertyVideo.DoesNotExist:
        logger.warning(f"PropertyVideo with ID {property_video_id} does not exist. Cannot process.")
        return f"PropertyVideo ID {property_video_id} not found."
    except Exception as e:
        logger.error(f"Error processing video for PropertyVideo ID {property_video_id}: {e}", exc_info=True)
        self.retry(exc=e, countdown=300 * (self.request.retries + 1)) # Longer retry for video
        return f"Failed: Error processing video for PropertyVideo ID {property_video_id}. Will retry."

# Example periodic task (to be scheduled via Django Admin or signals)
@shared_task(name="check_featured_properties_expiry_task")
def check_featured_properties_expiry_task():
    from django.utils import timezone
    from .models import Property
    # Example: Unfeature properties whose 'featured_until' date has passed
    expired_featured = Property.objects.filter(featured=True, featured_until__lt=timezone.now())
    count = expired_featured.update(featured=False, featured_until=None)
    if count > 0:
        logger.info(f"Unfeatured {count} properties whose feature period expired.")
    return f"Checked featured properties expiry. Unfeatured {count} properties."


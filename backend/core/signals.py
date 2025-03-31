from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import User, UserActivityLog

@receiver(pre_save, sender=User)
def update_last_activity(sender, instance, **kwargs):
    if instance.pk:
        original = User.objects.get(pk=instance.pk)
        if original.last_activity != instance.last_activity:
            UserActivityLog.objects.create(
                user=instance,
                action="Profile Updated"
            )

@receiver(post_save, sender=User)
def create_activity_log(sender, instance, created, **kwargs):
    if created:
        UserActivityLog.objects.create(
            user=instance,
            action="Account Created"
        )
from django.utils import timezone
from .models import User

class OnlineStatusMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request phase
        if request.user.is_authenticated:
            User.objects.filter(pk=request.user.pk).update(
                last_activity=timezone.now(),
                is_online=True
            )
        
        response = self.get_response(request)
        
        # Process response phase
        if request.user.is_authenticated:
            User.objects.filter(pk=request.user.pk).update(is_online=False)
        
        return response
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, AgencyViewSet,
    UserActivityLogViewSet, LoginHistoryViewSet,
    CustomTokenObtainPairView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'agencies', AgencyViewSet)
router.register(r'activity-logs', UserActivityLogViewSet)
router.register(r'login-history', LoginHistoryViewSet)

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include(router.urls)),
]
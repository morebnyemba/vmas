from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import (
    UserViewSet,
    AgencyViewSet,
    UserActivityLogViewSet,
    CustomTokenObtainPairView,
    LicenseViewSet,
    SpecializationViewSet,
    UserFavoriteViewSet,
    AgentProfileViewSet,
    AgencyRegistrationView
)

# API Endpoints
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'agencies', AgencyViewSet)
router.register(r'activity-logs', UserActivityLogViewSet, basename='activitylog')
router.register(r'licenses', LicenseViewSet, basename='license')
router.register(r'specializations', SpecializationViewSet, basename='specialization')
router.register(r'favorites', UserFavoriteViewSet, basename='favorite')
router.register(r'agent-profiles', AgentProfileViewSet, basename='agentprofile')

# Authentication Endpoints
auth_patterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('register/agency/', AgencyRegistrationView.as_view(), name='agency-register'),
]

# Additional custom endpoints
custom_patterns = [
    path('agents/search/', UserViewSet.as_view({'get': 'search_agents'}), name='agent-search'),
    path('agents/public-profiles/', UserViewSet.as_view({'get': 'agent_profiles'}), name='agent-public-profiles'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include(auth_patterns)),
    path('', include(custom_patterns)),
]
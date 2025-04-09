from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from .views import (
    PropertyViewSet,
    PropertyInterestViewSet,
    PaymentViewSet,
    RentalContractViewSet,
    SaleContractViewSet,
    ServiceSubscriptionViewSet,
    PropertyPlaceOfInterestViewSet
)


router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'interests', PropertyInterestViewSet, basename='interest')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'rental-contracts', RentalContractViewSet, basename='rental-contract')
router.register(r'sale-contracts', SaleContractViewSet, basename='sale-contract')
router.register(r'subscriptions', ServiceSubscriptionViewSet, basename='subscription')
router.register(r'property-places', PropertyPlaceOfInterestViewSet, basename='property-place')


urlpatterns = [
    path('', include(router.urls)),
    # OpenAPI 3.0 schema generation
    path('schema/', SpectacularAPIView.as_view(api_version='v1'), name='schema'),
    # Swagger UI
    path('swagger/', SpectacularSwaggerView.as_view(template_name='swagger_ui.html', url_name='schema'), name='swagger-ui'),
    # Redoc UI
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
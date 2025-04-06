from django.urls import path, include
from rest_framework.routers import DefaultRouter
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
]
# views.py
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Property, PropertyImage, PropertyVideo,
    ServiceSubscription, Transaction,
    RentalContract, SaleContract
)
from .serializers import (
    PropertySerializer, ServiceSubscriptionSerializer,
    TransactionSerializer, RentalContractSerializer,
    SaleContractSerializer
)
from core.models import User

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit their objects"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class PropertyListAPI(generics.ListAPIView):
    """
    API endpoint to list properties with filtering.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'property_type', 'status', 'featured', 'city', 'state', 'zip_code',
        'bedrooms', 'bathrooms', 'owner', 'listing_agency'
    ]
    search_fields = ['title', 'description', 'address']
    ordering_fields = ['price', 'area', 'created_at', 'updated_at']

    def get_queryset(self):
        queryset = Property.objects.prefetch_related(
            'images', 'videos'
        ).select_related(
            'owner', 'listing_agency'
        ).order_by('-created_at')
        return queryset

class PropertyCreateAPI(generics.CreateAPIView):
    """
    API endpoint to create a new property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PropertyDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.prefetch_related(
            'images', 'videos'
        ).select_related(
            'owner', 'listing_agency'
        ).all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    lookup_field = 'id'

class ServiceSubscriptionCreateAPI(generics.CreateAPIView):
    serializer_class = ServiceSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserSubscriptionsAPI(generics.ListAPIView):
    serializer_class = ServiceSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceSubscription.objects.filter(user=self.request.user)

class TransactionCreateAPI(generics.CreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserTransactionsAPI(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

class RentalContractCreateAPI(generics.CreateAPIView):
    serializer_class = RentalContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Add custom validation logic here
        return super().post(request, *args, **kwargs)

class UserRentalContractsAPI(generics.ListAPIView):
    serializer_class = RentalContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentalContract.objects.filter(tenant=self.request.user)

class SaleContractCreateAPI(generics.CreateAPIView):
    serializer_class = SaleContractSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserSaleContractsAPI(generics.ListAPIView):
    serializer_class = SaleContractSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SaleContract.objects.filter(buyer=self.request.user)

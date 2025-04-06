from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet, NumberFilter, ChoiceFilter
from rest_framework.parsers import MultiPartParser, FormParser
from .models import (
    Property, PropertyInterest, Transaction, 
    PropertyImage, PropertyVideo, PropertyPlaceOfInterest,
    RentalContract, SaleContract, ServiceSubscription
)
from .serializers import (
    PublicPropertyListSerializer, PropertyDetailSerializer,
    PropertyInterestSerializer, PaymentSerializer,
    PropertyImageSerializer, PropertyVideoSerializer,
    PlaceOfInterestSerializer, RentalContractSerializer,
    SaleContractSerializer, ServiceSubscriptionSerializer
)

class PropertyFilter(FilterSet):
    min_price = NumberFilter(field_name="price", lookup_expr='gte')
    max_price = NumberFilter(field_name="price", lookup_expr='lte')
    min_bedrooms = NumberFilter(field_name="bedrooms", lookup_expr='gte')
    min_bathrooms = NumberFilter(field_name="bathrooms", lookup_expr='gte')
    listing_type = ChoiceFilter(choices=Property.LISTING_TYPES)
    property_type = ChoiceFilter(choices=Property.PROPERTY_TYPES)
    
    class Meta:
        model = Property
        fields = [
            'property_type', 'status', 'city', 'featured',
            'min_price', 'max_price', 'min_bedrooms', 'min_bathrooms',
            'listing_type'
        ]

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A ViewSet for listing and retrieving properties, with additional actions for media uploads.
    """
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = PropertyFilter
    search_fields = ['title', 'description', 'address', 'city']
    ordering_fields = ['price', 'created_at', 'area']
    ordering = ['-created_at']
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return PublicPropertyListSerializer
        return PropertyDetailSerializer

    def get_queryset(self):
        base_queryset = Property.objects.all()
        if self.action == 'list':
            return base_queryset.prefetch_related('images').filter(status='available')
        return base_queryset.prefetch_related(
            'images', 'videos', 'property_places__place',
            'rental_contracts', 'sale_contracts'
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser],
            parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        """Upload an image for a property."""
        property = self.get_object()
        serializer = PropertyImageSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(property=property)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser],
            parser_classes=[MultiPartParser, FormParser])
    def upload_video(self, request, pk=None):
        """Upload a video for a property."""
        property = self.get_object()
        serializer = PropertyVideoSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(property=property)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def set_primary_image(self, request, pk=None):
        """Set an image as the primary image for a property."""
        property = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response(
                {"detail": "image_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            image = property.images.get(id=image_id)
            # Set all other images to not primary
            property.images.exclude(id=image_id).update(is_primary=False)
            # Set this image as primary
            image.is_primary = True
            image.save()
            return Response(
                PropertyImageSerializer(image, context={'request': request}).data
            )
        except PropertyImage.DoesNotExist:
            return Response(
                {"detail": "Image not found for this property"},
                status=status.HTTP_404_NOT_FOUND
            )

# Other ViewSets (PropertyInterestViewSet, PaymentViewSet, etc.) remain the same
class PropertyInterestViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyInterestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = PropertyInterest.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Transaction.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RentalContractViewSet(viewsets.ModelViewSet):
    serializer_class = RentalContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['property', 'tenant', 'is_active']
    ordering_fields = ['start_date', 'end_date', 'created_at']
    ordering = ['-start_date']

    def get_queryset(self):
        if self.request.user.is_staff:
            return RentalContract.objects.all()
        return RentalContract.objects.filter(tenant=self.request.user)

class SaleContractViewSet(viewsets.ModelViewSet):
    serializer_class = SaleContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['property', 'buyer', 'is_completed']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_staff:
            return SaleContract.objects.all()
        return SaleContract.objects.filter(buyer=self.request.user)

class ServiceSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['service_type', 'property', 'user']
    ordering_fields = ['valid_until', 'created_at']
    ordering = ['-valid_until']

    def get_queryset(self):
        if self.request.user.is_staff:
            return ServiceSubscription.objects.all()
        return ServiceSubscription.objects.filter(user=self.request.user)

class PropertyPlaceOfInterestViewSet(viewsets.ModelViewSet):
    serializer_class = PlaceOfInterestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = PropertyPlaceOfInterest.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['property', 'place']
    ordering_fields = ['distance']
    ordering = ['distance']
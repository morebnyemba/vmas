from rest_framework import serializers
from .models import *

class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    class Meta:
        model = PropertyImage
        fields = ['id', 'image_url', 'thumbnail_url', 'is_primary', 'created_at']
        read_only_fields = fields

class PropertyVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video_file:
            return request.build_absolute_uri(obj.video_file.url)
        return None

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    class Meta:
        model = PropertyVideo
        fields = ['id', 'video_url', 'thumbnail_url', 'duration', 'created_at']
        read_only_fields = fields

class PlaceOfInterestSerializer(serializers.ModelSerializer):
    place_type_display = serializers.CharField(source='place.get_place_type_display', read_only=True)
    place_name = serializers.CharField(source='place.name', read_only=True)

    class Meta:
        model = PropertyPlaceOfInterest
        fields = ['place', 'place_name', 'place_type_display', 'distance']
        read_only_fields = fields

class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    property_places = PlaceOfInterestSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    listing_type_display = serializers.CharField(source='get_listing_type_display', read_only=True)
    primary_image = serializers.SerializerMethodField()
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    listing_agency_name = serializers.CharField(source='listing_agency.name', read_only=True, allow_null=True)

    def get_primary_image(self, obj):
        request = self.context.get('request')
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return PropertyImageSerializer(primary, context={'request': request}).data
        return None

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'property_type', 'property_type_display',
            'status', 'status_display', 'listing_type', 'listing_type_display',
            'featured', 'address', 'city', 'state', 'zip_code', 'price',
            'viewing_fee', 'bedrooms', 'bathrooms', 'area', 'owner', 'owner_name',
            'listing_agency', 'listing_agency_name', 'property_places', 'created_at',
            'updated_at', 'images', 'videos', 'primary_image'
        ]

class PublicPropertyListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    listing_type_display = serializers.CharField(source='get_listing_type_display', read_only=True)

    def get_primary_image(self, obj):
        request = self.context.get('request')
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return {
                'id': primary.id,
                'image_url': request.build_absolute_uri(primary.image.url) if primary.image else None,
                'thumbnail_url': request.build_absolute_uri(primary.thumbnail.url) if primary.thumbnail else None,
                'is_primary': primary.is_primary
            }
        first_image = obj.images.first()
        if first_image:
            return {
                'id': first_image.id,
                'image_url': request.build_absolute_uri(first_image.image.url) if first_image.image else None,
                'thumbnail_url': request.build_absolute_uri(first_image.thumbnail.url) if first_image.thumbnail else None,
                'is_primary': first_image.is_primary
            }
        return None

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'property_type', 'property_type_display',
            'status', 'status_display', 'listing_type', 'listing_type_display',
            'price', 'bedrooms', 'bathrooms', 'city', 'primary_image',
            'created_at', 'featured'
        ]

class PropertyInterestSerializer(serializers.ModelSerializer):
    property_details = PublicPropertyListSerializer(source='property', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = PropertyInterest
        fields = ['id', 'property', 'property_details', 'user', 'user_name', 'created_at']
        read_only_fields = ['user', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    property_details = PublicPropertyListSerializer(source='property', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_type', 'transaction_type_display', 'amount', 
            'property', 'property_details', 'user', 'user_name',
            'payment_id', 'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'payment_id']

class RentalContractSerializer(serializers.ModelSerializer):
    property_details = PublicPropertyListSerializer(source='property', read_only=True)
    tenant_name = serializers.CharField(source='tenant.get_full_name', read_only=True)
    status = serializers.SerializerMethodField()

    def get_status(self, obj):
        return 'Active' if obj.is_active else 'Inactive'

    class Meta:
        model = RentalContract
        fields = [
            'id', 'property', 'property_details', 'tenant', 'tenant_name',
            'start_date', 'end_date', 'monthly_rent', 'security_deposit',
            'status', 'created_at'
        ]

class SaleContractSerializer(serializers.ModelSerializer):
    property_details = PublicPropertyListSerializer(source='property', read_only=True)
    buyer_name = serializers.CharField(source='buyer.get_full_name', read_only=True)
    status = serializers.SerializerMethodField()

    def get_status(self, obj):
        return 'Completed' if obj.is_completed else 'Pending'

    class Meta:
        model = SaleContract
        fields = [
            'id', 'property', 'property_details', 'buyer', 'buyer_name',
            'sale_price', 'status', 'created_at'
        ]

class ServiceSubscriptionSerializer(serializers.ModelSerializer):
    property_details = PublicPropertyListSerializer(source='property', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    status = serializers.SerializerMethodField()

    def get_status(self, obj):
        return 'Active' if obj.is_active() else 'Expired'

    class Meta:
        model = ServiceSubscription
        fields = [
            'id', 'service_type', 'service_type_display', 'property', 'property_details',
            'user', 'user_name', 'valid_until', 'status', 'created_at'
        ]
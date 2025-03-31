# serializers.py
from rest_framework import serializers
from .models import (
    Property, PropertyImage, PropertyVideo,
    ServiceSubscription, Transaction,
    RentalContract, SaleContract
)
from core.models import User, Agency

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ('id', 'name', 'license_number', 'contact_email')

class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    thumbnail = serializers.ImageField(use_url=True, read_only=True)

    class Meta:
        model = PropertyImage
        fields = ('id', 'image', 'thumbnail', 'is_primary', 'processing_status', 'created_at')

class PropertyVideoSerializer(serializers.ModelSerializer):
    video_file = serializers.FileField(use_url=True)
    thumbnail = serializers.ImageField(use_url=True, read_only=True)

    class Meta:
        model = PropertyVideo
        fields = ('id', 'video_file', 'thumbnail', 'duration', 'processing_status', 'created_at')

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    videos = PropertyVideoSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    listing_agency = AgencySerializer(read_only=True)
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Property
        fields = (
            'id', 'title', 'description', 'property_type', 'property_type_display',
            'status', 'status_display', 'featured', 'address', 'city', 'state',
            'zip_code', 'price', 'viewing_fee', 'bedrooms', 'bathrooms', 'area',
            'owner', 'listing_agency', 'images', 'videos', 'created_at', 'updated_at'
        )

class ServiceSubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    property = serializers.PrimaryKeyRelatedField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = ServiceSubscription
        fields = ('id', 'user', 'property', 'service_type', 'valid_until', 'is_active', 'created_at')

class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    property = PropertySerializer(read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)

    class Meta:
        model = Transaction
        fields = (
            'id', 'transaction_type', 'transaction_type_display', 'amount',
            'property', 'payment_id', 'created_at', 'user'
        )

class RentalContractSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    tenant = UserSerializer(read_only=True)
    total_fees = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    duration_days = serializers.SerializerMethodField()

    class Meta:
        model = RentalContract
        fields = (
            'id', 'property', 'tenant', 'start_date', 'end_date',
            'monthly_rent', 'security_deposit', 'is_active',
            'total_fees', 'duration_days', 'created_at'
        )

    def get_duration_days(self, obj):
        return (obj.end_date - obj.start_date).days

class SaleContractSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    buyer = UserSerializer(read_only=True)
    total_fees = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = SaleContract
        fields = ('id', 'property', 'buyer', 'sale_price', 'is_completed', 'total_fees', 'created_at')

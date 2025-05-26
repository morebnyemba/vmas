from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from .models import (
    User, Agency, UserActivityLog, 
    License, Specialization, AgentProfile, UserDevice, UserFavorite
)


class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = [
            'id', 'number', 'type', 'state', 'expiry_date',
            'verified', 'verified_at', 'document'
        ]
        read_only_fields = ['verified', 'verified_at']


class LicenseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = [
            'number', 'type', 'state', 'expiry_date', 'document'
        ]


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'description']


class AgencySerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True)
    active_agents_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agency
        fields = [
            'id', 'name', 'description', 'website', 'logo',
            'verified', 'verified_at', 'founded_date', 
            'address', 'service_areas', 'languages', 'created_at',
            'updated_at', 'member_count', 'active_agents_count',
            'latitude', 'longitude'
        ]
        read_only_fields = [
            'verified', 'verified_at', 'created_at', 
            'updated_at', 'member_count', 'active_agents_count'
        ]


class UserDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDevice
        fields = [
            'id', 'device_name', 'device_type', 'os',
            'browser', 'ip_address', 'last_used', 'is_trusted',
        ]
        read_only_fields = ['ip_address', 'last_used']


class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            'id', 'professional_title', 'certifications',
            'education', 'awards', 'specialties', 'testimonial_video',
            'office_hours', 'appointment_slots'
        ]


class AgentProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            'professional_title', 'certifications', 'education',
            'awards', 'specialties', 'testimonial_video',
            'office_hours', 'appointment_slots'
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile updates (excludes sensitive fields like password)
    """
    agency = AgencySerializer(read_only=True)
    licenses = LicenseSerializer(many=True, read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'phone_number', 'alternate_phone', 'date_of_birth',
            'profile_picture', 'cover_photo', 'bio', 'gender', 
            'notification_preferences', 'communication_preferences',
            'years_of_experience', 'languages', 'service_areas',
            'facebook_url', 'linkedin_url', 'twitter_url',
            'instagram_url', 'licenses', 'specializations', 
            'agent_profile', 'created_at', 'updated_at','agency'
        ]
        read_only_fields = [
            'email', 'email_verified', 'created_at', 'updated_at',
            'is_staff', 'role', 'agency', 'agency_verified'
        ]

    def validate_phone_number(self, value):
        # Add phone number validation logic here
        return value

    def update(self, instance, validated_data):
        # Handle file uploads separately if needed
        profile_picture = validated_data.pop('profile_picture', None)
        cover_photo = validated_data.pop('cover_photo', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if profile_picture:
            instance.profile_picture = profile_picture
            
        if cover_photo:
            instance.cover_photo = cover_photo
            
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    agency = AgencySerializer(read_only=True)
    agency_id = serializers.PrimaryKeyRelatedField(
        queryset=Agency.objects.all(),
        source='agency',
        write_only=True,
        required=False,
        allow_null=True
    )
    licenses = LicenseSerializer(many=True, read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)
    devices = UserDeviceSerializer(many=True, read_only=True)
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'},
        trim_whitespace=False,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )
    rating = serializers.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        read_only=True,
        allow_null=True
    )
    reviews_count = serializers.IntegerField(read_only=True)
    average_response_time = serializers.IntegerField(read_only=True, allow_null=True)
    is_online = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password', 'confirm_password',
            'role', 'phone_number', 'alternate_phone', 'is_active', 'date_of_birth',
            'profile_picture', 'cover_photo', 'bio', 'gender', 'email_verified',
            'phone_verified', 'tfa_enabled', 'is_staff', 'notification_preferences',
            'communication_preferences', 'agency', 'agency_id', 'agency_role',
            'years_of_experience', 'languages', 'service_areas', 'rating',
            'reviews_count', 'facebook_url', 'linkedin_url', 'twitter_url',
            'instagram_url', 'licenses', 'specializations', 'agent_profile',
            'devices', 'created_at', 'updated_at', 'agency_verified',
            'average_response_time', 'is_online',
            'verification_documents', 'last_login', 'last_activity', 'last_seen'
        ]
        extra_kwargs = {
            'email_verified': {'read_only': True},
            'phone_verified': {'read_only': True},
            'agency_verified': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'is_staff': {'read_only': True},
            'verification_documents': {'write_only': True},
            'last_login': {'read_only': True},
            'last_activity': {'read_only': True},
            'last_seen': {'read_only': True},
        }

    def validate_email(self, value):
        value = value.lower().strip()
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError(_("Enter a valid email address."))
        return value

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        if password and password != confirm_password:
            raise serializers.ValidationError(
                {'confirm_password': _("Passwords do not match.")}
            )

        role = data.get('role', self.instance.role if self.instance else None)
        agency_role = data.get('agency_role')
        
        if role not in ['agent', 'agency_admin', 'agency_staff'] and agency_role:
            raise serializers.ValidationError(
                {'agency_role': _("Agency role can only be set for agency users.")}
            )
            
        if role in ['agent', 'agency_admin', 'agency_staff'] and agency_role:
            valid_roles = ['agent', 'manager', 'admin', 'owner']
            if agency_role not in valid_roles:
                raise serializers.ValidationError(
                    {'agency_role': _(f"Invalid agency role. Must be one of: {', '.join(valid_roles)}")}
                )

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            **validated_data
        )
        
        if password:
            user.set_password(password)
            user.save()
        
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        
        if password:
            instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class AgentPublicProfileSerializer(serializers.ModelSerializer):
    agency = AgencySerializer(read_only=True)
    licenses = LicenseSerializer(many=True, read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    agent_profile = AgentProfileSerializer(read_only=True)
    service_areas = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'profile_picture',
            'bio', 'phone_number', 'years_of_experience', 'languages',
            'rating', 'reviews_count', 'agency', 'licenses',
            'specializations', 'agent_profile', 'service_areas',
            'facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url',
            'average_response_time'
        ]

    def get_service_areas(self, obj):
        return obj.get_service_areas()


class AgentSearchSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    distance = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'profile_picture',
            'rating', 'reviews_count', 'years_of_experience',
            'agency_name', 'distance', 'average_response_time'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    register_as = serializers.ChoiceField(
        write_only=True,
        choices=[('customer', 'Customer'), ('agent', 'Agent')],
        default='customer'
    )
    agency_name = serializers.CharField(
        write_only=True,
        required=False,
        allow_null=True,
        allow_blank=True
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'password', 'confirm_password',
            'register_as', 'agency_name'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': _("Passwords do not match.")}
            )
        
        if data.get('register_as') == 'agent' and not data.get('agency_name'):
            raise serializers.ValidationError(
                {'agency_name': _("Agency name is required for agent registration.")}
            )
            
        return data

    def create(self, validated_data):
        register_as = validated_data.pop('register_as')
        agency_name = validated_data.pop('agency_name', None)
        validated_data.pop('confirm_password')
        
        validated_data['role'] = register_as
        
        user = User.objects.create_user(**validated_data)
        
        if register_as == 'agent' and agency_name:
            agency, created = Agency.objects.get_or_create(
                name=agency_name,
                defaults={'verified': False}
            )
            user.agency = agency
            user.is_staff = True
            user.save()
            
            AgentProfile.objects.create(user=user)
        
        return user


class AgencyRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    agency_name = serializers.CharField(required=True)
    agency_description = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': _("Passwords do not match.")}
            )
        return data


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': _("The new passwords do not match.")}
            )
        return data


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        user_data = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'is_staff': self.user.is_staff,
            'is_active': self.user.is_active,
            'email_verified': self.user.email_verified,
            'phone_verified': self.user.phone_verified,
            'tfa_enabled': self.user.tfa_enabled,
            'profile_picture': self.user.profile_picture.url if self.user.profile_picture else None,
            'is_online': self.user.is_online
        }
        
        if self.user.agency:
            user_data['agency'] = {
                'id': self.user.agency.id,
                'name': self.user.agency.name,
                'logo': self.user.agency.logo.url if self.user.agency.logo else None
            }
        
        data['user'] = user_data
        
        return data


class UserActivityLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = UserActivityLog
        fields = [
            'id', 'user', 'user_email', 'user_full_name', 'action',
            'details', 'timestamp', 'ip_address', 'user_agent', 
            'device_id'
        ]
        read_only_fields = fields


class UserFavoriteSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source='property.title', read_only=True)
    agent_name = serializers.CharField(source='agent.full_name', read_only=True)

    class Meta:
        model = UserFavorite
        fields = [
            'id', 'user', 'property', 'property_title',
            'agent', 'agent_name', 'search_parameters', 'created_at'
        ]
        read_only_fields = ['created_at']

    def validate(self, data):
        if not data.get('property') and not data.get('agent') and not data.get('search_parameters'):
            raise serializers.ValidationError(
                _("Either property, agent or search parameters must be set.")
            )
        if data.get('property') and data.get('agent'):
            raise serializers.ValidationError(
                _("Cannot favorite both property and agent in the same record.")
            )
        return data
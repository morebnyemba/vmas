from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Agency, UserActivityLog, LoginHistory
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    agency = serializers.PrimaryKeyRelatedField(queryset=Agency.objects.all(), required=False)
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'password',
            'role', 'phone_number', 'is_active', 'is_staff',
            'agency', 'agency_role', 'company_name', 'position',
            'email_verified', 'phone_verified', 'tfa_enabled',
            'notification_preferences', 'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email_verified': {'read_only': True},
            'phone_verified': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class AgencySerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Agency
        fields = '__all__'
        read_only_fields = ['verified', 'created_at']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,
            'is_staff': self.user.is_staff,
            'agency': self.user.agency.id if self.user.agency else None
        }
        return data

class UserActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityLog
        fields = '__all__'

class LoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginHistory
        fields = '__all__'
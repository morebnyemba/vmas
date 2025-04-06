from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from .models import (
    User, Agency, UserActivityLog, 
    License, Specialization, AgentProfile, UserDevice, UserFavorite
)
from .serializers import (
    UserSerializer, 
    AgencySerializer,
    CustomTokenObtainPairSerializer,
    UserActivityLogSerializer, 
    UserRegistrationSerializer,
    PasswordChangeSerializer,
    LicenseSerializer,
    SpecializationSerializer,
    AgentProfileSerializer,
    UserDeviceSerializer,
    UserFavoriteSerializer,
    AgentPublicProfileSerializer,
    AgentSearchSerializer,
    LicenseCreateSerializer,
    AgentProfileUpdateSerializer,
    AgencyRegistrationSerializer
)
from .permissions import IsAdminOrSelf, IsAgencyOwner, IsAgencyMember, IsAgentOrAdmin


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('agency').prefetch_related(
        'licenses', 'specializations', 'devices'
    ).all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'is_active', 'agency', 'agency_verified']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    ordering_fields = ['created_at', 'last_login', 'rating']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['verify_email', 'verify_phone', 'me', 'my_devices']:
            return [permissions.IsAuthenticated()]
        if self.action in ['destroy', 'update', 'partial_update']:
            return [permissions.IsAdminUser()]
        if self.action in ['agent_profiles', 'search_agents']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminOrSelf()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        if self.action == 'change_password':
            return PasswordChangeSerializer
        if self.action == 'agent_profiles':
            return AgentPublicProfileSerializer
        if self.action == 'search_agents':
            return AgentSearchSerializer
        if self.action == 'add_license':
            return LicenseCreateSerializer
        if self.action == 'update_agent_profile':
            return AgentProfileUpdateSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        
        if self.action == 'search_agents':
            return queryset.filter(
                role='agent', 
                is_active=True
            ).select_related('agency')
            
        return queryset

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile with all related data"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def verify_email(self, request, pk=None):
        """Verify user email (admin or self only)"""
        user = self.get_object()
        if not request.user.is_staff and user != request.user:
            return Response(
                {'detail': _('You do not have permission to perform this action.')},
                status=status.HTTP_403_FORBIDDEN
            )
        user.verify_email()
        return Response({'status': _('Email verified successfully')})

    @action(detail=True, methods=['post'])
    def verify_phone(self, request, pk=None):
        """Verify user phone (admin or self only)"""
        user = self.get_object()
        if not request.user.is_staff and user != request.user:
            return Response(
                {'detail': _('You do not have permission to perform this action.')},
                status=status.HTTP_403_FORBIDDEN
            )
        user.verify_phone()
        return Response({'status': _('Phone verified successfully')})

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change password for current user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if not request.user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': _('Wrong password.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'status': _('Password updated successfully')})

    @action(detail=False, methods=['get'])
    def agent_profiles(self, request):
        """Get public profiles of all agents"""
        agents = self.get_queryset().filter(role='agent', is_active=True)
        serializer = self.get_serializer(agents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search_agents(self, request):
        """Search for agents with filters"""
        queryset = self.filter_queryset(self.get_queryset())
        
        specialization = request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specializations__name__icontains=specialization)
            
        agency = request.query_params.get('agency')
        if agency:
            queryset = queryset.filter(agency__id=agency)
            
        min_rating = request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
            
        service_area = request.query_params.get('service_area')
        if service_area:
            queryset = queryset.filter(service_areas__contains=[service_area])
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_license(self, request, pk=None):
        """Add license to agent profile"""
        user = self.get_object()
        if not user.is_agent:
            return Response(
                {'detail': _('Only agents can have licenses.')},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        license = serializer.save()
        user.licenses.add(license)
        
        return Response(
            {'status': _('License added successfully')},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['put', 'patch'])
    def update_agent_profile(self, request, pk=None):
        """Update agent professional profile"""
        user = self.get_object()
        if not user.is_agent:
            return Response(
                {'detail': _('Only agents can have professional profiles.')},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        agent_profile = user.agent_profile
        serializer = self.get_serializer(agent_profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_devices(self, request):
        """Get current user's trusted devices"""
        devices = request.user.devices.all()
        serializer = UserDeviceSerializer(devices, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Override create to handle registration differently"""
        # Prevent admin creation through registration
        if request.data.get('role') in ['admin', 'agency_admin']:
            return Response(
                {'detail': _('Cannot register with admin privileges.')},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        response_data = {
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'message': _('User registered successfully')
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class AgencyRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AgencyRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                agency = Agency.objects.create(
                    name=serializer.validated_data['agency_name'],
                    description=serializer.validated_data.get('agency_description', ''),
                    verified=False
                )
                
                admin_user = User.objects.create_user(
                    email=serializer.validated_data['email'],
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name'],
                    password=serializer.validated_data['password'],
                    role='agency_admin',
                    is_staff=True,
                    agency=agency
                )
                
                AgentProfile.objects.create(user=admin_user)
                
                return Response({
                    'agency': AgencySerializer(agency).data,
                    'admin_user': UserSerializer(admin_user).data,
                    'message': _('Agency registration successful. Pending verification.')
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.prefetch_related('members').all()
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAuthenticated, IsAgencyOwner | permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['verified']
    search_fields = ['name', 'website', 'service_areas']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify agency (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'detail': _('Only admin users can verify agencies.')},
                status=status.HTTP_403_FORBIDDEN
            )
        
        agency = self.get_object()
        agency.verified = True
        agency.save()
        
        agency.members.update(agency_verified=True)
        
        return Response({'status': _('Agency verified successfully')})

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add member to agency (owner/admin only)"""
        agency = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {'user_id': _('User not found.')},
                status=status.HTTP_404_NOT_FOUND
            )
        
        user.agency = agency
        user.role = 'agent'
        user.save()
        
        return Response({'status': _('Member added successfully')})

    @action(detail=True, methods=['get'])
    def agents(self, request, pk=None):
        """Get all agents for this agency"""
        agency = self.get_object()
        agents = agency.members.filter(role='agent', is_active=True)
        serializer = AgentPublicProfileSerializer(agents, many=True)
        return Response(serializer.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        return response


class UserActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['action']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        return UserActivityLog.objects.filter(user=self.request.user)


class LicenseViewSet(viewsets.ModelViewSet):
    serializer_class = LicenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgentOrAdmin]
    queryset = License.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'state', 'verified']
    ordering_fields = ['expiry_date']
    ordering = ['-expiry_date']

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        return self.request.user.licenses.all()

    def perform_create(self, serializer):
        license = serializer.save()
        if self.request.user.is_agent:
            self.request.user.licenses.add(license)


class SpecializationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SpecializationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Specialization.objects.all()
    pagination_class = None


class UserFavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = UserFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['property', 'agent']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AgentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = AgentProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgentOrAdmin]
    queryset = AgentProfile.objects.select_related('user').all()

    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        return AgentProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if not self.request.user.is_agent:
            raise serializers.ValidationError(
                _("Only agents can create professional profiles.")
            )
        serializer.save(user=self.request.user)
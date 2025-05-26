import logging
from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from django.shortcuts import get_object_or_404
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
    AgencyRegistrationSerializer,
    UserUpdateSerializer  # Import UserUpdateSerializer
)
from .permissions import IsAdminOrSelf, IsAgencyOwner, IsAgencyMember, IsAgentOrAdmin


logger = logging.getLogger(__name__)

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
        if self.action == 'me' and self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        """User registration endpoint with detailed logging"""
        logger.info(
            "Registration attempt initiated",
            extra={
                "client_ip": request.META.get('REMOTE_ADDR'),
                "user_agent": request.META.get('HTTP_USER_AGENT'),
                "headers": {key: request.META.get(key) for key in request.META},
                "data": {k: v for k, v in request.data.items() if k not in ['password', 'password2']}
            }
        )

        # Block admin registration attempts
        if request.data.get('role') in ['admin', 'agency_admin']:
            logger.warning(
                "Blocked admin registration attempt",
                extra={"email": request.data.get('email')}
            )
            return Response(
                {'detail': _('Admin registration not allowed')},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(
                f"Registration validation failed. Errors: {serializer.errors}. "
                f"Data: {{ {', '.join([f'{k}: {v}' for k, v in request.data.items() if k not in ['password', 'password2']])} }}",
                extra={
                    "data": {k: v for k, v in request.data.items()}
                }
            )
            return Response(
                {"detail": "Validation failed", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                user = serializer.save()
                logger.info(
                    "User registered successfully",
                    extra={
                        "user_id": user.id,
                        "email": user.email,
                        "role": user.role,
                        "data": {k: v for k, v in request.data.items() if k not in ['password', 'password2']}
                    }
                )
                return Response(
                    {
                        'user': UserSerializer(user).data,
                        'message': _('Registration successful')
                    },
                    status=status.HTTP_201_CREATED
                )
        except Exception as e:
            logger.critical(
                "Registration system error",
                extra={
                    "error": str(e),
                    "stack_trace": traceback.format_exc(),
                    "request_data": {k: v for k, v in request.data.items() if k not in ['password', 'password2']}
                }
            )
            return Response(
                {"detail": "Registration system error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Current user profile endpoint with logging"""
        user = request.user
        logger.info(
            "User profile access",
            extra={
                "user_id": user.id,
                "action": request.method,
                "headers": {key: request.META.get(key) for key in request.META}
            }
        )

        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            logger.debug(
                "Profile update data received",
                extra={
                    "user_id": user.id,
                    "data": request.data,
                    "headers": {key: request.META.get(key) for key in request.META}
                }
            )
            serializer = self.get_serializer(user, data=request.data, partial=True)

            if not serializer.is_valid():
                logger.warning(
                    "Profile update validation failed",
                    extra={
                        "user_id": user.id,
                        "errors": serializer.errors
                    }
                )
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            try:
                serializer.save()
                logger.info(
                    "Profile updated successfully",
                    extra={"user_id": user.id}
                )
                return Response(serializer.data)
            except Exception as e:
                logger.error(
                    "Profile update error",
                    extra={
                        "user_id": user.id,
                        "error": str(e),
                        "stack_trace": traceback.format_exc()
                    }
                )
                return Response(
                    {'detail': _('Profile update failed')},
                    status=status.HTTP_400_BAD_REQUEST
                )

    @action(detail=True, methods=['post'])
    def verify_email(self, request, pk=None):
        """Email verification endpoint with logging"""
        user = self.get_object()
        logger.info(
            "Email verification attempt",
            extra={
                "target_user": user.id,
                "requester": request.user.id,
                "headers": {key: request.META.get(key) for key in request.META}
            }
        )

        if not request.user.is_staff and user != request.user:
            logger.warning(
                "Unauthorized verification attempt",
                extra={
                    "attempted_user": user.id,
                    "requester": request.user.id
                }
            )
            return Response(
                {'detail': _('Permission denied')},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user.verify_email()
            logger.info(
                "Email verified successfully",
                extra={"user_id": user.id}
            )
            return Response({'status': _('Email verified successfully')})
        except Exception as e:
            logger.error(
                "Email verification failed",
                extra={
                    "user_id": user.id,
                    "error": str(e)
                }
            )
            return Response(
                {'detail': _('Verification failed')},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def verify_phone(self, request, pk=None):
        """Phone verification endpoint with logging"""
        user = self.get_object()
        logger.info(
            "Phone verification attempt",
            extra={
                "target_user": user.id,
                "requester": request.user.id,
                "headers": {key: request.META.get(key) for key in request.META}
            }
        )

        if not request.user.is_staff and user != request.user:
            logger.warning(
                "Unauthorized phone verification attempt",
                extra={
                    "attempted_user": user.id,
                    "requester": request.user.id
                }
            )
            return Response(
                {'detail': _('Permission denied')},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            user.verify_phone()
            logger.info(
                "Phone number verified",
                extra={"user_id": user.id}
            )
            return Response({'status': _('Phone verified successfully')})
        except Exception as e:
            logger.error(
                "Phone verification failed",
                extra={
                    "user_id": user.id,
                    "error": str(e)
                }
            )
            return Response(
                {'detail': _('Verification failed')},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Similar logging updates for other actions (password change, agent profiles, etc.)

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
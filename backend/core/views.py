from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Agency, UserActivityLog, LoginHistory
from .serializers import (
    UserSerializer, AgencySerializer, 
    CustomTokenObtainPairSerializer,
    UserActivityLogSerializer, LoginHistorySerializer
)

class IsAdminOrSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSelf]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def verify_email(self, request, pk=None):
        user = self.get_object()
        user.verify_email()
        return Response({'status': 'email verified'})

    @action(detail=True, methods=['post'])
    def verify_phone(self, request, pk=None):
        user = self.get_object()
        user.verify_phone()
        return Response({'status': 'phone verified'})

class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    permission_classes = [permissions.IsAdminUser]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivityLog.objects.all()
    serializer_class = UserActivityLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

class LoginHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LoginHistory.objects.all()
    serializer_class = LoginHistorySerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
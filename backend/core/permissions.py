from rest_framework import permissions
from django.utils.translation import gettext_lazy as _

class IsAdminOrSelf(permissions.BasePermission):
    """
    Allow access to admin users or the user themselves.
    """
    message = _('Only admin users or the account owner can perform this action.')

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user


class IsAgencyOwner(permissions.BasePermission):
    """
    Allow access only to agency owners.
    """
    message = _('Only agency owners can perform this action.')

    def has_object_permission(self, request, view, obj):
        # For agency model instances
        if hasattr(obj, 'members'):
            return obj.members.filter(
                id=request.user.id,
                agency_role='owner'
            ).exists()
        
        # For user instances with agency relationship
        if hasattr(obj, 'agency'):
            return obj.agency.members.filter(
                id=request.user.id,
                agency_role='owner'
            ).exists()
        
        return False


class IsAgencyMember(permissions.BasePermission):
    """
    Allow access to agency members (owners, managers, or agents).
    """
    message = _('Only agency members can perform this action.')

    def has_object_permission(self, request, view, obj):
        # For agency model instances
        if hasattr(obj, 'members'):
            return obj.members.filter(id=request.user.id).exists()
        
        # For user instances with agency relationship
        if hasattr(obj, 'agency'):
            return obj.agency.members.filter(id=request.user.id).exists()
        
        return False


class IsAdminOrAgencyOwner(permissions.BasePermission):
    """
    Allow access to admin users or agency owners.
    """
    message = _('Only admin users or agency owners can perform this action.')

    def has_permission(self, request, view):
        return request.user.is_staff or (
            request.user.role == 'agency' and 
            request.user.agency_role == 'owner'
        )
    
class IsAgentOrAdmin(permissions.BasePermission):
    """
    Allow access to admin users or agents.
    """
    message = _('Only admin users or agents can perform this action.')

    def has_permission(self, request, view):
        return request.user.is_staff or request.user.role == 'agent'

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or request.user.role == 'agent'
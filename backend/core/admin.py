from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import (
    User, Agency, License, Specialization, AgentProfile, 
    UserActivityLog, UserDevice, UserFavorite
)
from django.db import models
from django_json_widget.widgets import JSONEditorWidget


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'first_name', 'last_name')


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = (
        'email', 
        'first_name', 
        'last_name', 
        'role', 
        'is_active', 
        'is_staff',
        'last_login',
        'email_verified',
        'agency'
    )
    list_select_related = ('agency',)
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    list_filter = (
        'role', 
        'is_active', 
        'is_staff', 
        'is_superuser',
        'email_verified',
        'agency_verified',
        'agency'
    )
    ordering = ('-created_at',)
    readonly_fields = ('last_login', 'created_at', 'updated_at')
    filter_horizontal = ('licenses', 'specializations', 'groups', 'user_permissions')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {
            'fields': (
                'first_name', 
                'last_name', 
                'date_of_birth',
                'profile_picture',
                'cover_photo',
                'gender',
                'phone_number',
                'alternate_phone',
                'bio'
            )
        }),
        (_('Professional Info'), {
            'fields': (
                'licenses',
                'specializations',
                'years_of_experience',
                'languages',
                'service_areas',
                'average_response_time',
                'rating',
                'reviews_count'
            ),
            'classes': ('collapse',)
        }),
        (_('Social Media'), {
            'fields': (
                'facebook_url',
                'linkedin_url',
                'twitter_url',
                'instagram_url'
            ),
            'classes': ('collapse',)
        }),
        (_('Permissions'), {
            'fields': (
                'role',
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions'
            )
        }),
        (_('Verification Status'), {
            'fields': (
                'email_verified',
                'email_verified_at',
                'phone_verified',
                'phone_verified_at',
                'agency_verified',
                'agency_verified_at'
            )
        }),
        (_('Security'), {
            'fields': (
                'failed_login_attempts',
                'account_locked_until',
                'tfa_enabled',
                'tfa_secret'
            ),
            'classes': ('collapse',)
        }),
        (_('Agency Information'), {
            'fields': (
                'agency',
                'agency_role',
                'verification_documents'
            )
        }),
        (_('Preferences'), {
            'fields': (
                'notification_preferences',
                'communication_preferences'
            ),
            'classes': ('collapse',)
        }),
        (_('Activity Tracking'), {
            'fields': (
                'last_login',
                'last_activity',
                'is_online',
                'last_seen'
            ),
            'classes': ('collapse',)
        }),
        (_('Important Dates'), {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'first_name',
                'last_name',
                'password1',
                'password2',
                'role',
                'is_staff'
            ),
        }),
    )

    actions = [
        'activate_users', 
        'deactivate_users', 
        'verify_emails',
        'verify_phones',
        'reset_failed_logins'
    ]

    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users activated successfully')
    activate_users.short_description = _("Activate selected users")

    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users deactivated successfully')
    deactivate_users.short_description = _("Deactivate selected users")

    def verify_emails(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(email_verified=True, email_verified_at=timezone.now())
        self.message_user(request, f'{updated} users email verified successfully')
    verify_emails.short_description = _("Verify emails for selected users")

    def verify_phones(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(phone_verified=True, phone_verified_at=timezone.now())
        self.message_user(request, f'{updated} users phone verified successfully')
    verify_phones.short_description = _("Verify phones for selected users")

    def reset_failed_logins(self, request, queryset):
        updated = queryset.update(failed_login_attempts=0, account_locked_until=None)
        self.message_user(request, f'{updated} users login attempts reset')
    reset_failed_logins.short_description = _("Reset failed login attempts")


class LicenseAdmin(admin.ModelAdmin):
    list_display = ('number', 'type', 'state', 'expiry_date', 'verified')
    list_filter = ('type', 'state', 'verified')
    search_fields = ('number', 'state')
    date_hierarchy = 'expiry_date'
    readonly_fields = ('verified_at',)
    
    def get_readonly_fields(self, request, obj=None):
        if obj and obj.verified:
            return self.readonly_fields + ('number', 'type', 'state')
        return self.readonly_fields


class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', 'description')
    # Removed prepopulated_fields as slug field doesn't exist in model


class AgentProfileInline(admin.StackedInline):
    model = AgentProfile
    can_delete = False
    verbose_name_plural = 'Agent Profile'
    fk_name = 'user'
    fields = (
        'professional_title',
        'certifications',
        'education',
        'awards',
        'specialties',
        'testimonial_video',
        'office_hours',
        'appointment_slots'
    )


class UserDeviceAdmin(admin.ModelAdmin):
    list_display = ('user', 'device_name', 'device_type', 'os', 'last_used', 'is_trusted')
    list_filter = ('device_type', 'os', 'is_trusted')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'device_name')
    readonly_fields = ('last_used',)


class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_content', 'created_at')
    list_filter = ('created_at',)
    search_fields = (
        'user__email',
        'user__first_name',
        'user__last_name',
        'agent__email',
        'agent__first_name',
        'agent__last_name',
        'property__title'
    )
    readonly_fields = ('created_at',)
    
    def get_content(self, obj):
        if obj.property:
            return f"Property: {obj.property}"
        elif obj.agent:
            return f"Agent: {obj.agent.full_name}"
        return "Saved Search"
    get_content.short_description = 'Content'


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = (
        'name', 
        'verified', 
        'verified_at',
        'agent_count',
        'created_at'
    )
    search_fields = ('name', 'website', 'description', 'address')
    list_filter = ('verified',)
    readonly_fields = ('created_at', 'updated_at', 'verified_at')
    actions = ['verify_agencies']
    formfield_overrides = {
        models.JSONField: {'widget': JSONEditorWidget},
    }

    fieldsets = (
        (None, {'fields': ('name', 'website', 'description', 'logo')}),
        (_('Location'), {
            'fields': ('address', 'latitude', 'longitude')
        }),
        (_('Details'), {
            'fields': ('founded_date', 'service_areas', 'languages')
        }),
        (_('Verification'), {
            'fields': ('verified', 'verified_at')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def agent_count(self, obj):
        return obj.active_agents.count()
    agent_count.short_description = _('Active Agents')

    def verify_agencies(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(verified=True, verified_at=timezone.now())
        
        # Update all related users
        User.objects.filter(agency__in=queryset).update(
            agency_verified=True,
            agency_verified_at=timezone.now()
        )
        
        self.message_user(request, f'{updated} agencies verified successfully')
    verify_agencies.short_description = _("Verify selected agencies")


@admin.register(UserActivityLog)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'action',
        'timestamp',
        'ip_address',
        'truncated_details'
    )
    list_filter = ('action',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'

    def truncated_details(self, obj):
        details = str(obj.details)
        return (details[:50] + '...') if len(details) > 50 else details
    truncated_details.short_description = _('Details')


# Register all models
admin.site.register(User, CustomUserAdmin)
admin.site.register(License, LicenseAdmin)
admin.site.register(Specialization, SpecializationAdmin)
admin.site.register(AgentProfile)
admin.site.register(UserDevice, UserDeviceAdmin)
admin.site.register(UserFavorite, UserFavoriteAdmin)
# properties/admin.py


from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    PlaceOfInterest, Property, PropertyPlaceOfInterest, PropertyImage,
    PropertyVideo, ServiceSubscription, Transaction, RentalContract,
    SaleContract, PropertyInterest
)
# Assuming your core models User and Agency are registered elsewhere (e.g., in a 'core' app)
# If not, you might need to register them here or in their own app's admin.py


@admin.register(PlaceOfInterest)
class PlaceOfInterestAdmin(admin.ModelAdmin):
    list_display = ('name', 'place_type', 'address', 'latitude', 'longitude')
    list_filter = ('place_type',)
    search_fields = ('name', 'address')
    ordering = ('name',)


# Inlines for Property Admin
class PropertyImageInline(admin.TabularInline): # Or admin.StackedInline for more vertical space
    model = PropertyImage
    extra = 1 # Number of empty forms to display
    readonly_fields = ('thumbnail',) # Assuming thumbnail is auto-generated or managed elsewhere
    fields = ('image', 'thumbnail', 'is_primary')


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1
    readonly_fields = ('thumbnail', 'duration') # Assuming these are processed/set elsewhere
    fields = ('video_file', 'thumbnail', 'duration')


class PropertyPlaceOfInterestInline(admin.TabularInline):
    model = PropertyPlaceOfInterest
    extra = 1
    autocomplete_fields = ('place',) # Makes selecting places easier if you have many


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'property_type', 'listing_type', 'status', 'price', 'city', 'state', 'owner', 'listing_agency', 'featured', 'created_at')
    list_filter = ('property_type', 'status', 'listing_type', 'featured', 'city', 'state', 'listing_agency')
    search_fields = ('title', 'description', 'address', 'city', 'zip_code', 'owner__username', 'listing_agency__name')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('owner', 'listing_agency') # Assumes User and Agency admins have search_fields configured
    list_editable = ('status', 'featured') # Allow editing these directly in the list view
    list_per_page = 25


    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'description', 'property_type', 'listing_type', 'status', 'featured')
        }),
        (_('Location'), {
            'fields': ('address', 'city', 'state', 'zip_code')
        }),
        (_('Pricing & Measurements'), {
            'fields': ('price', 'viewing_fee', 'bedrooms', 'bathrooms', 'area')
        }),
        (_('Relationships'), {
            'fields': ('owner', 'listing_agency') # ManyToMany 'places_of_interest' is handled by inline
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',) # Keep timestamps section collapsed by default
        }),
    )
    # Add the inlines defined above
    inlines = [PropertyPlaceOfInterestInline, PropertyImageInline, PropertyVideoInline]


    ordering = ('-created_at',)


    # Optional: Add custom actions
    # def make_featured(self, request, queryset):
    #     queryset.update(featured=True)
    # make_featured.short_description = _("Mark selected properties as featured")


    # def remove_featured(self, request, queryset):
    #     queryset.update(featured=False)
    # remove_featured.short_description = _("Remove featured status from selected properties")


    # actions = [make_featured, remove_featured]




@admin.register(PropertyPlaceOfInterest)
class PropertyPlaceOfInterestAdmin(admin.ModelAdmin):
    list_display = ('property', 'place', 'distance')
    list_filter = ('place__place_type',) # Filter by the type of the related place
    search_fields = ('property__title', 'place__name')
    autocomplete_fields = ('property', 'place')
    ordering = ('property', 'distance')


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image_preview', 'is_primary', 'created_at')
    list_filter = ('is_primary', 'property')
    search_fields = ('property__title',)
    readonly_fields = ('thumbnail', 'created_at') # Assuming thumbnail is auto-generated
    autocomplete_fields = ('property',)
    ordering = ('property', '-is_primary', '-created_at')


    def image_preview(self, obj):
        from django.utils.html import format_html
        if obj.thumbnail: # Prefer thumbnail for preview if available
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.thumbnail.url)
        elif obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.image.url)
        return _("No Image")
    image_preview.short_description = _('Preview')


@admin.register(PropertyVideo)
class PropertyVideoAdmin(admin.ModelAdmin):
    list_display = ('property', 'video_file', 'thumbnail_preview', 'duration', 'created_at')
    list_filter = ('property',)
    search_fields = ('property__title',)
    readonly_fields = ('thumbnail', 'duration', 'created_at', 'updated_at') # Assuming thumbnail/duration are set programmatically
    autocomplete_fields = ('property',)
    ordering = ('property', '-created_at')


    def thumbnail_preview(self, obj):
        from django.utils.html import format_html
        if obj.thumbnail:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.thumbnail.url)
        return _("No Thumbnail")
    thumbnail_preview.short_description = _('Thumbnail')


@admin.register(ServiceSubscription)
class ServiceSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'service_type', 'valid_until', 'is_active', 'created_at')
    list_filter = ('service_type', 'property')
    search_fields = ('user__username', 'property__title')
    readonly_fields = ('created_at', 'is_active')
    autocomplete_fields = ('user', 'property')
    ordering = ('-valid_until',)


    # Need to make the method boolean for display in admin
    def is_active(self, obj):
        return obj.is_active()
    is_active.boolean = True
    is_active.short_description = _('Is Active?') # Column header




@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'transaction_type', 'amount', 'property', 'subscription', 'created_at', 'payment_id')
    list_filter = ('transaction_type', 'property')
    search_fields = ('user__username', 'property__title', 'payment_id', 'subscription__id')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('user', 'property', 'subscription')
    date_hierarchy = 'created_at' # Adds date drill-down navigation
    ordering = ('-created_at',)


@admin.register(RentalContract)
class RentalContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'tenant', 'start_date', 'end_date', 'monthly_rent', 'is_active', 'created_at')
    list_filter = ('is_active', 'property', 'tenant')
    search_fields = ('property__title', 'tenant__username')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('property', 'tenant')
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)


@admin.register(SaleContract)
class SaleContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'sale_price', 'is_completed', 'created_at')
    list_filter = ('is_completed', 'property', 'buyer')
    search_fields = ('property__title', 'buyer__username')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('property', 'buyer')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(PropertyInterest)
class PropertyInterestAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')
    list_filter = ('property',)
    search_fields = ('user__username', 'property__title')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('user', 'property')
    ordering = ('-created_at',)
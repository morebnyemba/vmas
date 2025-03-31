from django.contrib import admin
from .models import Property, PropertyImage, PropertyVideo, RentalContract, SaleContract

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ('image', 'is_primary', 'processing_status', 'created_at')
    readonly_fields = ('created_at',)
    verbose_name = 'Property Image'
    verbose_name_plural = 'Property Images'

class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1
    fields = ('video_file', 'duration', 'processing_status', 'created_at')
    readonly_fields = ('created_at',)
    verbose_name = '360 Video'
    verbose_name_plural = '360 Videos'

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline, PropertyVideoInline]
    list_display = ('title', 'property_type', 'status', 'price', 'city', 'owner', 'created_at')
    list_filter = ('property_type', 'status', 'city', 'created_at')
    search_fields = ('title', 'description', 'address', 'city', 'zip_code')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'property_type', 'status', 'featured')
        }),
        ('Location Details', {
            'fields': ('address', 'city', 'state', 'zip_code')
        }),
        ('Pricing & Measurements', {
            'fields': ('price', 'viewing_fee', 'bedrooms', 'bathrooms', 'area')
        }),
        ('Ownership', {
            'fields': ('owner', 'listing_agency')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class RentalContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'tenant', 'start_date', 'end_date', 'monthly_rent', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('property__title', 'tenant__username', 'tenant__email')
    readonly_fields = ('created_at', 'contract_duration', 'total_fees')
    fieldsets = (
        ('Contract Details', {
            'fields': ('property', 'tenant', 'start_date', 'end_date')
        }),
        ('Financial Information', {
            'fields': ('monthly_rent', 'security_deposit')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Calculations', {
            'fields': ('contract_duration', 'total_fees'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def contract_duration(self, obj):
        return f"{(obj.end_date - obj.start_date).days} days"
    contract_duration.short_description = 'Contract Duration'

    def total_fees(self, obj):
        return obj.total_fees()
    total_fees.short_description = 'Total Fees'

class SaleContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'sale_price', 'created_at', 'is_completed')
    list_filter = ('is_completed', 'created_at')
    search_fields = ('property__title', 'buyer__username', 'buyer__email')
    readonly_fields = ('created_at', 'total_fees')
    fieldsets = (
        ('Sale Details', {
            'fields': ('property', 'buyer', 'is_completed')
        }),
        ('Financial Information', {
            'fields': ('sale_price',)
        }),
        ('Calculations', {
            'fields': ('total_fees',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def total_fees(self, obj):
        return obj.total_fees()
    total_fees.short_description = 'Total Fees'

admin.site.register(Property, PropertyAdmin)
admin.site.register(RentalContract, RentalContractAdmin)
admin.site.register(SaleContract, SaleContractAdmin) 
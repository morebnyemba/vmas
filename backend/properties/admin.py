from django.contrib import admin
from .models import Property, PropertyImage, PropertyVideo, RentalContract, SaleContract

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ('image', 'is_primary', 'created_at')
    readonly_fields = ('created_at',)
    verbose_name = ('Property Image')
    verbose_name_plural = ('Property Images')

class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 1
    fields = ('video_file', 'duration', 'created_at')
    readonly_fields = ('created_at',)
    verbose_name = ('360 Video')
    verbose_name_plural = ('360 Videos')

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline, PropertyVideoInline]
    list_display = ('title', 'property_type', 'status', 'price', 'city', 'owner', 'created_at')
    list_filter = ('property_type', 'status', 'city', 'created_at')
    search_fields = ('title', 'description', 'address', 'city', 'zip_code')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'property_type', 'status')
        }),
        ('Location Details', {
            'fields': ('address', 'city', 'state', 'zip_code')
        }),
        ('Pricing & Measurements', {
            'fields': ('price', 'bedrooms', 'bathrooms', 'area')
        }),
        ('Ownership', {
            'fields': ('owner',)
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
    readonly_fields = ('created_at', 'updated_at', 'contract_duration')
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
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def contract_duration(self, obj):
        return f"{obj.contract_duration()} days"
    contract_duration.short_description = 'Contract Duration'

class SaleContractAdmin(admin.ModelAdmin):
    list_display = ('property', 'buyer', 'sale_price', 'sale_date', 'total_commission')
    list_filter = ('sale_date',)
    search_fields = ('property__title', 'buyer__username', 'buyer__email')
    readonly_fields = ('created_at', 'updated_at', 'total_commission', 'total_transaction_value')
    fieldsets = (
        ('Sale Details', {
            'fields': ('property', 'buyer', 'sale_date')
        }),
        ('Financial Information', {
            'fields': ('sale_price', 'closing_costs', 'commission_rate')
        }),
        ('Calculations', {
            'fields': ('total_commission', 'total_transaction_value'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_commission(self, obj):
        return obj.total_commission()
    total_commission.short_description = 'Total Commission'

    def total_transaction_value(self, obj):
        return obj.total_transaction_value()
    total_transaction_value.short_description = 'Total Transaction Value'

admin.site.register(Property, PropertyAdmin)
admin.site.register(RentalContract, RentalContractAdmin)
admin.site.register(SaleContract, SaleContractAdmin)
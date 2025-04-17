# backend/payments/admin.py
from django.contrib import admin
from .models import PaynowIntegration, Payment

@admin.register(PaynowIntegration)
class PaynowIntegrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'currency', 'is_active', 'return_url', 'result_url')
    list_filter = ('is_active', 'currency')
    search_fields = ('name',)
  

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'reference',
        'user',
        'amount',
        'currency',
        'status',
        'integration',
        'buyer_phone',
        'created_at'
    )
    list_filter = ('status', 'currency', 'integration', 'created_at')
    search_fields = ('reference__iexact', 'user__username', 'user__email')
    readonly_fields = (
        'reference', 'paynow_payment_id', 'poll_url',
        'payment_url', 'error_message', 'created_at', 'updated_at'
    )
    fieldsets = (
        (None, {
            'fields': ('reference', 'user', 'status', 'integration')
        }),
        ('Payment Details', {
            'fields': ('amount', 'currency', 'buyer_phone')
        }),
        ('Paynow Information', {
            'fields': ('paynow_payment_id', 'poll_url', 'payment_url', 'error_message'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
# backend/payments/serializers.py
from rest_framework import serializers
from .models import Payment, PaynowIntegration

class PaynowIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaynowIntegration
        fields = ['id', 'name', 'currency', 'return_url', 'result_url']
        read_only_fields = ['id']

class PaymentSerializer(serializers.ModelSerializer):
    integration = PaynowIntegrationSerializer(read_only=True)
    integration_id = serializers.PrimaryKeyRelatedField(
        queryset=PaynowIntegration.objects.all(),
        source='integration',
        write_only=True,
        required=True
    )
    buyer_phone = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'reference', 'amount', 'currency', 'status',
            'integration', 'integration_id', 'paynow_payment_id',
            'poll_url', 'payment_url', 'created_at', 'buyer_phone'
        ]
        read_only_fields = [
            'id', 'reference', 'status', 'integration',
            'paynow_payment_id', 'poll_url', 'payment_url', 'created_at'
        ]

    def validate(self, data):
        """Check currency compatibility"""
        integration = data.get('integration')
        currency = data.get('currency', 'USD')
        
        if integration and currency != integration.currency:
            raise serializers.ValidationError(
                f"Integration {integration.name} only supports {integration.currency} payments"
            )
        return data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['is_redirectable'] = bool(data.get('payment_url'))
        data['is_pollable'] = bool(data.get('poll_url'))
        return data
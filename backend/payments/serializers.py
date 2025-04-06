# serializers.py
from rest_framework import serializers
from .models import Payment, PaynowIntegration

class PaynowIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaynowIntegration
        fields = ['id', 'name', 'return_url', 'result_url']
        read_only_fields = ['id']

class PaymentSerializer(serializers.ModelSerializer):
    integration = PaynowIntegrationSerializer(read_only=True)
    integration_id = serializers.PrimaryKeyRelatedField(
        queryset=PaynowIntegration.objects.all(),
        source='integration',
        write_only=True,
        required=True
    )
    
    class Meta:
        model = Payment
        fields = [
            'id', 'reference', 'amount', 'currency', 'status',
            'integration', 'integration_id', 'paynow_payment_id',
            'poll_url', 'payment_url', 'created_at'
        ]
        read_only_fields = [
            'id', 'reference', 'status', 'integration',
            'paynow_payment_id', 'poll_url', 'payment_url', 'created_at'
        ]
    
    def to_representation(self, instance):
        """Custom representation for frontend consumption"""
        data = super().to_representation(instance)
        # Add frontend-specific fields
        data['is_redirectable'] = bool(data.get('payment_url'))
        data['is_pollable'] = bool(data.get('poll_url'))
        return data
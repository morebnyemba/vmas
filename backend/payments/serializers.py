# backend/payments/serializers.py
from rest_framework import serializers
from .models import Payment, PaynowIntegration, Receipt # Ensure Receipt is imported
from core.models import User # Assuming User is in core.models (adjust if User model is elsewhere)

class PaynowIntegrationSerializer(serializers.ModelSerializer):
    """
    Serializer for PaynowIntegration details.
    """
    class Meta:
        model = PaynowIntegration
        # It's generally better to be explicit with fields than using "__all__"
        fields = ['id', 'name', 'integration_id', 'return_url', 'result_url', 'is_active', 'currency']
        read_only_fields = ['id']

class PaymentUserSerializer(serializers.ModelSerializer):
    """
    A simple serializer for user information to be nested in PaymentSerializer for read operations.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name'] # Customize as needed


class PaymentSerializer(serializers.ModelSerializer):
    integration = PaynowIntegrationSerializer(read_only=True)
    integration_id = serializers.PrimaryKeyRelatedField(
        queryset=PaynowIntegration.objects.filter(is_active=True),
        source='integration',
        write_only=True,
        required=True
    )
    buyer_phone = serializers.CharField(required=False, allow_null=True, allow_blank=True) # Allow blank for buyer_phone

    # For displaying user details on read
    user = PaymentUserSerializer(read_only=True)
    # For associating user on write (e.g., admin creating payment for a user or user creating own payment)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False, # Set to True if a user is always required
        allow_null=True  # Allow null if payments can be anonymous or user is set contextually in view
    )

    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'user_id', 'reference', 'amount', 'currency', 'status',
            'integration', 'integration_id', 'paynow_payment_id',
            'poll_url', 'payment_url', 'created_at', 'updated_at', 'buyer_phone', # Added updated_at
            'error_message' # It's good to expose any error messages
        ]
        read_only_fields = [
            'id', 'reference', 'status', 'integration', # user is read_only due to PaymentUserSerializer
            'paynow_payment_id', 'poll_url', 'payment_url', 'created_at', 'updated_at', 'error_message'
        ]

    def validate(self, data):
        # integration_id is used for write, data['integration'] will be the resolved object
        integration = data.get('integration') # This is the PaynowIntegration instance
        
        # If integration_id was passed, 'integration' will be populated by DRF.
        # If 'integration' is not in data, it means integration_id was not provided or was invalid.
        # The PrimaryKeyRelatedField handles the existence check for integration_id.

        if not integration:
            # This case should ideally be caught by PrimaryKeyRelatedField if integration_id is invalid.
            # If integration_id is simply not provided and it's required, DRF handles that.
            pass # Or raise explicit error if integration is None after DRF processing.

        currency = data.get('currency', payment.currency if self.instance else 'USD')  # Defaults to existing or USD

        if integration:
            if currency != integration.currency:
                raise serializers.ValidationError(
                    f"Payment currency '{currency}' does not match integration '{integration.name}' which supports '{integration.currency}'."
                )
            if not integration.is_active:
                raise serializers.ValidationError(
                    f"Integration '{integration.name}' is not active."
                )
        
        # Ensure amount is positive
        amount = data.get('amount')
        if amount is not None and amount <= 0:
            raise serializers.ValidationError("Amount must be a positive value.")
            
        return data

    def to_representation(self, instance):
        """
        Customize representation for Payment instances.
        """
        data = super().to_representation(instance)
        # These fields indicate if client can expect a redirect URL or should poll
        data['is_redirectable'] = bool(instance.payment_url)
        data['is_pollable'] = bool(instance.poll_url)
        return data


class ReceiptSerializer(serializers.ModelSerializer):
    """
    Serializer for Receipt details.
    """
    payment_reference = serializers.UUIDField(source='payment.reference', read_only=True)
    payment_status = serializers.CharField(source='payment.status', read_only=True)
    payment_currency = serializers.CharField(source='payment.currency', read_only=True)
    payment_amount = serializers.DecimalField(source='payment.amount', max_digits=10, decimal_places=2, read_only=True)
    
    receipt_pdf_url = serializers.SerializerMethodField()
    
    # Make customer details read-only as they are populated from the payment/user object
    customer_name = serializers.CharField(read_only=True)
    customer_email = serializers.EmailField(read_only=True)
    customer_phone = serializers.CharField(read_only=True, allow_null=True)

    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    currency = serializers.CharField(read_only=True)
    payment_method_details = serializers.CharField(read_only=True)
    items_description = serializers.CharField(read_only=True)
    notes = serializers.CharField(read_only=True, allow_null=True)


    class Meta:
        model = Receipt
        fields = [
            'id', 
            'receipt_number', 
            'issued_at', 
            'payment', # Foreign key to the Payment ID
            'payment_reference',
            'payment_status',
            'payment_currency', # Added for consistency
            'payment_amount',   # Added for consistency
            'customer_name', 
            'customer_email', 
            'customer_phone',
            'amount_paid', # This is on the receipt model, often same as payment_amount
            'currency',    # This is on the receipt model, often same as payment_currency
            'payment_method_details',
            'items_description', 
            'notes', 
            'receipt_pdf_url'
        ]
        # Most fields are read-only as receipts are system-generated
        read_only_fields = [
            'id', 'receipt_number', 'issued_at', 'payment_reference', 'payment_status',
            'payment_currency', 'payment_amount', 'receipt_pdf_url', 
            'customer_name', 'customer_email', 'customer_phone',
            'amount_paid', 'currency', 'payment_method_details', 
            'items_description', 'notes'
        ]

    def get_receipt_pdf_url(self, obj):
        """
        Returns the absolute URL for the receipt PDF if it exists.
        """
        request = self.context.get('request')
        if obj.receipt_pdf and hasattr(obj.receipt_pdf, 'url'):
            # Ensure MEDIA_URL is configured and files are served correctly.
            return request.build_absolute_uri(obj.receipt_pdf.url)
        return None

    def to_representation(self, instance):
        """
        Ensures that all fields are correctly represented, especially if denormalized.
        """
        representation = super().to_representation(instance)
        # If receipt fields like amount_paid, currency, customer_details are not directly on the model
        # but are being populated from the related payment during serialization, ensure they are present.
        # In our current Receipt model, these are actual fields, so super() should handle them.
        return representation
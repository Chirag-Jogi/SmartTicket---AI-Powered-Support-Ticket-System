from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    """
    Serializer for Ticket model
    Handles conversion between JSON and Ticket objects
    """
    
    class Meta:
        model = Ticket
        fields = [
            'id',
            'title',
            'description',
            'category',
            'priority',
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_title(self, value):
        """
        Validate title is not empty and within length
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        if len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters")
        return value.strip()
    
    def validate_description(self, value):
        """
        Validate description is not empty
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Description cannot be empty")
        return value.strip()
    
    def validate_category(self, value):
        """
        Validate category is one of the allowed choices
        """
        allowed = ['billing', 'technical', 'account', 'general']
        if value not in allowed:
            raise serializers.ValidationError(
                f"Category must be one of: {', '.join(allowed)}"
            )
        return value
    
    def validate_priority(self, value):
        """
        Validate priority is one of the allowed choices
        """
        allowed = ['low', 'medium', 'high', 'critical']
        if value not in allowed:
            raise serializers.ValidationError(
                f"Priority must be one of: {', '.join(allowed)}"
            )
        return value
    
    def validate_status(self, value):
        """
        Validate status is one of the allowed choices
        """
        allowed = ['open', 'in_progress', 'resolved', 'closed']
        if value not in allowed:
            raise serializers.ValidationError(
                f"Status must be one of: {', '.join(allowed)}"
            )
        return value
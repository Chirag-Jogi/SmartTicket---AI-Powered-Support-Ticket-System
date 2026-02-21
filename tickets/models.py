from django.db import models


class Ticket(models.Model):
    """
    Support ticket model with AI-suggested categorization
    """
    
    # Category choices
    CATEGORY_CHOICES = [
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('account', 'Account'),
        ('general', 'General'),
    ]
    
    # Priority choices
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    # Status choices
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    # Fields
    title = models.CharField(
        max_length=200,
        help_text="Brief summary of the issue"
    )
    
    description = models.TextField(
        help_text="Detailed description of the problem"
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        help_text="Auto-suggested by AI, can be overridden"
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        help_text="Auto-suggested by AI, can be overridden"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
        help_text="Current status of the ticket"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when ticket was created"
    )
    
    # Meta options
    class Meta:
        ordering = ['-created_at']  # Newest first
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
    
    # String representation
    def __str__(self):
        return f"#{self.id} - {self.title}"
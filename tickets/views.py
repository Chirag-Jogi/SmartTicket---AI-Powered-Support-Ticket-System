from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Ticket
from .serializers import TicketSerializer
from django.db.models import Q
from .llm_service import *


@api_view(['POST', 'GET'])
def ticket_list_create(request):
    """
    POST /api/tickets/ - Create a new ticket
    GET /api/tickets/ - List all tickets
    """

    if request.method == 'POST':
        # Create new ticket
        serializer = TicketSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    elif request.method == 'GET':
        # List all tickets, newest first
        tickets = Ticket.objects.all()
        
        # Apply filters if provided
        category = request.query_params.get('category', None)
        if category:
            tickets = tickets.filter(category=category)
        
        priority = request.query_params.get('priority', None)
        if priority:
            tickets = tickets.filter(priority=priority)
        
        status_filter = request.query_params.get('status', None)
        if status_filter:
            tickets = tickets.filter(status=status_filter)
        
        # Apply search if provided (searches title and description)
        search = request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            tickets = tickets.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Order by newest first
        tickets = tickets.order_by('-created_at')
        
        serializer = TicketSerializer(tickets, many=True)
        
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


@api_view(['PATCH'])
def ticket_update(request, pk):
    """
    PATCH /api/tickets/<id>/ - Update a ticket
    """
    
    try:
        ticket = Ticket.objects.get(pk=pk)
    except Ticket.DoesNotExist:
        return Response(
            {'error': 'Ticket not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Partial update (only fields provided in request)
    serializer = TicketSerializer(
        ticket,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )



@api_view(['GET'])
def ticket_stats(request):
    """
    GET /api/tickets/stats/ - Return aggregated statistics
    Uses database-level aggregation (NOT Python loops)
    """
    
    # Total tickets
    total_tickets = Ticket.objects.count()
    
    # Open tickets (status = 'open')
    open_tickets = Ticket.objects.filter(status='open').count()
    
    # Average tickets per day
    if total_tickets > 0:
        # Get the date of first ticket
        first_ticket = Ticket.objects.order_by('created_at').first()
        
        if first_ticket:
            # Calculate days since first ticket
            days_active = (timezone.now() - first_ticket.created_at).days
            
            # Avoid division by zero
            if days_active == 0:
                days_active = 1
            
            avg_tickets_per_day = round(total_tickets / days_active, 1)
        else:
            avg_tickets_per_day = 0.0
    else:
        avg_tickets_per_day = 0.0
    
    # Priority breakdown - DATABASE AGGREGATION
    priority_breakdown = {}
    priority_stats = Ticket.objects.values('priority').annotate(
        count=Count('id')
    )
    
    for stat in priority_stats:
        priority_breakdown[stat['priority']] = stat['count']
    
    # Ensure all priorities are present (even if count is 0)
    for priority in ['low', 'medium', 'high', 'critical']:
        if priority not in priority_breakdown:
            priority_breakdown[priority] = 0
    
    # Category breakdown - DATABASE AGGREGATION
    category_breakdown = {}
    category_stats = Ticket.objects.values('category').annotate(
        count=Count('id')
    )
    
    for stat in category_stats:
        category_breakdown[stat['category']] = stat['count']
    
    # Ensure all categories are present (even if count is 0)
    for category in ['billing', 'technical', 'account', 'general']:
        if category not in category_breakdown:
            category_breakdown[category] = 0
    
    # Build response
    stats = {
        'total_tickets': total_tickets,
        'open_tickets': open_tickets,
        'avg_tickets_per_day': avg_tickets_per_day,
        'priority_breakdown': priority_breakdown,
        'category_breakdown': category_breakdown
    }
    
    return Response(stats, status=status.HTTP_200_OK)



@api_view(['POST'])
def ticket_classify(request):
    """
    POST /api/tickets/classify/ - Classify ticket description using LLM
    
    Request body:
    {
        "description": "My app keeps crashing when I try to upload images"
    }
    
    Response:
    {
        "suggested_category": "technical",
        "suggested_priority": "high"
    }
    """
    
    # Get description from request
    description = request.data.get('description', '').strip()
    
    if not description:
        return Response(
            {'error': 'Description is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Initialize LLM service
    try:
        llm_service = LLMService()
    except ValueError as e:
        # API key not configured
        return Response(
            {
                'error': 'LLM service not available',
                'suggested_category': 'general',
                'suggested_priority': 'medium'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Classify ticket
    result = llm_service.classify_ticket(description)
    
    if result:
        # Classification successful
        return Response(
            {
                'suggested_category': result['category'],
                'suggested_priority': result['priority']
            },
            status=status.HTTP_200_OK
        )
    else:
        # Classification failed - return defaults
        return Response(
            {
                'error': 'Classification failed',
                'suggested_category': 'general',
                'suggested_priority': 'medium'
            },
            status=status.HTTP_200_OK
        )
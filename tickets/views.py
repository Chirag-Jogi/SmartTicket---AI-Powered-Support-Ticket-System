from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer
from django.db.models import Q


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
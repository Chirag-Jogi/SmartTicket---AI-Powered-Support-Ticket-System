from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer


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
        tickets = Ticket.objects.all().order_by('-created_at')
        serializer = TicketSerializer(tickets, many=True)
        
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
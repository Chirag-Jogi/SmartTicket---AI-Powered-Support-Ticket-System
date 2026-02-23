from django.urls import path
from . import views

urlpatterns = [
    path('tickets/', views.ticket_list_create, name='ticket-list-create'),
    path('tickets/stats/', views.ticket_stats, name='ticket-stats'),
    path('tickets/<int:pk>/', views.ticket_update, name='ticket-update'),
]
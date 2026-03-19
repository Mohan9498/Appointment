from django.urls import path
from .consumers import AppointmentConsumer

websocket_urlpatterns = [
    path("ws/appointments/", AppointmentConsumer.as_asgi()),
]
from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        extra_kwargs = {
            "name": {"required": False},
            "email": {"required": False},
            "user": {"required": False},
        }
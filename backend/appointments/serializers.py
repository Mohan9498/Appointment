from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"

        extra_kwargs = {
            "user": {"required": False},
            "status": {"required": False},
            "date": {"required": False},
            "time": {"required": False},
        }
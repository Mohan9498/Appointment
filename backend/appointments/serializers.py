from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"

        extra_kwargs = {
            "user": {"required": False},
            "name": {"required": False},
            "gmail": {"required": False},
            "status": {"required": False},
        }
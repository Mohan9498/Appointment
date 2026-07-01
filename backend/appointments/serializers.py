from rest_framework import serializers
from appointments.models import Appointment, Content
 
 
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
 
 
class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = "__all__"
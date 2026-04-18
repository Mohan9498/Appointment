from rest_framework import serializers
from appointments.models import Appointment, Content


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


# 🔥 CMS SERIALIZER
class ContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Content
        fields = "__all__"

    # 🔥 VALIDATE JSON DATA (cards)
    def validate_data(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Data must be a list")

        for item in value:
            if not isinstance(item, dict):
                raise serializers.ValidationError("Each item must be an object")

            if "title" not in item or "description" not in item:
                raise serializers.ValidationError(
                    "Each card must have title & description"
                )

        return value
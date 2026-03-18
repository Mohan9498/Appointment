from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class LoginView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "is_admin": user.is_staff
            })

        return Response({"error": "Invalid credentials"}, status=401)


class AppointmentView(APIView):

    def get(self, request):
        date = request.GET.get("date")

        if date:
            appointments = Appointment.objects.filter(date=date)
        else:
            appointments = Appointment.objects.all()

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)
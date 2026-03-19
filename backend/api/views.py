from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework import status
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


class RegisterView(APIView):

        def post(self, request):
            username = request.data.get("username")
            password = request.data.get("password")

            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(
                username=username,
                password=password
            )

            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )


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
                serializer.save(user=request.user)   
                return Response(serializer.data)
            
            return Response(serializer.errors)
        

class ApproveAppointment(APIView):

        def post(self, request, id):
            try:
                appointment = Appointment.objects.get(id=id)
                appointment.status = "Approved"
                appointment.save()

                return Response(
                    {"message": "Appointment approved"},
                    status=status.HTTP_200_OK
                )

            except Appointment.DoesNotExist:
                return Response(
                    {"error": "Appointment not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

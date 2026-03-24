from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication


# ✅ ADMIN PERMISSION
class IsAdminUserCustom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


# ✅ LOGIN
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

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


# ✅ REGISTER
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")  # ✅ optional but useful

        if not username or not password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 4:
            return Response(
                {"error": "Password must be at least 4 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,   # ✅ store email
            is_staff=False
        )

        return Response(
            {
                "message": "User registered successfully",
                "username": user.username
            },
            status=status.HTTP_201_CREATED
        )


# ✅ APPOINTMENTS
class AppointmentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date = request.GET.get("date")

        if request.user.is_staff:
            appointments = (
                Appointment.objects.filter(date=date)
                if date else Appointment.objects.all()
            )
        else:
            appointments = (
                Appointment.objects.filter(user=request.user, date=date)
                if date else Appointment.objects.filter(user=request.user)
            )

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("DATA:", request.data)  

        data = request.data.copy()

        # ✅ Auto-fill fields
        data["name"] = request.user.username
        data["email"] = request.user.email or "test@email.com"

        serializer = AppointmentSerializer(data=data)  # ✅ FIXED

        if serializer.is_valid():
            appointment = serializer.save(
                user=request.user,
                status="pending"
            )

            return Response(
                AppointmentSerializer(appointment).data,
                status=status.HTTP_201_CREATED
            )

        print("ERRORS:", serializer.errors)  # 🔥 VERY IMPORTANT

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# ✅ APPROVE / REJECT
class ApproveAppointment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def post(self, request, id):
        action = request.data.get("action")

        try:
            appointment = Appointment.objects.get(id=id)

            if action == "reject":
                appointment.status = "rejected"
            else:
                appointment.status = "approved"

            appointment.save()

            return Response(
                {"message": "Appointment updated"},
                status=status.HTTP_200_OK
            )

        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found"},
                status=status.HTTP_404_NOT_FOUND
            )
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
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
        email = request.data.get("email")

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
            email=email,
            is_staff=False
        )

        return Response(
            {
                "message": "User registered successfully",
                "username": user.username
            },
            status=status.HTTP_201_CREATED
        )


# ✅ APPOINTMENTS (FIXED 🔥)
class AppointmentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # 🔒 GET → User / Admin appointments
    def get(self, request):

        if request.user.is_staff:
            appointments = Appointment.objects.all().order_by("-id")
        else:
            appointments = Appointment.objects.filter(
                user=request.user
            ).order_by("-id")

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    # ✅ POST → Simple appointment request (NO DATA REQUIRED)
    def post(self, request):

        # ✅ Ensure user is logged in
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"error": "Login required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = request.user

        try:
            # 🔥 Create appointment directly
            appointment = Appointment.objects.create(
                user=user,
                name=user.username,
                status="pending"
            )

            print("✅ APPOINTMENT CREATED:", appointment.id)

            return Response(
                {
                    "message": "Appointment request sent successfully",
                    "data": AppointmentSerializer(appointment).data
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print("🔥 ERROR:", str(e))

            return Response(
                {
                    "error": "Something went wrong",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ✅ APPROVE / REJECT
class ApproveAppointment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            action = request.data.get("action")

            if action not in ["approve", "reject"]:
                return Response(
                    {"error": "Action must be 'approve' or 'reject'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            appointment = get_object_or_404(Appointment, id=id)

            appointment.status = "approved" if action == "approve" else "rejected"
            appointment.save()

            return Response(
                {
                    "message": f"Appointment {appointment.status} successfully",
                    "id": appointment.id,
                    "status": appointment.status
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("🔥 APPROVE ERROR:", str(e))

            return Response(
                {
                    "error": "Internal server error",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"error": "Refresh token required"}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful"})

        except Exception as e:
            return Response({"error": str(e)}, status=400)
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser,AllowAny,IsAuthenticated , BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
import re

from appointments.models import Appointment
from .serializers import AppointmentSerializer

from appointments.models import Content
from .serializers import ContentSerializer


from django.shortcuts import get_object_or_404

try:
    from asgiref.sync import async_to_sync
    from channels.layers import get_channel_layer
    HAS_CHANNELS = True
except ImportError:
    HAS_CHANNELS = False


# ✅ ADMIN PERMISSION
class IsAdminUserCustom(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_staff
        )


# ✅ USER LOGIN
class LoginView(APIView):
    def post(self, request):
        try:
            username = str(request.data.get("username", "")).strip()
            password = str(request.data.get("password", ""))

            if not username or not password:
                return Response(
                    {"error": "Username and password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = authenticate(username=username, password=password)

            if user is None:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "username": user.username,
                    "is_admin": user.is_staff
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("USER LOGIN ERROR:", str(e))
            return Response(
                {"error": "Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ✅ ADMIN LOGIN
class AdminLoginView(APIView):
    def post(self, request):
        try:
            username = str(request.data.get("username", "")).strip()
            password = str(request.data.get("password", ""))

            if not username or not password:
                return Response(
                    {"error": "Username and password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = authenticate(username=username, password=password)

            if user is None:
                return Response(
                    {"error": "Invalid username or password"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not user.is_staff:
                return Response(
                    {"error": "Access denied. Admin only."},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Admin login successful",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "username": user.username,
                    "is_admin": user.is_staff
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print("ADMIN LOGIN ERROR:", str(e))
            return Response(
                {"error": "Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ✅ REGISTER
class RegisterView(APIView):
    def post(self, request):
        try:
            username = str(request.data.get("username", "")).strip()
            password = str(request.data.get("password", ""))

            if not username or not password:
                return Response(
                    {"error": "All fields are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if len(username) < 3:
                return Response(
                    {"error": "Username must be at least 3 characters"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not re.fullmatch(r"[A-Za-z0-9_@.+-]+", username):
                return Response(
                    {"error": "Username can contain only letters, numbers, and @ . + - _"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                validate_password(password, user=User(username=username))
            except DjangoValidationError as e:
                return Response(
                    {"error": e.messages[0]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(
                username=username,
                password=password,
                is_staff=False
            )

            return Response(
                {
                    "message": "User registered successfully",
                    "username": user.username
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            print("REGISTER ERROR:", str(e))
            return Response(
                {"error": "Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"error": "Refresh token required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

# ✅ APPOINTMENT VIEW
class AppointmentView(APIView):
    

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]   # ✅ public booking
        return [IsAdminUserCustom()]    # ✅ admin only view

    def get(self, request):
        try:
            if request.user.is_staff:
                appointments = Appointment.objects.all().order_by("-created_at")
            else:
                appointments = Appointment.objects.filter(user=request.user).order_by("-created_at")

            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("GET APPOINTMENTS ERROR:", str(e))
            return Response(
                {"error": "Unable to fetch appointments"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            data = request.data.copy()

            # ✅ attach logged-in user automatically
            if request.user.is_authenticated:
                data["user"] = request.user.id

            serializer = AppointmentSerializer(data=data)

            if serializer.is_valid():
                appointment = serializer.save()

                # ✅ optional websocket notification
                if HAS_CHANNELS:
                    try:
                        channel_layer = get_channel_layer()
                        async_to_sync(channel_layer.group_send)(
                            "appointments",
                            {
                                "type": "send_appointment_notification",
                                "message": f"New appointment from {request.user.username}"
                            }
                        )
                    except Exception as ws_error:
                        print("WEBSOCKET ERROR:", str(ws_error))

                return Response(
                    {
                        "message": "Saved successfully",
                        "data": AppointmentSerializer(appointment).data
                    },
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("CREATE APPOINTMENT ERROR:", str(e))
            return Response(
                {"error": "Unable to save appointment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ContentViewSet(ModelViewSet):
    queryset = Content.objects.all().order_by("-id")
    serializer_class = ContentSerializer

    authentication_classes = [JWTAuthentication]

    # 🔥 DYNAMIC PERMISSIONS
    def get_permissions(self):
        # ✅ PUBLIC READ (Frontend pages)
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        # 🔐 ADMIN WRITE (CMS Dashboard)
        return [IsAdminUserCustom()]

    # 🔥 MULTI-PAGE FILTER
    def get_queryset(self):
        queryset = Content.objects.all().order_by("-id")

        page = self.request.query_params.get("page")
        section = self.request.query_params.get("section")

        if page:
            queryset = queryset.filter(page=page)

        if section:
            queryset = queryset.filter(section=section)

        return queryset


# ✅ APPROVE / REJECT APPOINTMENT
class ApproveAppointment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUserCustom]

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
            print("APPROVE ERROR:", str(e))
            return Response(
                {"error": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser,AllowAny,IsAuthenticated , BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from appointments.models import Appointment
from .serializers import AppointmentSerializer

from appointments.models import Content
from .serializers import ContentSerializer


from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


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
            username = request.data.get("username")
            password = request.data.get("password")

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
            username = request.data.get("username")
            password = request.data.get("password")

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
            username = request.data.get("username")
            password = request.data.get("password")

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
        return [IsAdminUser()]    # ✅ admin only view

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


class ContentView(APIView):

    # ✅ Only admin can modify, anyone can view
    def get_permissions(self):
        if self.request.method == "GET":
            return []  # public access
        return [IsAdminUserCustom()]  # admin only for POST/PATCH/DELETE

    # ✅ GET all content
    def get(self, request):
        try:
            content = Content.objects.all().order_by("-id")
            serializer = ContentSerializer(content, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": "Failed to fetch content"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # ✅ CREATE content
    def post(self, request):
        serializer = ContentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Content created successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ UPDATE content
    def patch(self, request):
        content_id = request.data.get("id")

        if not content_id:
            return Response(
                {"error": "Content ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content = Content.objects.get(id=content_id)
        except Content.DoesNotExist:
            return Response(
                {"error": "Content not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ContentSerializer(content, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Content updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ✅ DELETE content
    def delete(self, request):
        content_id = request.data.get("id")

        if not content_id:
            return Response(
                {"error": "Content ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content = Content.objects.get(id=content_id)
            content.delete()

            return Response(
                {"message": "Content deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Content.DoesNotExist:
            return Response(
                {"error": "Content not found"},
                status=status.HTTP_404_NOT_FOUND
            )
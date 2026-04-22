from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    AppointmentView,
    ApproveAppointment,
    ContentViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"content", ContentViewSet, basename="content")

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("appointments/", AppointmentView.as_view()),
    path("approve/<int:id>/", ApproveAppointment.as_view()),

    # ✅ contact inside api
    path("contact/", include("contact.urls")),
    
    # ✅ Token refresh
    path("token/refresh/", TokenRefreshView.as_view()),
]

urlpatterns += router.urls
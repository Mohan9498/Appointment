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

router = DefaultRouter()
router.register(r"content", ContentViewSet, basename="content")

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("appointments/", AppointmentView.as_view()),
    path("appointments/<int:id>/", ApproveAppointment.as_view()),

    # ✅ contact inside api
    path("contact/", include("contact.urls")),
]

urlpatterns += router.urls
from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    AppointmentView,
    ApproveAppointment
)

urlpatterns = [
    path("api/register/", RegisterView.as_view()),
    path("api/login/", LoginView.as_view()),
    path("api/logout/", LogoutView.as_view(), name="logout" ),
    path("api/appointments/", AppointmentView.as_view()),
    path("api/appointments/<int:id>/", ApproveAppointment.as_view()),
]
from django.urls import path
from .views import (
    AppointmentView,
    ApproveAppointment,
    RegisterView,
    LoginView
)

urlpatterns = [
    path("appointments/", AppointmentView.as_view()),
    path("approve/<int:id>/", ApproveAppointment.as_view()),
    
    path("register/", RegisterView.as_view()),   # ✅ FIX
    path("login/", LoginView.as_view()),         # ✅ ALSO ADD THIS
]
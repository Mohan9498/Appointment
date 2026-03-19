from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    AppointmentView,
    ApproveAppointment,
    RegisterView,
    LoginView
)

urlpatterns = [
    path("appointments/", AppointmentView.as_view()),
    path("approve/<int:id>/", ApproveAppointment.as_view()),
    
    path("register/", RegisterView.as_view()),   
    path("login/", LoginView.as_view()),       

    path("token/refresh/", TokenRefreshView.as_view()),
]
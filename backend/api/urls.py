from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AppointmentView,
    RegisterView,
    LoginView,
    LogoutView,
    AdminLoginView,
      
    
)

urlpatterns = [
    # ✅ AUTH
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view()),
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),

    # ✅ APPOINTMENTS
    path("appointments/", AppointmentView.as_view(), name="appointments"),

  

    # ✅ JWT REFRESH
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
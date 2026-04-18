from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    AppointmentView,
    ApproveAppointment,
    ContentViewSet,
)

# 🔥 Router for CMS
router = DefaultRouter()
router.register(r"content", ContentViewSet, basename="content")

urlpatterns = [

    # AUTH
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),

    # APPOINTMENTS
    path("appointments/", AppointmentView.as_view()),
    path("appointments/<int:id>/", ApproveAppointment.as_view()),

    # 🔥 INCLUDE OTHER APPS INSIDE API
    path("contact/", include("contact.urls")),
    path("accounts/", include("accounts.urls")),
    path("programs/", include("programs.urls")),
]

# 🔥 ENABLE /api/content/
urlpatterns += router.urls
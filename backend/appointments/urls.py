from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    AppointmentView,
  
    ContentViewSet,
    ApproveAppointment
)

router = DefaultRouter()
router.register(r"content", ContentViewSet, basename="content")

urlpatterns = [
    path("api/register/", RegisterView.as_view()),
    path("api/login/", LoginView.as_view()),
    path("api/logout/", LogoutView.as_view(), name="logout" ), 
    path("api/appointments/", AppointmentView.as_view()),
    path("api/appointments/<int:id>/", ApproveAppointment.as_view()),
]

urlpatterns += [
    path("api/", include(router.urls)),   
]
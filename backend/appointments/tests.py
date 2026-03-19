from django.urls import path
from .views import AppointmentView,ApproveAppointment


urlpatterns = [

path('appointments/',AppointmentView.as_view()),
path('appointments/<int:id>/approve/',ApproveAppointment.as_view()),

]
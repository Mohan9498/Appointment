from django.urls import path
from .views import ContactView

urlpatterns = [
    path("", ContactView.as_view()),          
    path("contact/<int:pk>/", ContactView.as_view()), 
]
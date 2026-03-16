from django.db import models
from django.contrib.auth.models import User

class Appointment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="api_appointments"
    )

    name = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()

    status = models.CharField(max_length=20, default="pending")

    def __str__(self):
        return self.name
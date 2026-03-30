from django.db import models
from django.contrib.auth.models import User

class Appointment(models.Model):
    parent_name = models.CharField(max_length=100)
    child_name = models.CharField(max_length=100)
    age = models.IntegerField()
    phone = models.CharField(max_length=10)
    branch = models.CharField(max_length=100)
    program = models.CharField(max_length=100)

    date = models.DateField()
    time = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.parent_name
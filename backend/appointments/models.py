from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now


class Appointment(models.Model):

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    parent_name = models.CharField(max_length=100)
    child_name = models.CharField(max_length=100)

    age = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=15)

    branch = models.CharField(max_length=100)
    program = models.CharField(max_length=100)

    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.parent_name} - {self.child_name}"



class Content(models.Model):
    page = models.CharField(max_length=50)   # home, about, programs
    section = models.CharField(max_length=50)  # hero, footer, cards

    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    image = models.ImageField(upload_to="content/", null=True, blank=True)

    data = models.JSONField(null=True, blank=True)  # for cards, lists

    def __str__(self):
        return f"{self.page} - {self.section}"
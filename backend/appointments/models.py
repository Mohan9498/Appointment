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

    date = models.CharField(max_length=20, blank=True, null=True)
    time = models.CharField(max_length=50, blank=True, null=True)

    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.parent_name} - {self.child_name}"



class Content(models.Model):
    PAGE_CHOICES = [
        ("home", "Home"),
        ("about", "About"),
        ("programs", "Programs"),
    ]

    page = models.CharField(max_length=50, choices=PAGE_CHOICES, db_index=True)
    section = models.CharField(max_length=100, db_index=True)

    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    # 🔥 dynamic cards
    data = models.JSONField(default=list, blank=True)

    # 🖼 image
    image = models.ImageField(upload_to="content/", blank=True, null=True)

    # 🔥 ordering (VERY IMPORTANT)
    order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-id"]

    def __str__(self):
        return f"{self.page} - {self.section}"
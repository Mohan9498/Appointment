from django.db import models

class Appointment(models.Model):

    name = models.CharField(max_length=100)
    email = models.EmailField()
    date = models.DateField()
    time = models.TimeField()
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name
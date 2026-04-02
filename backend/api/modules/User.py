from django.db import models

class User(models.Model):
    google_id = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    daily_generation_count = models.IntegerField(default=0)
    last_generation_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name
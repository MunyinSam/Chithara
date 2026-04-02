from django.db import models
from .User import User

class GenerationHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt_used = models.TextField()
    status = models.CharField(max_length=50, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    error_message = models.TextField(blank=True, null=True)
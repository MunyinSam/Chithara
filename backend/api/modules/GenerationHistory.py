from django.conf import settings
from django.db import models


class GenerationHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='generation_history'
    )
    song = models.OneToOneField(
        'api.Song', on_delete=models.SET_NULL, null=True, blank=True, related_name='generation'
    )
    suno_task_id = models.CharField(max_length=255, blank=True, null=True)
    prompt_used = models.TextField()
    style_used = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=50, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.status} ({self.created_at:%Y-%m-%d})"

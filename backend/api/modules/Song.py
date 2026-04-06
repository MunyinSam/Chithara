import uuid
from django.conf import settings
from django.db import models


class Song(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='songs'
    )

    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    prompt = models.TextField()
    vibe = models.CharField(max_length=100, blank=True, null=True)

    audio_file = models.FileField(upload_to='songs/')
    created_at = models.DateTimeField(auto_now_add=True)

    PRIVACY_CHOICES = [
        ('PRIVATE', 'Private'),
        ('PUBLIC', 'Public'),
    ]
    privacy_status = models.CharField(
        max_length=10,
        choices=PRIVACY_CHOICES,
        default='PRIVATE'
    )
    share_token = models.CharField(max_length=100, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.privacy_status == 'PUBLIC' and not self.share_token:
            self.share_token = uuid.uuid4().hex
        elif self.privacy_status == 'PRIVATE':
            self.share_token = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

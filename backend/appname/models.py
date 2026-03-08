from django.db import models

# Create your models here.

class User(models.Model):
    google_id = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    daily_generation_count = models.IntegerField(default=0)
    last_generation_date = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

class Song(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='songs')
    
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

    def __str__(self):
        return self.title

class GenerationHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt_used = models.TextField()
    status = models.CharField(max_length=50, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    error_message = models.TextField(blank=True, null=True)
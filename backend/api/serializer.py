from rest_framework import serializers
from .modules.User import User
from .modules.Song import Song
from .modules.GenerationHistory import GenerationHistory
from .modules.GenerationQuota import GenerationQuota


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'google_id', 'email', 'username', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            'id', 'owner', 'title', 'genre', 'prompt', 'vibe',
            'audio_file', 'created_at', 'privacy_status', 'share_token'
        ]
        read_only_fields = ['id', 'created_at', 'share_token']


class GenerationHistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model = GenerationHistory
        fields = ['id', 'user', 'song', 'suno_task_id', 'prompt_used', 'status', 'created_at', 'error_message']
        read_only_fields = ['id', 'created_at']


class GenerationQuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationQuota
        fields = ['id', 'user', 'date', 'count']
        read_only_fields = ['id']

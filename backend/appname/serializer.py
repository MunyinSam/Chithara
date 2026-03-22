from rest_framework import serializers
from .modules.User import User
from .modules.Song import Song
from .modules.GenerationHistory import GenerationHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'google_id', 'email', 'name', 'daily_generation_count', 'last_generation_date']
        read_only_fields = ['id', 'daily_generation_count', 'last_generation_date']

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            'id', 'owner', 'title', 'genre', 'prompt', 'vibe',
            'audio_file', 'created_at', 'privacy_status', 'share_token'
        ]
        read_only_fields = ['id', 'created_at', 'share_token']

class GenerationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationHistory
        fields = ['id', 'user', 'prompt_used', 'status', 'created_at', 'error_message']
        read_only_fields = ['id', 'created_at']
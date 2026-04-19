import re
from rest_framework import serializers
from .modules.User import User
from .modules.Song import Song
from .modules.GenerationHistory import GenerationHistory
from .modules.GenerationQuota import GenerationQuota


def _strip_control_chars(value: str) -> str:
    # Remove null bytes and ASCII control characters (except tab/newline)
    return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', value)


class GenerateSongSerializer(serializers.Serializer):
    prompt = serializers.CharField(max_length=400, trim_whitespace=True)
    style = serializers.CharField(max_length=120, trim_whitespace=True)
    title = serializers.CharField(max_length=80, trim_whitespace=True)
    instrumental = serializers.BooleanField(default=False, required=False)

    def validate_prompt(self, value):
        value = _strip_control_chars(value)
        if not value:
            raise serializers.ValidationError('Prompt cannot be empty.')
        return value

    def validate_style(self, value):
        value = _strip_control_chars(value)
        if not value:
            raise serializers.ValidationError('Style cannot be empty.')
        return value

    def validate_title(self, value):
        value = _strip_control_chars(value)
        if not value:
            raise serializers.ValidationError('Title cannot be empty.')
        return value


class GoogleAuthSerializer(serializers.Serializer):
    google_id = serializers.CharField(max_length=255, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    name = serializers.CharField(max_length=150, trim_whitespace=True, required=False, default='')

    def validate_google_id(self, value):
        return _strip_control_chars(value)

    def validate_name(self, value):
        return _strip_control_chars(value)


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

from rest_framework import serializers

from ..models.Song import Song


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = [
            'id', 'owner', 'title', 'genre', 'prompt', 'vibe',
            'audio_file', 'cover_image', 'created_at', 'privacy_status', 'share_token'
        ]
        read_only_fields = ['id', 'created_at', 'share_token']

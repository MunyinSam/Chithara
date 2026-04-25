from rest_framework import serializers

from ..models.GenerationHistory import GenerationHistory
from .SongSerializer import SongSerializer


class GenerationHistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    is_mock = serializers.SerializerMethodField()

    def get_is_mock(self, obj):
        from ..services.MockSunoService import MOCK_PREFIX
        return bool(obj.suno_task_id and obj.suno_task_id.startswith(MOCK_PREFIX))

    class Meta:
        model = GenerationHistory
        fields = ['id', 'user', 'song', 'suno_task_id', 'prompt_used', 'status', 'created_at', 'error_message', 'is_mock']
        read_only_fields = ['id', 'created_at']

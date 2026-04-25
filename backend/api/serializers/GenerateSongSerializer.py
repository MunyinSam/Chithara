from rest_framework import serializers

from ._utils import _strip_control_chars


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

from rest_framework import serializers

from ._utils import _strip_control_chars


class GoogleAuthSerializer(serializers.Serializer):
    google_id = serializers.CharField(max_length=255, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    name = serializers.CharField(max_length=150, trim_whitespace=True, required=False, default='')

    def validate_google_id(self, value):
        return _strip_control_chars(value)

    def validate_name(self, value):
        return _strip_control_chars(value)

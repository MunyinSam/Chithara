from rest_framework import serializers

from ..models.GenerationQuota import GenerationQuota


class GenerationQuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationQuota
        fields = ['id', 'user', 'date', 'count']
        read_only_fields = ['id']

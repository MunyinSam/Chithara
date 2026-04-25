from rest_framework import viewsets
from drf_spectacular.utils import extend_schema

from ..models.GenerationQuota import GenerationQuota
from ..serializers.GenerationQuotaSerializer import GenerationQuotaSerializer


@extend_schema(tags=['Generation Quota'])
class GenerationQuotaViewSet(viewsets.ModelViewSet):
    queryset = GenerationQuota.objects.all()
    serializer_class = GenerationQuotaSerializer

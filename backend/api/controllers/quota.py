from rest_framework import viewsets
from drf_spectacular.utils import extend_schema

from ..modules.GenerationQuota import GenerationQuota
from ..serializer import GenerationQuotaSerializer


@extend_schema(tags=['Generation Quota'])
class GenerationQuotaViewSet(viewsets.ModelViewSet):
    queryset = GenerationQuota.objects.all()
    serializer_class = GenerationQuotaSerializer

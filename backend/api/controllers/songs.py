from rest_framework import viewsets
from drf_spectacular.utils import extend_schema

from ..modules.Song import Song
from ..serializer import SongSerializer


@extend_schema(tags=['Songs'])
class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

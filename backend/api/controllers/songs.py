from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ..modules.Song import Song
from ..serializer import SongSerializer


@extend_schema(tags=['Songs'])
class SongViewSet(viewsets.ModelViewSet):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.filter(owner=self.request.user)

    def get_permissions(self):
        if self.action == 'public':
            return [AllowAny()]
        return super().get_permissions()

    @extend_schema(
        tags=['Songs'],
        responses={200: SongSerializer, 404: None},
        description='Fetch a public song by its share token. No authentication required.',
    )
    @action(detail=False, methods=['get'], url_path=r'public/(?P<token>[^/.]+)')
    def public(self, request, token=None):
        try:
            song = Song.objects.get(share_token=token, privacy_status='PUBLIC')
        except Song.DoesNotExist:
            return Response({'error': 'Song not found or not public'}, status=status.HTTP_404_NOT_FOUND)
        return Response(SongSerializer(song, context={'request': request}).data)

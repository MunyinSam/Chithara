from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ..modules.Song import Song
from ..serializer import SongSerializer


class SongPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema(tags=['Songs'])
class SongViewSet(viewsets.ModelViewSet):
    serializer_class = SongSerializer
    pagination_class = SongPagination

    def get_queryset(self):
        qs = Song.objects.filter(owner=self.request.user).order_by('-created_at')
        privacy = self.request.query_params.get('privacy_status')
        if privacy in ('PUBLIC', 'PRIVATE'):
            qs = qs.filter(privacy_status=privacy)
        return qs

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

from drf_spectacular.utils import extend_schema
from ratelimit.decorators import ratelimit
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from ..modules.User import User
from ..modules.Song import Song
from ..modules.GenerationHistory import GenerationHistory
from ..serializer import UserSerializer, GoogleAuthSerializer


@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        tags=['Users'],
        responses={200: {
            'type': 'object',
            'properties': {
                'total_songs':       {'type': 'integer'},
                'public_songs':      {'type': 'integer'},
                'total_generations': {'type': 'integer'},
            },
        }},
    )
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        user = self.get_object()
        return Response({
            'total_songs':       Song.objects.filter(owner=user).count(),
            'public_songs':      Song.objects.filter(owner=user, privacy_status='PUBLIC').count(),
            'total_generations': GenerationHistory.objects.filter(user=user).count(),
        })


@extend_schema(
    tags=['Users'],
    request={'application/json': {
        'type': 'object',
        'properties': {
            'google_id': {'type': 'string'},
            'email':     {'type': 'string'},
            'name':      {'type': 'string'},
        },
        'required': ['google_id', 'email'],
    }},
    responses={200: UserSerializer, 201: UserSerializer},
)
@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='20/h', method='POST')
def google_auth(request):
    if getattr(request, 'limited', False):
        return Response(
            {'error': 'Too many requests. Please slow down.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    serializer = GoogleAuthSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    google_id = serializer.validated_data['google_id']
    email = serializer.validated_data['email']
    name = serializer.validated_data['name']

    name_parts = name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    user, created = User.objects.get_or_create(
        google_id=google_id,
        defaults={
            'email': email,
            'username': email,
            'first_name': first_name,
            'last_name': last_name,
        },
    )

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            **UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )

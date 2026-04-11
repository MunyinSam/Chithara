from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .controllers.users import UserViewSet, google_auth
from .controllers.songs import SongViewSet
from .controllers.generation import GenerationHistoryViewSet, generate_song, generation_callback
from .controllers.quota import GenerationQuotaViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'songs', SongViewSet, basename='song')
router.register(r'history', GenerationHistoryViewSet, basename='generationhistory')
router.register(r'quota', GenerationQuotaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', google_auth, name='google-auth'),
    path('generate/', generate_song, name='generate-song'),
    path('generate/callback/', generation_callback, name='generation-callback'),
]

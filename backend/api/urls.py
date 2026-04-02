from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views  # This works because views.py is in the same folder

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'history', views.GenerationHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
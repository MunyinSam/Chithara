from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.schemas.openapi import AutoSchema
from .modules.User import User
from .modules.Song import Song
from .modules.GenerationHistory import GenerationHistory
from .serializer import UserSerializer, SongSerializer, GenerationHistorySerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD:
    - List: GET /api/users/
    - Create: POST /api/users/
    - Retrieve: GET /api/users/{id}/
    - Update: PUT /api/users/{id}/
    - Delete: DELETE /api/users/{id}/
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    schema = AutoSchema(tags=['Users'])
    # permission_classes = [IsAuthenticated] # Add Later

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    schema = AutoSchema(tags=['Songs'])

class GenerationHistoryViewSet(viewsets.ModelViewSet):
    queryset = GenerationHistory.objects.all()
    serializer_class = GenerationHistorySerializer
    schema = AutoSchema(tags=['Generation History'])
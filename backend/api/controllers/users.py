from rest_framework import viewsets
from drf_spectacular.utils import extend_schema

from ..modules.User import User
from ..serializer import UserSerializer


@extend_schema(tags=['Users'])
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

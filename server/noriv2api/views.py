import subprocess
import uuid
import os

from noriv2api.models import Scene, User
from noriv2api.serializers import SceneSerializer, UserSerializer
from rest_framework import generics, permissions
from noriv2api.permissions import IsOwnerOrReadOnly

from settings import RENDERER_DIR, RENDERER_DATA_DIR

# TODO improve
class SceneList(generics.ListCreateAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SceneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RenderView(APIView):
    """
    Renders an image and returns the path to a rendered image
    """
    def get(self, request, format=None):
        file_path = os.path.join(RENDERER_DATA_DIR, uuid.uuid4())+'.png'
        call([os.path.join(RENDERER_DIR, 'build/nori'), file_path, '0', '0'])

        return_object = {
                'url':
                }

        return Response(return_object)

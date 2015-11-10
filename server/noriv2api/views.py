import subprocess
import uuid
import os

from noriv2api.models import Scene, User
from noriv2api.serializers import SceneSerializer, UserSerializer
from rest_framework import generics, permissions, views
from noriv2api.permissions import IsOwnerOrReadOnly

from noriv2apiserver.settings import RENDERER_DIR, RENDERER_DATA_DIR

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

class RenderView(views.APIView):
    """
    Renders an image and returns the path to a rendered image
    """
    #authentication_classes = (authentication.TokenAuthentication,)
    #permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        input_file =  os.path.join(RENDERER_DATA_DIR, uuid.uuid4())+'.xml'
        request_json = json.loads(request.data)  # TODO: use serializer
        with open(input_file, 'w') as f:
            f.write(request_json['xmlData'])
        output_file = os.path.join(RENDERER_DATA_DIR, uuid.uuid4())+'.png'
        subprocess.call([os.path.join(RENDERER_DIR, 'build/nori'), input_file, '0', '0'])

        return_object = {
                'success': True,
                'url': output_file
        }

        return Response(return_object)

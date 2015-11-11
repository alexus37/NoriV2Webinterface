import subprocess
import uuid
import os

from models import Scene, User
from serializers import SceneSerializer, UserSerializer
from rest_framework import generics, permissions, views
from rest_framework.response import Response
from permissions import IsOwnerOrReadOnly
from noriv2apiserver.settings import RENDERER_DIR, RENDERER_DATA_DIR, STATIC_URL


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
    # authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_permissions(self):
        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

    def get(self, request, format=None):
        raw_file_path = os.path.join(RENDERER_DATA_DIR, str(uuid.uuid4()))
        input_file = raw_file_path + '.xml'
        output_file = raw_file_path + '.png'

        # import ipdb
        # ipdb.set_trace()
        print request.data
        with open(input_file, 'w') as f:
            f.write(request.data['xmlData'])
        subprocess.call([os.path.join(RENDERER_DIR, 'build/nori'), input_file, '0', '0', '1'])

        return_object = {
            'success': True,
            'url': output_file
        }

        return Response(return_object)

    def post(self, request, format=None):
        fileName = str(uuid.uuid4())
        raw_file_path = os.path.join(RENDERER_DATA_DIR, fileName)
        input_file = raw_file_path + '.xml'
        output_file = STATIC_URL + fileName + '.png'

        print os.path.join(RENDERER_DIR, 'build/nori')
        with open(input_file, 'w') as f:
            f.write(request.data['xmlData'])
        subprocess.call([os.path.join(RENDERER_DIR, 'build/nori'), input_file, '0', '0', '1'], stderr=subprocess.STDOUT)

        return_object = {
            'success': True,
            'url': output_file
        }

        return Response(return_object)


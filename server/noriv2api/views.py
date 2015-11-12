import subprocess
import uuid
import os
import json
import logging

from noriv2api.models import Scene, User
from noriv2api.serializers import SceneSerializer, UserSerializer
from rest_framework import generics, permissions, views, response
from noriv2api.permissions import IsOwnerOrReadOnly
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
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def post(self, request, format=None):
        raw_file_path =  os.path.join(RENDERER_DATA_DIR, str(uuid.uuid4()))
        input_file = raw_file_path + '.xml'
        output_file = raw_file_path + '.png'

        with open(input_file, 'w') as f:
            f.write(request.data['xmlData'])
        subprocess.call([os.path.join(RENDERER_DIR, 'build/nori'), input_file, '0', '0', '1'])

        return_object = {
            'success': True,
            'url': output_file
        }
        # TODO: delete xml

        return response.Response(return_object)

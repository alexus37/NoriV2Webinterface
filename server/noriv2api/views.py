import subprocess
import uuid
import os
import pathlib

from rest_framework.parsers import FileUploadParser
from rest_framework import generics, permissions, views, response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, \
                                       IsAuthenticated

from noriv2api.models import Scene, User
from noriv2api.serializers import SceneSerializer, UserSerializer
from noriv2api.permissions import IsAuthenticatedOrCreateOnly, IsOwnerOrReadOnly
from noriv2apiserver.settings import RENDERER_DIR, RENDERER_DATA_DIR


# TODO improve
class SceneList(generics.ListCreateAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SceneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticatedOrCreateOnly, )


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = (IsAuthenticated, )


class UserResourceView(views.APIView):
    permission_classes = (IsAuthenticated, )
    parser_classes = (FileUploadParser,)

    def put(self, request, pk, format=None):
        # check if pk matches request.user in permission_classes TODO
        file_obj = request.FILES['file']
        user_directory = os.path.join(RENDERER_DATA_DIR, request.user.username)
        if not os.path.exists(user_directory):
            os.makedirs(user_directory)


        file_path = os.path.join(user_directory, file_obj.name)

        path = pathlib.Path(file_path)
        if path.is_file():
            return response.Response(status=409)
        else:
            path.write_bytes(file_obj.read())
            return response.Response(status=201)

    def get(self, request, pk):
        path = pathlib.Path(os.path.join(RENDERER_DATA_DIR, request.user.username))
        if path.is_dir():
            return response.Response([d.name for d in path.iterdir() if d.is_file()])
        else:
            return response.Response([])


class RenderView(views.APIView):
    """
    Renders an image and returns the path to a rendered image
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def post(self, request, format=None):
        raw_file_path = os.path.join(RENDERER_DATA_DIR, str(uuid.uuid4()))
        input_file = raw_file_path + '.xml'
        output_file = raw_file_path + '.png'

        with open(input_file, 'w') as f:
            f.write(request.data['xmlData'])
        subprocess.call(
            [os.path.join(RENDERER_DIR, 'build/nori'),
             input_file, '0', '0', '1'])

        return_object = {
            'success': True,
            'url': output_file
        }
        # TODO: delete xml

        return response.Response(return_object)

import uuid
import os
import pathlib
import shutil 

from django.http import HttpResponse
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import generics, permissions, views, response  # , filters
from rest_framework.permissions import IsAuthenticated
import requests

from noriv2api.models import Scene, User
from noriv2api.serializers import SceneSerializer, UserSerializer
from noriv2api.permissions import IsOwner, IsAuthenticatedOrCreateOnly
from noriv2apiserver.settings import RENDERER_DATA_DIR, STATIC_URL
from noriv2api.tasks import render_image


class SceneList(generics.ListCreateAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (IsAuthenticated, )
    # filter_backends = (filters.DjangoObjectPermissionsFilter) # TODO do this

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SceneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer
    permission_classes = (IsOwner, )


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
    parser_classes = (FormParser, MultiPartParser,)

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
        path = pathlib.Path(
            os.path.join(RENDERER_DATA_DIR, request.user.username))
        if path.is_dir():
            return response.Response(
                [d.name for d in path.iterdir()
                 if d.is_file() and d.suffix == '.obj'])
        else:
            return response.Response([])
    
class DefaultGeometryView(views.APIView):
    """
    Moves a default geometry to the user directoy
    """
    
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def post(self, request, format=None):
        
        src = os.path.join(RENDERER_DATA_DIR, "default", request.data["type"] + ".obj")
        path = pathlib.Path(src)
        if path.is_file():
            dst = os.path.join(RENDERER_DATA_DIR, request.user.username, request.data["type"] + ".obj")
            pathUser= pathlib.Path(dst)

            if not pathUser.is_file():
                # copy the file to the user directoy
                shutil.copyfile(src, dst)
                return response.Response(status=201)
            else:
                return response.Response(status=200)
        else:
            return response.Response(status=400)

class ExampleSceneView(views.APIView):
    """
    Load a example scene and copy all used geometry to the user directoy
    """
    
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, format=None):
        example_type = request.GET.get('type', '')
        scene_src = os.path.join(RENDERER_DATA_DIR, "examples", example_type + ".xml")
        path = pathlib.Path(scene_src)
        if path.is_file():
            example_obj_files = []
            if example_type == "simple":
                # copy sphere and plane
                example_obj_files.append("plane")
                example_obj_files.append("sphere")
                example_obj_files.append("torus")
            if example_type == "teapot":
                # copy sphere and plane
                example_obj_files.append("teapot")
                example_obj_files.append("bigPlane")
                example_obj_files.append("plane")
            if example_type == "cornell":
                example_obj_files.append("walls")
                example_obj_files.append("sphere2")
                example_obj_files.append("sphere1")
                example_obj_files.append("rightwall")
                example_obj_files.append("leftwall")
                example_obj_files.append("light")
            if example_type == "dragons":
                example_obj_files.append("bigPlane")
                example_obj_files.append("dragonSmall")
                

            for f in example_obj_files:                
                src = os.path.join(RENDERER_DATA_DIR, "default", f + ".obj")
                dst = os.path.join(RENDERER_DATA_DIR, request.user.username, f + ".obj")
                
                pathUser= pathlib.Path(dst)
                if not pathUser.is_file():
                    # copy the file to the user directoy
                    shutil.copyfile(src, dst)
            
            example_file = open(scene_src, 'r')

            return response.Response({'content': example_file.read()})
 
        else:
            return response.Response(status=400)
        

class RenderView(views.APIView):
    """
    Renders an image and returns the path to a rendered image
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def post(self, request, format=None):
        # save xml scene in user directory ToDo
        file_name = str(uuid.uuid4())
        raw_file_path = os.path.join(RENDERER_DATA_DIR,
                                     request.user.username,
                                     file_name)
        input_file = raw_file_path + '.xml'
        output_file = os.path.join(STATIC_URL,
                                   request.user.username,
                                   file_name + '.png')

        with open(input_file, 'w') as f:
            f.write(request.data['xmlData'])

        task = render_image.delay(input_file, output_file, self.request.user.id)
        TID = 0
        # dont get the ID if it is a test
        if 'test' not in request.data:
            TID = task.id
        return_object = {
            'url': output_file,
            'channelname': request.user.username,
            'percentage': 0,
            'finished': False,
            'taskId': TID
        }

        return response.Response(return_object)


def get_settings(request):
    result = requests.get('http://localhost:9999/settings.js')
    resp = HttpResponse(result.text)
    resp['Etag'] = result.headers['Etag']
    resp['Content-Type'] = result.headers['Content-Type']
    return resp

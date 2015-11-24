from django import contrib
from rest_framework.authentication import BasicAuthentication, \
                                          SessionAuthentication
from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from noriv2api.serializers import UserSerializer


class AuthenticateView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated, )

    def get(self, request, format=None):
        if not request.user: # Seems like request.backend is only set when the user is logged in first
            try:
                contrib.auth.login(request, request.user)
            except AttributeError:
                raise
                # for a strange reason
                #  return Response(status=status.HTTP_401_UNAUTHORIZED) # TODO:
                #  something is wrong here

        # what is request.auth?
        content = {
            'user': UserSerializer(request.user,
                                   context={'request': request}).data,
            'auth': request.auth,
        }
        return Response(content)

from django import contrib

from rest_framework.authentication import BasicAuthentication, \
                                          SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class AuthenticateView(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        try:
            contrib.auth.login(request, request.user)
        except AttributeError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        content = {
            'user': request.user.username,
            'auth': request.auth,
        }
        return Response(content)

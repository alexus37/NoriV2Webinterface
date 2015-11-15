from django.contrib.auth import login

from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginBasicAuthentication(BasicAuthentication):

    def authenticate(self, request):
        user, _ = super(LoginBasicAuthentication, self).authenticate(request)
        login(request, user)
        return user, _


class AuthenticateView(APIView):
    authentication_classes = (SessionAuthentication, LoginBasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        content = {
            'user': unicode(request.user),
            'auth': unicode(request.auth),
        }
        return Response(content)

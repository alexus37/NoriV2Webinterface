import base64

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2api.models import User  # TODO: move to project level..


class AuthenticationTest(APITestCase):
    def setUp(self):
        self.user_dict = {
                'username': 'jacob',
                'email': 'jacob@web.de',
                'password': 'top_secret'
                }
        self.user = User.objects.create_user(**self.user_dict)

    def test_api_authentication_fail(self):
        url = reverse('user-authenticate')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



    def test_api_authentication(self):
        url = reverse('user-authenticate')
        encoded_login = base64.b64encode(
            '{}:{}'.format(
                self.user_dict['username'],
                self.user_dict['password']))
        self.client.credentials('Authorization: Basic {}'.format(encoded_login))
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user_dict['username'])

        # now test if login persists (with session auth only)

        self.client.credentials()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user_dict['username'])

import base64
import copy

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2api.models import User, Scene  # TODO: move to project level..


class AuthenticationTest(APITestCase):
    def setUp(self):
        self.user_dict = {
                'username': 'jacob',
                'email': 'jacob@web.de',
                'password': 'top_secret'
                }
        self.user = User.objects.create_user(**self.user_dict)

        self.scene_dict = {
            'title': 'myscene',
            'content': '<xml>uiae</xml>',
            'owner': self.user
        }
        self.scene = Scene.objects.create(**self.scene_dict)

    def test_api_authentication_fail(self):
        url = reverse('user-authenticate')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_api_basic_authentication(self):
        url = reverse('user-authenticate')
        encoded_login = base64.b64encode(
            '{}:{}'.format(
                self.user_dict['username'],
                self.user_dict['password']).encode('ISO-8859-1'))
        self.client.credentials(HTTP_AUTHORIZATION=b'Basic ' + encoded_login)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_session_authentication(self):
        self.client.login(username=self.user_dict['username'],
                          password=self.user_dict['password'])
        url = reverse('user-authenticate')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_authentication_response(self):
        self.client.login(username=self.user_dict['username'],
                          password=self.user_dict['password'])
        url = reverse('user-authenticate')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_user_data = copy.copy(self.user_dict)
        expected_user_data['url'] = 'http://testserver{}'.format(
            reverse('user-detail', kwargs={'pk': self.user.id}))
        del expected_user_data['password']
        scene_url = reverse('scene-detail', kwargs={'pk': self.scene.id})
        expected_user_data['user_scenes'] = ['http://testserver' + scene_url]
        self.assertDictContainsSubset(expected_user_data, response.data['user'])

        # check auth?

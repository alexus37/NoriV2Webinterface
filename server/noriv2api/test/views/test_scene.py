from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2api.models import User, Scene


class SceneTest(APITestCase):

    def setUp(self):
        self.user_dict = {
                'username': 'jacob',
                'email': 'jacob@web.de',
                'password': 'top_secret'
                }
        self.user = User.objects.create_user(**self.user_dict)

        self.scene_dict = {
            'title': 'main scene',
            'content': '<xml></xml>',
            'owner': self.user
        }

        self.scene = Scene(**self.scene_dict)
        self.scene.save()

    def tearDown(self):
        pass

    def test_get_scene(self):
        self.client.force_authenticate(self.user)
        url = reverse('scene-detail', kwargs={'pk': self.scene.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(dict(response.data),
                         {'url': 'http://testserver/scenes/{}'.
                          format(self.scene.id),
                          'title': self.scene_dict['title'],
                          'content': self.scene_dict['content'],
                          'owner': self.user.username})

    def test_get_scenes(self):
        self.client.force_authenticate(self.user)
        url = reverse('scene-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([dict(d) for d in response.data],
                         [{'url': 'http://testserver/scenes/{}'.
                           format(self.scene.id),
                           'title': self.scene_dict['title'],
                           'content': self.scene_dict['content'],
                           'owner': self.user.username}])

    def test_get_scenes_unauthenticated(self):
        url = reverse('scene-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_scene_unauthenticated(self):
        url = reverse('scene-detail', kwargs={'pk': self.scene.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_scene_unathorized(self):
        scene_dict = {
            'title': 'other scene',
            'content': '<xml></xml>',
            'owner': self.user.username
                }
        url = reverse('scene-list')
        response = self.client.post(url, scene_dict, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_create_scene(self):
        self.client.force_authenticate(self.user)
        scene_dict = {
            'title': 'other scene',
            'content': '<xml></xml>',
            'owner': self.user.username
                }
        url = reverse('scene-list')
        response = self.client.post(url, scene_dict, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Scene.objects.filter(pk=response.data['url'][-1]).
            first().title, scene_dict['title'])


    # TODO make tests that you just see your own scenes and can only change and
    # edit your own scenes and create scene only possible as authorized

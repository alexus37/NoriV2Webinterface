import pathlib
# from rest_framework.test import APIRequestFactory
from django.test.client import encode_multipart
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2api.models import User, Scene

from noriv2apiserver import settings

class UserTest(APITestCase):

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

        pathlib.Path(settings.RENDERER_DATA_DIR, self.user.username).mkdir()

        self.test_file = pathlib.Path(settings.RENDERER_DATA_DIR, self.user.username, 'testfile.obj')
        self.test_file.touch()
        self.test_file2 = pathlib.Path(settings.RENDERER_DATA_DIR, self.user.username, 'testfile2.obj')


    def tearDown(self):
        self.test_file.unlink()
        try:
            self.test_file2.unlink()
        except FileNotFoundError:
            pass
        pathlib.Path(settings.RENDERER_DATA_DIR, self.user.username).rmdir()



    def test_get_user(self):
        self.client.force_authenticate(self.user)
        url = reverse('user-detail', kwargs={'pk': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data.pop('password', None), '')
        self.assertEqual(dict(response.data),
                         {'url': 'http://testserver/users/{}/'.format(self.user.id),
                          'username': 'jacob',
                          'email': 'jacob@web.de',
                          'user_scenes': ['http://testserver/scenes/{}'.format(self.scene.id)]})

    def test_get_user_unauthenticated(self):
        url = reverse('user-detail', kwargs={'pk': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_users(self):
        self.client.force_authenticate(self.user)
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([dict(u) for u in response.data if not u.pop('password', None)],
                         [{'url': 'http://testserver/users/1/',
                           'username': 'jacob',
                           'email': 'jacob@web.de',
                           'user_scenes': ['http://testserver/scenes/{}'.format(self.scene.id)]}])

    def test_get_users_unauthenticated(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_user(self):
        user_dict = {
            'username': 'marco',
            'email': 'marco@marco.de',
            'password': 'hardhard'
        }
        url = reverse('user-list')
        response = self.client.post(url, user_dict, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            User.objects.filter(username=user_dict['username']).
            first().email, user_dict['email'])

        self.assertTrue(
            User.objects.filter(username=user_dict['username']).first(). \
            check_password(user_dict['password']))

    def test_upload(self):
        self.client.force_authenticate(self.user)
        url = reverse('user-resource', kwargs={'pk': self.user.pk})
        file_name = 'testfile2.obj'
        test = pathlib.Path(settings.RENDERER_DATA_DIR,  file_name)
        test.touch()

        f = open(str(test.resolve()), 'w+')
        content = encode_multipart('BoUnDaRyStRiNg',  {'file': f})
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        response = self.client.put(url, data=content, content_type=content_type)
        f.close()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        result = pathlib.Path(settings.RENDERER_DATA_DIR, self.user.username, file_name)
        self.assertTrue(result.is_file())
        self.assertEqual(result.name, file_name)

        test.unlink()
        if result.is_file():
            result.unlink()

    def test_existing_upload_fail(self):
        # put testfile1 filename
        self.client.force_authenticate(self.user)
        url = reverse('user-resource', kwargs={'pk': self.user.pk})

        f = open(str(self.test_file.resolve()), 'w+')
        content = encode_multipart('BoUnDaRyStRiNg',  {'file': f})
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        response = self.client.put(url, data=content, content_type=content_type)
        f.close()

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_upload_unauthenticated(self):
        url = reverse('user-resource', kwargs={'pk': self.user.pk})
        f = open(str(self.test_file.resolve()), 'w+')
        content = encode_multipart('BoUnDaRyStRiNg',  {'file': f})
        content_type = 'multipart/form-data; boundary=BoUnDaRyStRiNg'
        response = self.client.put(url, data=content, content_type=content_type)
        f.close()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # def test_upload_wrong_user(self): # TODO
    #     url = reverse('user-resource', kwargs={'pk': self.user.pk+1})
    #     file_string = b'uiae\naa'
    #     self.client.credentials(HTTP_CONTENT_DISPOSITION='attachment; filename={}'.format(self.test_file2.name))
    #     response = self.client.put(url, data=file_string, content_type='application/octet-stream')
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_files(self):
        self.client.force_authenticate(self.user)
        url = reverse('user-resource', kwargs={'pk': self.user.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.test_file.name, response.data)

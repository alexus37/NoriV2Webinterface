from unittest import mock
import re
import os

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2apiserver.settings import RENDERER_DATA_DIR, STATIC_URL
from noriv2api.models import User
from noriv2api import views


render_image_mock = mock.MagicMock()
render_image_mock.__getitem__.return_value = 0
file_mock = mock.mock_open()
#os_remove_mock = mock.MagicMock()


class RenderTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jacob', email='jacob@web.de', password='top_secret')

    @mock.patch('noriv2api.tasks.render_image.delay', render_image_mock)
    @mock.patch('{}.open'.format(views.__name__), file_mock, create=True)
    #@mock.patch('os.remove', os_remove_mock)
    def test_render_success(self):
        url = reverse('render')
        data = {'xmlData': '', 'test': 1}

        self.client.force_authenticate(self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['finished'], False)

        file_uuid = re.search('([^/]*).png', response.data['url']).groups()[0]
        raw_file_path = os.path.join(RENDERER_DATA_DIR,
                                     self.user.username,
                                     file_uuid)
        input_file = raw_file_path + '.xml'
        output_file = os.path.join(STATIC_URL,
                                   self.user.username,
                                   file_uuid + '.png')

        render_image_mock.assert_called_once_with(input_file,
                                                  output_file,
                                                  self.user.id)

        # check that renderer was called with correct arguments
        # subprocess_call_mock.assert_called_with( # TODO write test for tasks
        #     [os.path.join(RENDERER_DIR, 'build/nori'),
        #      input_file,
        #      '0',
        #      '0',
        #      '1'])

        # check that xml file was created and written
        file_mock.assert_called_once_with(input_file, 'w')
        file_mock.return_value.write.assert_called_once_with(data['xmlData'])

        # check that file doesn't exist anymore
        # self.assertFalse(pathlib.Path(input_file).exists())
        #os_remove_mock.assert_called_once_with(input_file)

    # test unauthenticated fail.
    def test_render_not_authenticated(self):
        url = reverse('render')
        data = {'xmlData': ''}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'],
                         'Authentication credentials were not provided.')

    # test without xmlData # TODO improve
    # @mock.patch('subprocess.call', subprocess_call_mock)
    # def test_render_failure(self):
    #
    #     # check that renderer fails without xml data
    #     subprocess_call_mock.failUnless(
    #         [os.path.join(RENDERER_DIR, 'build/nori')])

from unittest import mock
import re
import os

from rest_framework.test import APIRequestFactory
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from noriv2apiserver.settings import RENDERER_DIR, RENDERER_DATA_DIR
from noriv2api.models import User


subprocess_call_mock = mock.Mock()


class RenderTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='jacob', email='jacob@web.de', password='top_secret')

    @mock.patch('subprocess.call', subprocess_call_mock)
    def test_render_success(self):
        url = reverse('render')
        data = {'xmlData': ''}

        self.client.force_authenticate(self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK) # change to 200?
        self.assertEqual(response.data['success'], True)

        file_uuid = re.search('([^/]*).png', response.data['url']).groups()[0]
        raw_file_path = os.path.join(RENDERER_DATA_DIR, file_uuid)
        input_file = raw_file_path + '.xml'

        # check that renderer was called with correct arguments
        subprocess_call_mock.assert_called_with([os.path.join(RENDERER_DIR, 'build/nori'), input_file, '0', '0', '1'])

    # test unauthenticated fail.
    def test_render_not_authenticated(self):
        url = reverse('render')
        data = {'xmlData': ''}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')

    # test without xmlData
    @mock.patch('subprocess.call', subprocess_call_mock)
    def test_render_failure(self):

        # check that renderer fails without xml data
        subprocess_call_mock.failUnless([os.path.join(RENDERER_DIR, 'build/nori')])



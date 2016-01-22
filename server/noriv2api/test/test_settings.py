from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class SettingsTest(APITestCase):
    def test_get_settings(self):
        url = reverse('settings')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

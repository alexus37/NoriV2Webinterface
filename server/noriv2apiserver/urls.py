"""noriv2apiserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""

from django.conf.urls import include, url, patterns
from django.contrib import admin
from noriv2apiserver import settings, auth


urlpatterns = [
    url(r'^', include('noriv2api.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^authenticate/$',
        auth.AuthenticateView.as_view(), name='user-authenticate'),
]

if settings.DEBUG:

    urlpatterns += url(
        r'^$', 'django.views.static.serve', kwargs={
            'path': 'index.html', 'document_root': settings.FRONTEND_DIR}),

    # WORKAROUND, not very clean..
    urlpatterns += patterns('',
             (r'^(?P<path>[^/]+/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.png)$',
              'django.views.static.serve',
              {'document_root': settings.RENDERER_DATA_DIR}))

    urlpatterns += patterns('',
             (r'^(?P<path>.*)$',
              'django.views.static.serve',
              {'document_root': settings.FRONTEND_DIR}))


    urlpatterns.extend([
        url(r'^api-auth/', include('rest_framework.urls',
                                   namespace='rest_framework'))])

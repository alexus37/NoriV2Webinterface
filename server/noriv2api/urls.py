from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from noriv2api import views
from django.views.generic import RedirectView

urlpatterns = [
    url(r'^users/$', views.UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$',
        views.UserDetail.as_view(), name='user-detail'),
    url(r'^users/(?P<pk>[0-9]+)/resource$',
        views.UserResourceView.as_view(), name='user-resource'),
    url(r'^scenes/$',
        views.SceneList.as_view(), name='scene-list'),
    url(r'^scenes/(?P<pk>[0-9]+)$',
        views.SceneDetail.as_view(), name='scene-detail'),
    url(r'^render/$',
        views.RenderView.as_view(), name='render'),
    url(r'^celery/settings.js$', 
        RedirectView.as_view(url='http://localhost:9999/settings.js'), name='celery'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

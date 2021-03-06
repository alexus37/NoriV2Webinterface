from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from noriv2api import views

urlpatterns = [
    url(r'^users/$', views.UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$',
        views.UserDetail.as_view(), name='user-detail'),
    url(r'^users/(?P<pk>[0-9]+)/resource$',
        views.UserResourceView.as_view(), name='user-resource'),
    url(r'^defaultgeometry/$',
        views.DefaultGeometryView.as_view(), name='default-geometry'),
    url(r'^scenes/$',
        views.SceneList.as_view(), name='scene-list'),
    url(r'^scenes/(?P<pk>[0-9]+)$',
        views.SceneDetail.as_view(), name='scene-detail'),
    url(r'^render/$',
        views.RenderView.as_view(), name='render'),
    url(r'^examples/$',
        views.ExampleSceneView.as_view(), name='render examples'),
    url(r'^celery/settings.js$',
        views.get_settings, name='settings'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

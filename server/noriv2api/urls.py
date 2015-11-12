from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from noriv2api import views

urlpatterns = [
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^scenes/$', views.SceneList.as_view()),
    url(r'^scenes/(?P<pk>[0-9]+)$', views.SceneDetail.as_view()),
    url(r'^render/$', views.RenderView.as_view(), name='render'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

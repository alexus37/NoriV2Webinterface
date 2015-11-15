from rest_framework import serializers
from noriv2api.models import User, Scene


class SceneSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Scene
        fields = ('title', 'content', 'owner')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    user_scenes = serializers.HyperlinkedRelatedField(queryset=Scene.objects.all(), view_name='scene-detail', many=True, required=False)

    class Meta:
        # model = settings.AUTH_USER_MODEL
        model = User
        fields = ('url', 'username', 'email', 'user_scenes')

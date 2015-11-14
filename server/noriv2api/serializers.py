from rest_framework import serializers
from noriv2api.models import User, Scene
from noriv2apiserver import settings


class SceneSerializer(serializers.HyperlinkedModelSerializer):
    # scenes = serializers.PrimaryKeyRelatedField(many=True, queryset=Scene.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Scene
        fields = ('title', 'content', 'owner')  # TODO: owner should be another field?


class UserSerializer(serializers.HyperlinkedModelSerializer):
    scenes = serializers.PrimaryKeyRelatedField(many=True, queryset=Scene.objects.all())

    class Meta:
        # model = settings.AUTH_USER_MODEL
        model = User
        fields = ('url', 'username', 'email')

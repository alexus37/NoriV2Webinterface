from rest_framework import serializers
from noriv2api.models import User, Scene


class SceneSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.HyperlinkedRelatedField(queryset=User.objects.all(), view_name='user-detail', required=True, many=False)

    class Meta:
        model = Scene
        fields = ('url', 'title', 'content', 'owner')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    user_scenes = serializers.HyperlinkedRelatedField(queryset=Scene.objects.all(), view_name='scene-detail', many=True, required=False)

    class Meta:
        # model = settings.AUTH_USER_MODEL
        model = User
        fields = ('url', 'username', 'email', 'user_scenes', 'password')
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)

    def create(self, validated_data):
        user = User()
        user.set_password(validated_data['password'])
        validated_data['password'] = user.password
        return super(UserSerializer, self).create(validated_data)

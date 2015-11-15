from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class User(AbstractUser):
    pass
    # followers = models.ManyToManyField('self', related_name='followees',
    # symmetrical=False)


class Scene(models.Model):
    title = models.CharField(max_length=40)
    content = models.TextField()
    owner = models.ForeignKey(User, related_name='user_scenes')
    # created_at
    # updated_at

from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class Profile(models.Model):

	# create the 1to1 rel: the user for this profile is a one to one relationship with the users model
	# on_delete= mod... means that if the user is deleted, also delete the profile but not the other way around
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	# a user has an image which is saved in profile_pics
	image = models.ImageField(default='default.png', upload_to='profile_pics')

	def __str__(self):
		return self.user.username + "'s Profile"






from django.db import models
from django.contrib.auth.models import User

from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.


class Profile(models.Model):

	# create the 1to1 rel: the user for this profile is a one to one relationship with the users model
	# on_delete= mod... means that if the user is deleted, also delete the profile but not the other way around
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	# a user has an image which is saved in profile_pics
	image = models.ImageField(default='default.png', upload_to='profile_pics')

	gender_choices = ( 
    			("male", "Male"), 
    			("female", "Female"), 
	) 

	activity_level_choices = (
				("couch_potato", "Couch potato"),
				("lightly_active", "Lightly active"),
				("moderately_active", "Moderately active"),
				("pretty_active", "Pretty active"),
				("active_is_your_middle_name", "Active is your middle name"),
	)

	units_choices = (
				("kg", "kg"),
				("lbs", "lbs"),
	)

	goal_choices = (
				("lose_weight", "Lose weight"),
				("maintain_weight", "Maintain weight"),
				("gain_weight", "Gain weight"),
	)

	weight = models.FloatField(default=-1, validators=[MinValueValidator(0), MaxValueValidator(1000)])
	age = models.IntegerField(default=-1, validators=[MinValueValidator(0), MaxValueValidator(100)])

	preferred_units = models.CharField(
		default="kg",
		choices=units_choices,
		max_length = 3,
		)

	goal = models.CharField(
		choices=goal_choices,
		default="lose_weight",
		max_length=16,
		)

	gender = models.CharField(
		max_length=6,
		choices=gender_choices,
		default="male"
		)
	activity_level = models.CharField(
		max_length=27,
		choices=activity_level_choices,
		default="low"
		)

	# number_of_meals = models.IntegerField(default=3, validators=[MinValueValidator(2), MaxValueValidator(8)])
	# number_of_snacks = models.IntegerField(default=1, validators=[MinValueValidator[0], MaxValueValidator[20]])



	def __str__(self):
		return self.user.username + "'s Profile"






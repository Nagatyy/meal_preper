from django.db import models
from django.contrib.auth.models import User
from meal_plan.models import MealPlan

from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.

class Profile(models.Model):

	# create the 1to1 rel: the user for this profile is a one to one relationship with the users model
	# on_delete= mod... means that if the user is deleted, also delete the profile but not the other way around
	user = models.OneToOneField(User, on_delete=models.CASCADE)

	gender_choices = ( 
    			("male", "Male"), 
    			("female", "Female"), 
	) 

	activity_level_choices = (
				("couch_potato", "Couch potato"),
				("lightly_active", "Lightly active"),
				("moderately_active", "Moderately active"),
				("pretty_active", "Pretty active"),
				("extremely_active", "Extremely active"),
	)

	units_choices = (
				("kg", "kg"),
				("lbs", "lbs"),
	)

	height_choices = (
				("cm", "cm"),
	)

	goal_choices = (
				("lose_weight", "Lose weight"),
				("maintain_weight", "Maintain weight"),
				("gain_weight", "Gain weight"),
	)

	weight = models.FloatField(default=-1, validators=[MinValueValidator(30), MaxValueValidator(1000)])
	age = models.IntegerField(default=-1, validators=[MinValueValidator(1), MaxValueValidator(100)])
	height = models.IntegerField(default=-1, validators=[MinValueValidator(0), MaxValueValidator(300)])

	preferred_units = models.CharField(
		default="kg",
		choices=units_choices,
		max_length = 3,
		)

	preferred_height_units = models.CharField(
		default="cm",
		choices=height_choices,
		max_length = 2,
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

	is_new_user = models.BooleanField(default = True)	# true for new users

	def update_new_user(self):
		self.is_new_user = False
		self.save()


	def __str__(self):
		return self.user.username + "'s Profile"


class MealsProfile(models.Model):


	user = models.OneToOneField(User, on_delete=models.CASCADE)

	carbs_percent = models.IntegerField(default = 40, validators=[MinValueValidator(0), MaxValueValidator(100)])
	protein_percent = models.IntegerField(default = 30, validators=[MinValueValidator(0), MaxValueValidator(100)])
	fat_percent = models.IntegerField(default = 30, validators=[MinValueValidator(0), MaxValueValidator(100)])



	num_of_meals = models.IntegerField(default=3, validators=[MinValueValidator(2), MaxValueValidator(6)])
	num_of_snacks = models.IntegerField(default=1, validators=[MinValueValidator(0), MaxValueValidator(6)])


	@property
	def calculated_calories(self):

		gender_adder = 5 if self.user.profile.gender == "male" else -161
		lbs_multiplier = 1 if self.user.profile.preferred_units == "kg" else 2.25

		rec_cals = (10 * self.user.profile.weight / lbs_multiplier) + (6.25 * self.user.profile.height) - (5 * self.user.profile.age) + gender_adder

		if self.user.profile.activity_level == "couch_potato":
			if self.user.profile.gender == "female":
				rec_cals *= 1.2
			else:
				rec_cals *= 1.3
		elif self.user.profile.activity_level == "lightly_active":
			if self.user.profile.gender == "female":
				rec_cals *= 1.3
			else:
				rec_cals *= 1.4
		elif self.user.profile.activity_level == "moderately_active":
			if self.user.profile.gender == "female":
				rec_cals *= 1.4
			else:
				rec_cals *= 1.5
		elif self.user.profile.activity_level == "pretty_active":
			if self.user.profile.gender == "female":
				rec_cals *= 1.5
			else:
				rec_cals *= 1.6
		elif self.user.profile.activity_level == "extremely_active":
			if self.user.profile.gender == "female":
				rec_cals *= 1.6
			else:
				rec_cals *= 1.7


		if self.user.profile.goal == "lose_weight":
			rec_cals -= 500
		elif self.user.profile.goal == "gain_weight":
			rec_cals += 400

		if int(round(rec_cals, -1)) < 800:
			return 800
		elif int(round(rec_cals, -1)) > 10000:
			return 10000

		return int(round(rec_cals, -1))

	@property
	def calculated_meals(self):
		if self.calculated_calories >= 3250:
			return 5
		elif self.calculated_calories >= 2500:
			return 4
		elif self.calculated_calories <= 900:
			return 2
		else:
			return 3

	@property
	def calculated_snacks(self):
		if self.calculated_calories >= 3250:
			return 4
		elif self.calculated_calories >= 2500:
			return 3
		elif self.calculated_calories <= 900:
			return 1
		else:
			return 2

	calories = models.IntegerField(default = 2000, validators=[MinValueValidator(600), MaxValueValidator(10000)])

	def __str__(self):
		return self.user.username + "'s MealsProfile"


class Meals(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	user_meal_plan = models.TextField(default = "{}")
	user_saved_meals = models.TextField(default = "{}")
	user_num_of_saved_meals = models.IntegerField(default = 0, validators=[MinValueValidator(0), MaxValueValidator(100)])

	def __str__(self):
		return self.user.username + "'s meals"

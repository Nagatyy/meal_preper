from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Meal(models.Model):

	caloric_value = models.IntegerField(default=-1)
	grams_of_fat = models.IntegerField(default=-1)
	grams_of_protien = models.IntegerField(default=-1)
	grams_of_carbs = models.IntegerField(default=-1)

	title = models.CharField(default="Meal 1", max_length=6)

	cooking_time = 0
	ingredients_list = []
	servings = 0
	sourceUrl = ""
	imageUrl = ""
	meal_id = 0



	def __str__(self):
		return self.title + "'s Info"

class MealPlan(models.Model):

	# each user has 1 meal plan
	# user = models.OneToOneField(User, on_delete=models.CASCADE)
	# a meal plan is a list of 3 meals
	meals = [Meal() for i in range(3)]



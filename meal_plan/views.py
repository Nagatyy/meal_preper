from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import datetime
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import QueryDict
import json
from django.http import JsonResponse
import requests
import os


# Create your views here.

@login_required
def meal_plan_view(request):

	today = datetime.date.today()
	x = today.strftime('%A %d')
	context = {
		'num_of_meals': request.user.mealsprofile.num_of_meals,
		'r_num_of_meals': range(request.user.mealsprofile.num_of_meals),
		'num_of_snacks': request.user.mealsprofile.num_of_snacks,
		'r_num_of_snacks': range(request.user.mealsprofile.num_of_snacks),
		'calories': request.user.mealsprofile.calories,
		'protein_percent': request.user.mealsprofile.protein_percent,
		'fat_percent': request.user.mealsprofile.fat_percent,
		'carbs_percent': request.user.mealsprofile.carbs_percent,
		'date': x,
	}

	return render(request, 'meal_plan/meals_page.html', context)

def demo_meal_plan_view(request):

	today = datetime.date.today()
	x = today.strftime('%A %d')
	context = {
		'num_of_meals': 3,
		'r_num_of_meals': range(3),
		'num_of_snacks': 2,
		'r_num_of_snacks': range(2),
		'calories': 1900,
		'protein_percent': 30,
		'fat_percent': 30,
		'carbs_percent': 40,
		'date': x,
	}

	return render(request, 'meal_plan/demo_meals_page.html', context)

@login_required
def single_meal_view(request):

	context = {
		'range': range(0,1),
	}

	return render(request, 'meal_plan/single_meal.html', context)

@login_required
def saved_meals_view(request):
	context = {
		'r_num_of_saved_meals': range(request.user.meals.user_num_of_saved_meals),
		'num_of_saved_meals': request.user.meals.user_num_of_saved_meals,
	}

	return render(request, 'meal_plan/saved_meals.html', context)


@csrf_exempt
def post_meal_plan(request):
	if request.is_ajax and request.method == "POST":

		request.user.meals.user_meal_plan = json.dumps(request.POST)

		request.user.meals.save()


		return HttpResponse("Success")

	return HttpResponse("Fail")

@login_required
def get_meal_plan(request):
	if request.is_ajax and request.method == "GET":

		if request.user.meals.user_meal_plan == "{}":
			return HttpResponse('{}', content_type="application/json")
		else:
			return HttpResponse(json.loads(request.user.meals.user_meal_plan), content_type="application/json")

@csrf_exempt
def update_saved_meals(request):
	if request.is_ajax and request.method == "POST":

		request.user.meals.user_saved_meals = json.dumps(request.POST['listOfMeals'])
		if request.POST['numOfMeals'] == "increment":
			request.user.meals.user_num_of_saved_meals += 1
		elif request.POST['numOfMeals'].isdigit():
			request.user.meals.user_num_of_saved_meals = int(request.POST['numOfMeals'])
		else:
			response = JsonResponse({"error": "there was an error"})
			response.status_code = 500
			return response

		request.user.meals.save()

		return HttpResponse("Success")

	return HttpResponse("Fail")

@login_required
def get_saved_meals(request):
	if request.is_ajax and request.method == "GET":

		if request.user.meals.user_saved_meals == "{}":
			return HttpResponse('{}', content_type="application/json")
		else:
			return HttpResponse(json.loads(request.user.meals.user_saved_meals), content_type="application/json")

def spoonacular_endpoint(request):
	print(os.environ.get('SPOONACULAR_API_KEY'))
	if request.is_ajax and request.method == "GET":
		url = request.GET['url']
		headers = {
			'x-rapidapi-key': os.environ.get('SPOONACULAR_API_KEY'),
			'x-rapidapi-host': "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
			}
		response = requests.request("GET", url, headers=headers)
		return HttpResponse(response, content_type="application/json")







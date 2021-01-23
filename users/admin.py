from django.contrib import admin
from .models import Profile, MealsProfile, Meals

# Register your models here.

admin.site.register(Profile)
admin.site.register(MealsProfile)
admin.site.register(Meals)

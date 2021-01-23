from django.apps import AppConfig

import sys
from urllib.parse import urlparse

from django.conf import settings


class MealPlanConfig(AppConfig):
    name = 'meal_plan'

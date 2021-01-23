"""MealPrepr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users.views import profile_view, RegisterWizard, reg_comp_view, CustomLoginView
from django.contrib.staticfiles.urls import  staticfiles_urlpatterns
from django.contrib.auth import views as auth_views
from pages.views import home_view, contact_view
from django.conf import settings
from django.conf.urls.static import static
from users.forms import UserRegistrationForm, UserRegistrationForm2

from meal_plan.views import meal_plan_view, post_meal_plan, get_meal_plan, saved_meals_view, single_meal_view, update_saved_meals, get_saved_meals



urlpatterns = [
    path('admin/', admin.site.urls),

    path('login/', CustomLoginView.as_view(redirect_authenticated_user=True, template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('profile/', profile_view, name='profile'),

    path('register/', RegisterWizard.as_view([UserRegistrationForm, UserRegistrationForm2]), name='register'),
    path('', home_view, name='home'),
    path('meals/plan/', meal_plan_view, name='mealplan'),
    path('meals/saved', saved_meals_view, name='savedmeals'),
    path('meals/single', single_meal_view, name='singlemeal'),
    path('contact/', contact_view, name = 'contact'),

    
    path('complete/', reg_comp_view, name='comp'),
    path('meals/plan/post/ajax/meal_plan', post_meal_plan, name='post_meals'),
    path('meals/plan/get/ajax/meal_plan', get_meal_plan, name='get_meals'),


    path('meals/saved/get/ajax/saved_meals', get_saved_meals, name='get_saved_meals'),
    path('meals/saved/post/ajax/saved_meals', update_saved_meals, name='update_saved_meals'),

    path('meals/plan/saved/get/ajax/saved_meals', get_saved_meals, name='get_saved_meals_p'),
    path('meals/plan/saved/post/ajax/saved_meals', update_saved_meals, name='update_saved_meals_p'),


] 


# only add this when you are in DEBUG mode (not for deployment)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()

handler404 = 'pages.views.error_404_view'



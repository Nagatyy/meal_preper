from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import UserRegistrationForm, UserRegistrationForm2, UserUpdateForm, ProfileUpdateForm, ProfileMacrosForm
from django.contrib.auth.decorators import login_required

from django.contrib.auth.views import LoginView
from django.shortcuts import resolve_url

from formtools.wizard.views import SessionWizardView
from functools import reduce 

from django_email_verification import send_email

# Create your views here.


class RegisterWizard(SessionWizardView):

	template_name = "users/register.html"
	form_list = [UserRegistrationForm, UserRegistrationForm2]


	def done(self, form_list, **kwargs):

		form_lst = list(form_list)

		all_valid = reduce(lambda a,b: a.is_valid() and b.is_valid(),list(form_list))

		if all_valid:

			user_form = form_lst[0]
			profile_form = form_lst[1]

			user = user_form.save()

			user.profile.weight = form_lst[1].cleaned_data.get('weight')
			user.profile.gender = form_lst[1].cleaned_data.get('gender')
			user.profile.age = form_lst[1].cleaned_data.get('age')
			user.profile.activity_level = form_lst[1].cleaned_data.get('activity_level')
			user.profile.goal = form_lst[1].cleaned_data.get('goal')
			user.profile.preferred_units = form_lst[1].cleaned_data.get('preferred_units')
			user.profile.height = form_lst[1].cleaned_data.get('height')
			user.profile.save()

			messages.success(self.request, f'Verification email sent to {user.email}!')

			user.is_active = False
			send_email(user)


		return redirect('verifyemail')


class CustomLoginView(LoginView):

	def __init__(self, *args, **kwargs):
		super(LoginView, self).__init__(*args, **kwargs)


	def get_success_url(self):

		# if the user is loggin in for the first time, he will be prompted to
		# edit his calories, otherwise, he is redirected to the meals page

		if self.request.user.profile.is_new_user:
			self.request.user.profile.update_new_user()
			return resolve_url('comp')
		else:
			return resolve_url('mealplan')


@login_required
def profile_view(request):


	if request.method == "POST":
		p_form = ProfileUpdateForm(request.POST, instance=request.user.profile)
		m_form = ProfileMacrosForm(request.POST, instance=request.user.mealsprofile)


		if 'prof_submit' in request.POST and p_form.is_valid():
			# the profile form has been submitted
			p_form.save()
			messages.success(request, f'Profile info updated!')



		elif 'meals_sub' in request.POST and m_form.is_valid():
			# the meals form has been submitteed
			m_form.save()
			messages.success(request, f'Meals info updated!')

		
		return redirect('profile')
	else: 
		p_form = ProfileUpdateForm(instance=request.user.profile)
		m_form = ProfileMacrosForm(instance=request.user.mealsprofile)
		# m_form.fields['num_of_meals'].disabled = True
		# m_form.fields['num_of_snacks'].disabled = True




	context = {
		'p_form': p_form,
		'm_form': m_form,
		'username': request.user.username,
		'email': request.user.email,
	}

	return render(request, 'users/profile.html', context)


@login_required
def reg_comp_view(request):

	errors = ""

	if request.method == "POST":
		# request.user.mealsprofile.calories = request.user.mealsprofile.calculated_calories
		m_form = ProfileMacrosForm(request.POST, instance=request.user.mealsprofile)

		if m_form.is_valid():
			m_form.save()
			return redirect('login')
	else:
		request.user.mealsprofile.calories = request.user.mealsprofile.calculated_calories
		request.user.mealsprofile.num_of_meals = request.user.mealsprofile.calculated_meals
		request.user.mealsprofile.num_of_snacks = request.user.mealsprofile.calculated_snacks
		request.user.mealsprofile.save()
		m_form = ProfileMacrosForm(instance=request.user.mealsprofile)


	context = {
		'm_form' : m_form,
		'user': request.user,
	}

	return render(request, 'users/registration_complete.html', context)

def wait_for_email_ver_view(request):

	if request.user.is_active:
		return redirect('login')

	else:
		context = {
		}

		return render(request, 'users/wait_for_email_ver.html', context)

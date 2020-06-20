from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import UserRegistrationForm, UserRegistrationForm2
from django.contrib.auth.decorators import login_required

from formtools.wizard.views import SessionWizardView
from functools import reduce

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
			user.profile.save()

			messages.success(self.request, f'Account Created For {user.username}! Press the link below to login!!')


		return render(self.request, 'users/registration_complete.html', {'form_data': [form.cleaned_data for form in form_list],})



@login_required
def profile_view(request):

	context = {}

	return render(request, 'users/profile.html', context)

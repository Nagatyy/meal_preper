from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import UserRegistrationForm
from django.contrib.auth.decorators import login_required
# Create your views here.


def register_view(request):


	if request.method == 'POST':
		form = UserRegistrationForm(request.POST)
		if form.is_valid():
			form.save() 
			email = form.cleaned_data.get('email')
			messages.success(request, f'Account Created For {email}! Login Below!')
			return redirect('login')
	else:
		form = UserRegistrationForm()

	form.fields['username'].help_text = ""
	form.fields['password1'].help_text = ""
	form.fields['password2'].help_text = ""


	
	return render(request, 'users/register.html', {'form': form}) 


@login_required
def profile_view(request):

	context = {}

	return render(request, 'users/profile.html', context)

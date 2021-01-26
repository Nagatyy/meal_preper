from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .forms import ContactForm
from django.contrib import messages

from django.core.mail import send_mail
from django.conf import settings

# Create your views here.

def home_view(request):
	return render(request, 'home.html', {})

@login_required
def inner_contact_view(request):
	if request.method == "POST":
		c_form = ContactForm(request.POST)
		if c_form.is_valid():
			message = 'First Name: ' + c_form.cleaned_data['first_name'] + '\n'
			message += 'Last Name: ' + c_form.cleaned_data.get('last_name') + '\n'
			message += 'Email: ' + c_form.cleaned_data.get('email') + '\n'
			message += 'Message: \n' + c_form.cleaned_data.get('message') + '\n'
			send_mail(
				c_form.cleaned_data.get('subject'),
				message,
				settings.EMAIL_HOST_USER,
				[settings.EMAIL_HOST_USER],
				fail_silently = True
			)
			messages.success(request, f'Thanks for reaching out! We will be in touch shortly.')
		else:
			messages.warning(request, f'Submission failed.')

	c_form = ContactForm()

	context = {
		'c_form': c_form,
		'user_email': request.user.email
	}
	return render(request, 'contact.html', context)

def error_404_view(request, exception):
	return render(request, '404.html', {})


def outer_contact_view(request):
	if request.method == "POST":
		c_form = ContactForm(request.POST)
		if c_form.is_valid():
			message = 'First Name: ' + c_form.cleaned_data['first_name'] + '\n'
			message += 'Last Name: ' + c_form.cleaned_data.get('last_name') + '\n'
			message += 'Email: ' + c_form.cleaned_data.get('email') + '\n'
			message += 'Message: \n' + c_form.cleaned_data.get('message') + '\n'
			send_mail(
				c_form.cleaned_data.get('subject'),
				message,
				settings.EMAIL_HOST_USER,
				[settings.EMAIL_HOST_USER],
				fail_silently = True
			)
			messages.success(request, f'Thanks for reaching out! We will be in touch shortly')
		else:
			messages.warning(request, f'Submission failed.')

	c_form = ContactForm()

	context = {
		'c_form': c_form,
	}
	return render(request, 'contact_outer.html', context)
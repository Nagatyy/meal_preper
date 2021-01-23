from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

def home_view(request):
	return render(request, 'home.html', {})

@login_required
def faq_view(request):
	return render(request, 'faq.html', {})

@login_required
def contact_view(request):
	return render(request, 'contact.html', {})

def error_404_view(request, exception):
	return render(request, '404.html', {})
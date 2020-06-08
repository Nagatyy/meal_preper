from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class UserRegistrationForm(UserCreationForm):

	email = forms.EmailField()				# can set required = false

	class Meta:								# this gives us a nnested namespace for configurationns
		model = User 						# this is saying that the users model will be affected
		fields = ['username','email', 'password1', 'password2']# the fields and order shown on our form

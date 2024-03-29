from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

from .models import Profile, MealsProfile

class CaseInsensitiveUserCreationForm(UserCreationForm):
    def clean(self):
        cleaned_data = super(CaseInsensitiveUserCreationForm, self).clean()
        username = cleaned_data.get('username')
        if username and User.objects.filter(username__iexact=username).exists():
            self.add_error('username', 'A user with that username already exists.')
        return cleaned_data

        
class UserRegistrationForm(CaseInsensitiveUserCreationForm):

	email = forms.EmailField()				# can set required = false

	def __init__(self, *args, **kwargs):
		super(UserCreationForm, self).__init__(*args, **kwargs)
		self.fields['email'].help_text = ''
		self.fields['username'].help_text = ''
		self.fields['password1'].help_text = ''
		self.fields['password2'].help_text = ''

	def clean_email(self):
	    data = self.cleaned_data['email']
	    if User.objects.filter(email=data).exists():
	        raise forms.ValidationError("This email is already in use")
	    return data


	class Meta:								# this gives us a nested namespace for configurationns
		model = User 						# this is saying that the users model will be affected
		fields = ['username','email', 'password1', 'password2']# the fields and order shown on our form


class UserRegistrationForm2(forms.ModelForm):


	gender_choices = ( 
    			("male", "Male"), 
    			("female", "Female"), 
	) 

	activity_level_choices = (
				("couch_potato", "Couch potato"),
				("lightly_active", "Lightly active"),
				("moderately_active", "Moderately active"),
				("pretty_active", "Pretty active"),
				("extremely_active", "Extremely active"),
	)
	units_choices = (
				("kg", "kg"),
				("lbs", "lbs"),
	)


	height_choices = (
				("cm", "cm"),
				("feet_and_inches", "feet and inches"),
	)


	goal_choices = (
				("lose_weight", "Lose weight"),
				("maintain_weight", "Maintain Weight"),
				("gain_weight", "Gain weight")
	)

	gender = forms.ChoiceField(required=True, choices=gender_choices)
	weight = forms.FloatField(required=True)
	age = forms.IntegerField(required=True)
	activity_level = forms.ChoiceField(required=True, choices=activity_level_choices)

	preferred_units = forms.ChoiceField(choices=units_choices, widget=forms.RadioSelect)
	preferred_height_units = forms.ChoiceField(choices=height_choices, widget=forms.RadioSelect, initial="cm")
	goal = forms.ChoiceField(required=True, choices=goal_choices, label="I want to: ")

	height = forms.FloatField(required=False, label='Height in cm')
	height_feet_seg = forms.IntegerField(required=False, label='Feet')
	height_inches_seg = forms.IntegerField(required=False, label='Inches')

	def is_valid(self):

		valid = super(UserRegistrationForm2, self).is_valid()

		if not valid:
			return valid

		height_in_cm = self.cleaned_data['height']
		height_imperial_feet = self.cleaned_data['height_feet_seg']
		height_imperial_inches = self.cleaned_data['height_inches_seg']


		if height_in_cm == None and height_imperial_feet == None:
			if height_in_cm == None:
				self._errors['height'] = ['Height is required']
			if height_imperial_feet == None:
				self._errors['height_feet_seg'] = ['Height is required']
			
			return False
		
		else:
			return True

	class Meta:
		model = Profile
		fields = ['gender','weight', 'age', 'height', 'height_feet_seg', 'height_inches_seg', 'activity_level', 'preferred_units', 'preferred_height_units', 'goal']



class UserUpdateForm(forms.ModelForm):

	email = forms.EmailField()	

	def __init__(self, *args, **kwargs):
		super(forms.ModelForm, self).__init__(*args, **kwargs)
		self.fields['username'].help_text = ''

	class Meta:								
		model = User 						
		fields = ['username','email']


class ProfileUpdateForm(forms.ModelForm):
	units_choices = (
				("kg", "kg"),
				("lbs", "lbs"),
	)

	preferred_units = forms.ChoiceField(choices=units_choices, widget=forms.RadioSelect)

	class Meta: 
		model = Profile
		fields = ['weight', 'age', 'activity_level', 'preferred_units', 'goal']

class ProfileMacrosForm(forms.ModelForm):

	def __init__(self, *args, **kwargs): 
	    super(forms.ModelForm, self).__init__(*args, **kwargs)
	    self.fields['num_of_meals'].label = 'Number of Meals' 
	    self.fields['num_of_snacks'].label = 'Number of Snacks' 

	def is_valid(self):

		valid = super(ProfileMacrosForm, self).is_valid()

		if not valid:
			return valid

		carbs_percent = self.cleaned_data['carbs_percent']
		protein_percent = self.cleaned_data['protein_percent']
		fat_percent = self.cleaned_data['fat_percent']

		total = carbs_percent + fat_percent + protein_percent

		if total != 100:
			self._errors[''] = 'Macros do not add up to 100'

		return valid and total == 100


	class Meta:
		model = MealsProfile
		fields = ['calories', 'carbs_percent', 'protein_percent', 'fat_percent', 'num_of_meals', 'num_of_snacks']







			

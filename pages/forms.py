from django import forms

class ContactForm(forms.Form):

	first_name = forms.CharField(max_length=20, label='First Name')
	last_name = forms.CharField(max_length=20, label='Last Name')
	email = forms.EmailField()
	subject = forms.CharField(max_length=40, label='Subject')
	message = forms.CharField(label='Message', widget=forms.Textarea)
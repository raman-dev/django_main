from django import forms
from django.core.exceptions import ValidationError


class SearchForm(forms.Form):
    search = forms.CharField(strip=True, max_length=26,
                             widget=forms.TextInput(attrs={
                                 'class': 'form-control mr-sm-2',
                                 'type': 'search',
                                 'placeholder': 'Search',
                                 'aria-label': 'Search'
                             }), label='')


class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'type': 'email',
        'id': 'email_input'
    }), label='Email Address')

    password = forms.CharField(strip=True, max_length=256,
                               widget=forms.TextInput(attrs={
                                   'class': 'form-control',
                                   'type': 'password',
                                   'id': 'password_input'
                               }), label='Password')


class SignupForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'type': 'email',
        'id': 'email_input'
    }), label='Email Address')
    
    confirm_email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'type': 'email',
        'id': 'email_input'
    }), label='Confirm Email Address')

    password = forms.CharField(strip=True, max_length=256,
                               widget=forms.TextInput(attrs={
                                   'class': 'form-control',
                                   'type': 'password',
                                   'id': 'password_input'
                               }), label='Password')
    confirm_password = forms.CharField(strip=True, max_length=256,
                                       widget=forms.TextInput(attrs={
                                           'class': 'form-control',
                                           'type': 'password',
                                           'id': 'password_input'
                                       }), label='Confirm Password')

    def clean(self):
        # data cleaned by django
        cleaned_data = super().clean()
        # now make sure passwords and email's match exactly
        email = cleaned_data.get('email')
        confirm_email = cleaned_data.get('confirm_email')
        if email != confirm_email:
            raise ValidationError("Emails did not match")

        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('password')
        if password != confirm_password:
            raise ValidationError("Passwords did not match")

        # return this data since it is valid aka "clean"
        return cleaned_data

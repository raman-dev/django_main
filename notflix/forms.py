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
        'class': 'email-login',
        'type': 'email',
        'id': 'email_input'
    }), label='Email Address')

    password = forms.CharField(strip=True, max_length=256,
                               widget=forms.TextInput(attrs={
                                   'class': 'password-login',
                                   'type': 'password',
                                   'id': 'password_input'
                               }), label='Password')


class EmailForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': 'email-input',
        'type': 'email',
        'id': 'email_input',
        'placeholder':'',
        'autocomplete':'off'
    }), label='Email Address:')
    
    include_confirm = True

    confirm_email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': 'confirm-email',
        'type': 'email',
        'id': 'confirm_email_input',
        'placeholder':'',
        'autocomplete':'off'
    }), label='Confirm Email:')
    blank = True


    def clean(self):
        # data cleaned by django
        cleaned_data = super().clean()
        # now make sure passwords and email's match exactly
        email = cleaned_data.get('email')
        confirm_email = cleaned_data.get('confirm_email')
        if email != confirm_email:
            raise ValidationError("Emails did not match")

        # return this data since it is valid aka "clean"
        return cleaned_data


class PasswordForm(forms.Form): 
    password = forms.CharField(strip=True, max_length=256,
                               widget=forms.TextInput(attrs={
                                   'class': 'password',
                                   'type': 'password',
                                   'id': 'password_input',
                                   'placeholder':'',
                                   'autocomplete':'off'
                               }), label='Password')
    
    include_confirm = True
    confirm_password = forms.CharField(strip=True, max_length=256,
                                       widget=forms.TextInput(attrs={
                                           'class': 'confirm-password',
                                           'type': 'password',
                                           'id': 'confirm_password_input',
                                            'placeholder':'',
                                            'autocomplete':'off'
                                       }), label='Confirm Password')
    blank = True
    def clean(self):
        # data cleaned by django
        cleaned_data = super().clean()
        # now make sure passwords and email's match exactly

        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('password')
        if password != confirm_password:
            raise ValidationError("Passwords did not match")

        # return this data since it is valid aka "clean"
        return cleaned_data

class SignupForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={
        'class': '',
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

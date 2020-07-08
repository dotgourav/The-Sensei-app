from django import forms


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=255)
    password = forms.CharField(max_length=255)

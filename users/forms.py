from django import forms

from .models import User


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=255)
    password = forms.CharField(max_length=255)


class MeSettingsForm(forms.ModelForm):
    last_name = forms.CharField(required=False)
    phone = forms.CharField(required=False)
    room_number = forms.CharField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_picture', 'phone', 'room_number', 'subjects']

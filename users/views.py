from django.views.decorators.http import require_POST, require_safe
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from annoying.decorators import ajax_request, render_to

from .forms import LoginForm


@require_safe
@render_to('users/login/login.html')
def signin(request):
    if request.user.is_authenticated:
        return redirect('index')
    return {
        'next': request.GET.get('next', '')
    }


@require_POST
@ajax_request
def login_process(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        email = form.cleaned_data['email'].lower()
        password = form.cleaned_data['password']
        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            response = {'success': True}
            if request.POST.get('next'):
                response['next'] = request.POST.get('next')
            return response
        else:
            errors = 'Email or password incorrect'
    else:
        errors = form.errors
    return {'success': False, 'errors': errors}


@require_safe
def signout(request):
    logout(request)
    return redirect('index')


@require_safe
@login_required()
@render_to('users/settings/importer.html')
def import_teachers(request):
    return {}


@require_safe
@login_required()
@render_to('users/settings/importer.html')
def me(request):
    return {}


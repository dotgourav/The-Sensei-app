import pandas as pd

from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_safe
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.template.loader import render_to_string

from annoying.decorators import ajax_request, render_to

from .forms import LoginForm, MeSettingsForm
from .services import validate_teachers_data
from schools.models import School

User = get_user_model()


@require_safe
@render_to('users/login/login.html')
def signin(request):
    if request.user.is_authenticated:
        return redirect('teacher_directory')
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
    return redirect('teacher_directory')


@require_safe
@login_required(redirect_field_name=None)
@render_to('users/settings/me.html')
def me(request):
    return {}


@require_POST
@ajax_request
@login_required
def me_settings_process(request):
    user = request.user
    data = request.POST
    files = request.FILES

    form = MeSettingsForm(data=data, instance=user, files=files)
    if form.is_valid():
        form.save()
        return {'success': True}
    else:
        return {'success': False, 'errors': form.errors}


@csrf_exempt
@require_POST
@ajax_request
@login_required
def profile_picture_delete(request):
    user = request.user

    if user.profile_picture and user.profile_picture.url:
        user.profile_picture.delete()

    return {
        'success': True
    }


@require_safe
@login_required()
@render_to('users/settings/importer.html')
def import_teachers(request):
    return {}


@require_POST
@ajax_request
def import_teachers_process(request):
    uploaded_file = None
    errors = []
    warnings = []
    error_msg = 'Please, correct the following errors and re-upload: <br>'

    field_names = {
        'First Name': 'first_name',
        'Last Name': 'last_name',
        'Profile picture': 'profile_picture',
        'Email Address': 'email',
        'Phone Number': 'phone',
        'Room Number': 'room_number',
        'Subjects taught': 'subjects',
    }

    if not request.FILES.getlist('files'):
        return {'success': True, 'errors': 'Upload a file to import.'}

    uploaded_file = request.FILES.getlist('files')[0]

    if not uploaded_file.name.lower().endswith('.csv'):
        return {'success': True, 'errors': 'Please, upload a CSV file.'}

    df = pd.read_csv(uploaded_file)
    df = df.fillna('')
    teachers_data = {}
    for row in range(df.shape[0]):
        teacher = {}
        for col in range(df.shape[1]):
            teacher[df.keys()[col]] = df.iat[row, col]
        teachers_data[row] = teacher

    errors, warnings = validate_teachers_data(teachers_data, field_names)

    if errors:
        errors.insert(0, error_msg)
        return {'success': True, 'errors': errors}

    for key, value in teachers_data.items():
        teacher_data = {}
        for field_name, field_value in teachers_data.get(key).items():
            if field_names.get(field_name):
                teacher_data[field_names.get(field_name)] = field_value

        teacher = User()
        teacher.first_name = teacher_data.get('first_name')
        teacher.last_name = teacher_data.get('last_name')
        profile_picture = teacher_data.get('profile_picture')
        if profile_picture:
            teacher.profile_picture.name = f'user/{profile_picture}'
        teacher.email = teacher_data.get('email')
        teacher.phone = teacher_data.get('phone')
        teacher.room_number = teacher_data.get('room_number')
        teacher.subjects = teacher_data.get('subjects')
        teacher.school = School.objects.first()

        try:
            teacher.save()
        except IntegrityError:
            warnings.append(f'Row {key+2}: Teacher with same email exists. Skipping this row.<br>')

    if not errors and not warnings:
        return {'success': True, 'errors': 'Teachers uploaded in the system.'}
    elif warnings:
        warnings.insert(0, 'Teachers uploaded in the system with following warnings: <br>')
        return {'success': True, 'errors': warnings}
    else:
        errors.insert(0, error_msg)
        return {'success': True, 'errors': errors}


@require_safe
@login_required
@render_to('users/teacher_directory.html')
def teacher_directory(request):
    return {}


@csrf_exempt
@ajax_request
@login_required
def teacher_directory_ajax(request):
    data = request.GET
    user = request.user

    offset = int(data.get('start', 0))
    step = int(data.get('length', 25))
    search = data.get('sSearch', '')
    sort_col_number = int(data.get('order[0][column]', 1)) - 1
    sort_col_dir = data.get('order[0][dir]', 'asc')
    sort_col_dir_sign = '' if sort_col_dir == 'asc' else '-'
    table_fields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'room_number',
        'subjects'
    ]

    teachers = User.objects.filter(role=User.TEACHER)

    total_count = teachers.count()

    filtered_count = teachers.count()

    teachers = teachers.order_by(sort_col_dir_sign + table_fields[sort_col_number])

    # Pagination
    if step == -1:
        teachers = teachers[offset:]
    else:
        teachers = teachers[offset: offset + step]

    transformed_teacher_list = []
    for teacher in teachers:
        transformed_teacher_list.append({
            'profile_picture': {
                'html_content': render_to_string('core/user_profile_picture.html', {'user': teacher}),
                'name': teacher.name
            },
            'first_name': teacher.first_name,
            'last_name': teacher.last_name,
            'email': teacher.email,
            'phone': teacher.phone,
            'room_number': teacher.room_number,
            'subjects': teacher.subjects,
            'id': teacher.id
        })

    return {
        'success': True,
        'recordsTotal': total_count,
        'recordsFiltered': filtered_count,
        'data': transformed_teacher_list
    }

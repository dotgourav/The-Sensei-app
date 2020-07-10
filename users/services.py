from django.contrib.auth import get_user_model
from django.core.validators import validate_email, ValidationError

User = get_user_model()


def validate_teachers_data(data, field_names):
    errors = []
    warnings = []

    for key, value in data.items():
        teacher_data = {}
        print(f'******************************\nRow: {key}')
        for field_name, field_value in data.get(key).items():
            db_field_name = field_names.get(field_name)
            print(f"{db_field_name}: ", field_value)
            if db_field_name:
                if db_field_name in ['first_name', 'email'] and not field_value:
                    error = f'Row {key+2}: {field_name} is mandatory.<br>'
                    errors.append(error)
                if db_field_name == 'email':
                    try:
                        validate_email(field_value)
                        users = User.objects.filter(email=field_value)
                        if users.exists():
                            errors.append(f'Row {key+2}: Teacher with this email already exists.<br>')
                    except ValidationError as err:
                        errors.append(f'Row {key+2}: {err.message}<br>')
                if db_field_name == 'profile_picture':
                    pass
                if db_field_name == 'subjects':
                    subjects = field_value.split(',')
                    if len(subjects) > 5:
                        errors.append(f'Row {key+2}: Teachers cannot be assigned more than 5 subjects<br>')

    return errors, warnings
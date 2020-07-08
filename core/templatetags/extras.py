from random import randint

from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag
def random_number():
    return str(2) if not settings.DEBUG else str(randint(1, 10000))


@register.inclusion_tag('core/base/initials_logo.html')
def get_initials_user_icon(user, size='20'):
    if user is None:
        return {
            'initials': "NA",
            'color': 'grey',
            'size': size
        }
    initials = ''
    if user.first_name:
        initials += user.first_name[0]

    if user.last_name:
        initials += user.last_name[0]

    return {
        'initials': initials.upper(),
        'color': user.get_user_color,
        'size': size
    }


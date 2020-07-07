def get_filename(instance, filename):
    ext = filename.split('.')[-1]
    folder = ''
    class_name = instance.__class__.__name__.lower()
    if class_name == 'user':
        folder = 'users/'
    return f'{folder}{filename}'

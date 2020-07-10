from django.urls import path

from . import views

urlpatterns = [
    path('', views.teacher_directory, name='teacher_directory'),
    path('ajax/teacher-directory/', views.teacher_directory_ajax, name='teacher_directory_ajax'),
    path('login/', views.signin, name='login'),
    path('ajax/login_process/', views.login_process, name='login_process'),
    path('logout/', views.signout, name='logout'),

    # Settings
    path('me/', views.me, name='me'),
    path('ajax/me-process/', views.me_settings_process, name='me_settings_process'),
    path('ajax/profile-picture-delete/', views.profile_picture_delete, name='profile_picture_delete'),
    path('settings/import-teachers/', views.import_teachers, name='import_teachers'),
    path('settings/import-teachers-process/', views.import_teachers_process, name='import_teachers_process')
]


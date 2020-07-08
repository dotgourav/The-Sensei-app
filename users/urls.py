from django.urls import path

from . import views

urlpatterns = [
    path('', views.signin, name='index'),
    path('login/', views.signin, name='login'),
    path('ajax/login_process/', views.login_process, name='login_process'),
    path('logout/', views.signout, name='logout'),
    path('me/', views.me, name='me'),

    # Settings
    path('settings/import-teachers/', views.import_teachers, name='import_teachers')
]


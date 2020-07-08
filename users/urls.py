from django.urls import path

from . import views

urlpatterns = [
    path('', views.signin, name='index'),
    path('login/', views.signin, name='login'),
    path('ajax/login_process/', views.login_process, name='login_process'),
    path('logout/', views.signout, name='logout'),

    # Settings
    path('settings/', views.settings, name='settings'),
]


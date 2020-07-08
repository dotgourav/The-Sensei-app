from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from import_export import resources
from import_export.admin import ImportExportModelAdmin, ImportForm

from schools.models import School
from .models import User

admin.site.site_header = 'Sensei App'


class UserResource(resources.ModelResource):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'profile_picture', 'email', 'phone', 'room_number', 'subjects')

    def init_instance(self, row, *args, **kwargs):
        instance = super().init_instance(row, *args, **kwargs)
        instance.school = School.objects.first()
        instance.is_superuser = True
        return instance


class CustomAdmin(UserAdmin, ImportExportModelAdmin):
    resource_class = UserResource
    ordering = ('id',)
    list_display = ('id', 'first_name', 'last_name', 'email', 'subjects')
    list_filter = ('last_name', 'subjects')
    fieldsets = (
        ('Primary Information', {'fields': ('first_name', 'last_name', 'email', 'password', 'role')}),
        ('Additional Information', {'fields': ('phone', 'room_number', 'profile_picture', 'subjects', 'school', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'email', 'password1', 'password2', 'role', 'school', 'is_superuser'),
        }),
    )
    search_fields = ('last_name', 'email', 'subjects')
    # def get_resource_kwargs(self, request, *args, **kwargs):
    # result = super().get_resource_kwargs(request, *args, **kwargs)
    # result['school_id'] = School.objects.first()
    # result['is_superuser'] = True
    # return result


admin.site.register(User, CustomAdmin)

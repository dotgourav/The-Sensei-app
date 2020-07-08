from django.contrib.auth.base_user import BaseUserManager

from schools.models import School


class UserManager(BaseUserManager):
    def _create_user(self, email, first_name, password, **extra_fields):
        if not email:
            raise ValueError('Email must be defined')

        email = self.normalize_email(email)
        school, _ = School.objects.get_or_create(name='A School')
        extra_fields.update({'school': school})
        user = self.model(email=email.lower(), first_name=first_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, first_name, password, **extra_fields):
        return self._create_user(
            email=email,
            first_name=first_name,
            password=password,
            is_superuser=False,
            **extra_fields
        )

    def create_superuser(self, email, first_name, password, **extra_fields):
        return self._create_user(
            email=email,
            first_name=first_name,
            password=password,
            is_superuser=True,
            **extra_fields
        )

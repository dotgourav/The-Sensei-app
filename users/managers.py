from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def _create_user(self, email, name, password, **extra_fields):
        if not email:
            raise ValueError('Email must be defined')

        email = self.normalize_email(email)
        user = self.model(email=email.lower(), name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, name, password, **extra_fields):
        return self._create_user(email=email, name=name, password=password, is_superuser=False, **extra_fields)

    def create_superuser(self, email, name, password, **extra_fields):
        return self._create_user(email=email, name=name, password=password, is_superuser=True, **extra_fields)

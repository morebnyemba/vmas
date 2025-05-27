# backend/core/management/commands/create_superuser_with_password.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a superuser non-interactively using environment variables for username, email, and password.'

    def handle(self, *args, **options):
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        if not all([username, email, password]):
            self.stderr.write(self.style.ERROR(
                'Missing one or more required environment variables: '
                'DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD'
            ))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'Superuser with username "{username}" already exists.'))
        elif User.objects.filter(email=email).exists():
            # Optionally, you could decide to update the existing user or just warn.
            # For simplicity, we'll just warn if email exists but username doesn't.
            # A more robust approach might check if the existing email user is already a superuser.
            existing_user_by_email = User.objects.get(email=email)
            if existing_user_by_email.username == username:
                self.stdout.write(self.style.WARNING(f'Superuser with username "{username}" (and email "{email}") already exists.'))
            else:
                self.stdout.write(self.style.WARNING(
                    f'User with email "{email}" (username: "{existing_user_by_email.username}") already exists. '
                    f'Cannot create superuser with username "{username}" due to email conflict if usernames differ.'
                ))
        else:
            try:
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created successfully.'))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f'Error creating superuser "{username}": {e}'))

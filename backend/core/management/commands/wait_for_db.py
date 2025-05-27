    # backend/core/management/commands/wait_for_db.py
    import time
    from django.db import connections
    from django.db.utils import OperationalError
    from django.core.management.base import BaseCommand

    class Command(BaseCommand):
        """Django command to pause execution until database is available"""

        def handle(self, *args, **options):
            self.stdout.write(self.style.NOTICE('Waiting for database...'))
            db_conn = None
            retries = 30  # Retry for 30 seconds
            while retries > 0:
                try:
                    db_conn = connections['default']
                    db_conn.cursor() # Try to get a cursor to see if connection is valid
                    self.stdout.write(self.style.SUCCESS('Database available!'))
                    break
                except OperationalError:
                    self.stdout.write(self.style.WARNING('Database unavailable, waiting 1 second...'))
                    time.sleep(1)
                    retries -= 1
            
            if retries == 0 and not db_conn:
                self.stdout.write(self.style.ERROR('Database connection timed out after 30 seconds.'))
                # Optionally, exit with an error code if you want the container to fail/restart
                # import sys
                # sys.exit(1) 
    
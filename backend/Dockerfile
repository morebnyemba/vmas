# backend/Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set environment variables to prevent Python from writing .pyc files to disc and to keep Python from buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
# - build-essential and libpq-dev are often needed for psycopg2 (PostgreSQL adapter)
# - libmagic1 and file are needed for the 'python-magic' library
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libmagic1 \
    file \
    # Example: Add other dependencies like this:
    # libjpeg-dev \
    # zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install Python dependencies
# --no-cache-dir reduces image size
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code into the container at /app
COPY . /app/

# Expose the port the app runs on (Gunicorn will run on this port)
EXPOSE 8000

# Collect static files
# This command assumes that your STATIC_ROOT is configured in settings.py
# and that it's a directory within your project that will be served.
# For production, you might serve static files directly via Nginx on the host or a CDN.
# If WhiteNoise is used, it will handle serving static files through Django.
# Ensure 'whitenoise' is in your requirements.txt and configured in settings.py if you rely on it.
RUN python manage.py collectstatic --noinput

# Command to run the application
# Gunicorn is a production-ready WSGI server. Make sure it's in your requirements.txt.
# --bind 0.0.0.0:8000 makes the server accessible from outside the container.
# 'backend.wsgi:application' should point to your WSGI application object.
# Adjust the number of workers (--workers 3) based on your server's CPU cores and expected load.
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder
EXPOSE 8000
WORKDIR /app 

# Install system dependencies
RUN apk update && apk add \
    pkgconfig \
    gcc \
    musl-dev \
    bash \
    libmagic  # Add libmagic for python-magic

# Install any needed packages specified in requirements.txt
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . /app

# Run the Django development server
CMD ["python3", "manage.py", "runserver", "0.0.0.0:$PORT"]

# Copilot Instructions for Visit Masvingo (VMAS)

This repository contains the web application for Visit Masvingo Private Limited, a real estate company. The application features a Django REST API backend and a React.js (Vite) frontend.

## Project Structure

- **`/backend`** - Django REST API backend
  - `manage.py` - Django management script
  - `requirements.txt` - Python dependencies
  - `backend/` - Django project settings
  - `core/` - Core application logic
  - `properties/` - Property management app
  - `payments/` - Payment integration app
  
- **`/frontend`** - React.js frontend with Vite
  - `package.json` - Node.js dependencies
  - `src/` - React source code
  - `vite.config.js` - Vite configuration
  - Uses Tailwind CSS and Shadcn UI components

- **`docker-compose.yml`** - Multi-container Docker setup

## Technology Stack

### Backend
- **Django 5.1.7** - Web framework
- **Django REST Framework 3.15.2** - API framework
- **PostgreSQL** - Database (via Docker)
- **Redis** - Celery broker and caching
- **Celery** - Asynchronous task processing
- **JWT Authentication** - djangorestframework-simplejwt
- **Gunicorn** - WSGI server

### Frontend
- **React 19.1.0** - UI library
- **Vite 6.2.0** - Build tool
- **React Router 7.4.0** - Routing
- **Tailwind CSS 4.0.15** - Styling framework
- **Shadcn UI** - Component library (Radix UI + Tailwind)
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Hook Form + Yup** - Form handling and validation

## Development Guidelines

### Backend Development

#### Running the Backend
```bash
cd backend
python manage.py runserver
```

For Docker environment:
```bash
docker-compose up backend
```

#### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Code Style
- Follow PEP 8 style guidelines
- Use Django's built-in ORM for database operations
- Implement proper serializers for API endpoints
- Use Django REST Framework viewsets and routers
- Keep business logic in models and service layers
- Use environment variables for configuration (via django-environ)

#### Security
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Keep Django SECRET_KEY and FIELD_ENCRYPTION_KEY secure
- Use JWT for API authentication
- Enable CORS only for trusted origins

### Frontend Development

#### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

For Docker environment:
```bash
docker-compose up frontend
```

#### Building
```bash
npm run build
```

#### Linting
```bash
npm run lint
```

#### Code Style
- Use functional components with hooks
- Follow React best practices and hooks rules
- Use Tailwind utility classes for styling
- Leverage Shadcn UI components for consistency
- Use React Query for server state management
- Use React Hook Form for form handling
- Keep components small and focused
- Use TypeScript types when available (jsconfig.json configured)

#### API Integration
- Use Axios for HTTP requests
- Base API URL is configured via environment variables
- Handle loading and error states with React Query
- Implement proper error handling and user feedback

### Testing

#### Backend Testing
Run Django tests:
```bash
cd backend
python manage.py test
```

#### Frontend Testing
The frontend uses ESLint for code quality:
```bash
cd frontend
npm run lint
```

## API Structure

The backend provides a RESTful API under `/api/v1/`:
- Authentication endpoints (JWT)
- Property listing and management
- User profiles and agent information
- Payment processing
- Client inquiries

## Docker Setup

The application uses Docker Compose with the following services:
- **db** - PostgreSQL database
- **redis** - Redis cache and Celery broker
- **backend** - Django application
- **celery_worker** - Async task processor
- **celery_beat** - Scheduled task manager
- **flower** - Celery monitoring (optional)
- **frontend** - React application

Start all services:
```bash
docker-compose up -d
```

## Environment Variables

### Backend (.env or docker-compose)
- `DJANGO_SECRET_KEY` - Django secret key (required)
- `DJANGO_FIELD_ENCRYPTION_KEY` - Encryption key (required)
- `DATABASE_URL` - PostgreSQL connection string
- `CELERY_BROKER_URL` - Redis URL for Celery
- `DEBUG` - Debug mode (False in production)
- `ALLOWED_HOSTS` - Comma-separated allowed hosts
- `CORS_ALLOWED_ORIGINS` - Allowed CORS origins

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API base URL

## Common Tasks

### Adding a New Django App
```bash
cd backend
python manage.py startapp <app_name>
# Add to INSTALLED_APPS in settings.py
```

### Adding a New API Endpoint
1. Create serializer in `serializers.py`
2. Create viewset in `views.py`
3. Register route in `urls.py`
4. Update API documentation

### Adding a New React Component
1. Create component in `src/components/`
2. Use Shadcn UI components when possible
3. Style with Tailwind utility classes
4. Export from component file

### Database Changes
1. Modify models in Django
2. Run `python manage.py makemigrations`
3. Review migration files
4. Run `python manage.py migrate`

## Deployment Considerations

- The application is designed for deployment with Docker
- Backend runs on Gunicorn
- Frontend is built and served via Nginx
- Static files are collected via `collectstatic`
- Media files are stored in volumes
- Environment-specific settings via environment variables
- HTTPS should be configured at reverse proxy level

## Best Practices

### General
- Write clear, self-documenting code
- Use meaningful variable and function names
- Keep functions and methods focused on single responsibilities
- Document complex business logic
- Use git commit messages that explain the "why" not just the "what"

### Backend
- Use Django's built-in features before adding third-party packages
- Implement proper error handling and validation
- Use database transactions for multi-step operations
- Optimize queries with `select_related` and `prefetch_related`
- Use Django's permission system for access control

### Frontend
- Optimize for performance (lazy loading, code splitting)
- Ensure responsive design for all screen sizes
- Provide clear user feedback for async operations
- Handle edge cases and error states gracefully
- Use semantic HTML and accessibility attributes

## Support and Resources

- Django documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React documentation: https://react.dev/
- Vite documentation: https://vite.dev/
- Tailwind CSS: https://tailwindcss.com/
- Shadcn UI: https://ui.shadcn.com/

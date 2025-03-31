from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("core/",include("core.urls")),
    path("properties/",include("properties.urls")),
    path("api-auth/", include("rest_framework.urls")),
    
]
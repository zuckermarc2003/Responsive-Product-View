"""
AL-FIRDAOUS STORE — URL router

In your main urls.py:
    path("api/", include("store.urls")),

Install: pip install djangorestframework django-cors-headers
Then add to INSTALLED_APPS:
    "rest_framework",
    "corsheaders",

And to MIDDLEWARE (before CommonMiddleware):
    "corsheaders.middleware.CorsMiddleware",

And set CORS settings:
    CORS_ALLOW_ALL_ORIGINS = True  # dev only
    # Or for production:
    # CORS_ALLOWED_ORIGINS = ["https://your-expo-app-domain.com"]
"""
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = router.urls

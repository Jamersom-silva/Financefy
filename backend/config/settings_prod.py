from .settings import *
import dj_database_url
import os

DEBUG = False

ALLOWED_HOSTS = ["*"]

# ----------------------------
# Banco de dados (Railway)
# ----------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ----------------------------
# Segurança
# ----------------------------
CSRF_TRUSTED_ORIGINS = [
    "https://*.railway.app",
]

CORS_ALLOWED_ORIGINS = [
    "https://financefy-frontend.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True

# Cookie Seguro
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# JWT Cookie names
JWT_REFRESH_COOKIE_NAME = "financefy_refresh"

# Static files
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

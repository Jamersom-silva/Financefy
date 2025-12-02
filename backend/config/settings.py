from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
import dj_database_url

from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================================================================
# 🔹 VARIÁVEIS DE AMBIENTE
# ==============================================================================
SECRET_KEY = config("SECRET_KEY", default="dev-secret-key")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]


# ==============================================================================
# 🔹 APPS INSTALADOS
# ==============================================================================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    "django_filters",
    "corsheaders",
    "drf_spectacular",

    "core",
]


# ==============================================================================
# 🔹 MIDDLEWARE
# ==============================================================================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    # CSRF
    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ==============================================================================
# 🔹 CORS / CSRF — CONFIG CORRETA PARA VITE (5173)
# ==============================================================================
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 🔥 O ERRO DE CORS ESTAVA AQUI!
# "*" NÃO FUNCIONA PARA HEADERS — ESTA É A CONFIGURAÇÃO CORRETA
CORS_ALLOW_HEADERS = list(default_headers) + [
    "content-type",
]

# Permite navegador ler Set-Cookie
CORS_EXPOSE_HEADERS = ["Set-Cookie"]


# ==============================================================================
# 🔹 URLS / TEMPLATES / WSGI
# ==============================================================================
ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ==============================================================================
# 🔹 DATABASE
# ==============================================================================
DATABASE_URL = config("DATABASE_URL", default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}


# ==============================================================================
# 🔹 SENHAS
# ==============================================================================
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ==============================================================================
# 🔹 INTERNACIONALIZAÇÃO
# ==============================================================================
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True


# ==============================================================================
# 🔹 STATIC / MEDIA
# ==============================================================================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ==============================================================================
# 🔹 DRF CONFIG (JWT + FILTERS + SWAGGER)
# ==============================================================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),

    # Filters
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),

    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",

    # Throttle (inclui login throttle)
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "core.api.throttles.LoginThrottle", 
    ],

    "DEFAULT_THROTTLE_RATES": {
        "anon": "50/minute",
        "user": "500/minute",
        "login": "10/minute",
    },
}


# ==============================================================================
# 🔹 SIMPLE JWT + COOKIE HTTPONLY
# ==============================================================================
JWT_REFRESH_COOKIE_NAME = "financefy_refresh"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),

    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,

    "AUTH_HEADER_TYPES": ("Bearer",),

    # Cookies
    "AUTH_COOKIE": JWT_REFRESH_COOKIE_NAME,
    "AUTH_COOKIE_SECURE": False,  # True em produção
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": "Lax",
    "AUTH_COOKIE_PATH": "/",
}


# ==============================================================================
# 🔹 SWAGGER
# ==============================================================================
SPECTACULAR_SETTINGS = {
    "TITLE": "Financefy API",
    "DESCRIPTION": "Sistema financeiro pessoal",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "ENUM_NAME_OVERRIDES": {
        "Transaction.type": "TransactionType",
        "Category.type": "CategoryType",
    },
}


# ==============================================================================
# 🔹 PRODUÇÃO — SEGURANÇA
# ==============================================================================
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SAMESITE = "Lax"
    SECURE_HSTS_SECONDS = 3600


# ==============================================================================
# 🔹 LOGGING OPCIONAL
# ==============================================================================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

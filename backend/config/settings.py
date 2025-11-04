from pathlib import Path
from datetime import timedelta
import os

# =====================================================
# 🔹 DIRETÓRIOS E CONFIGURAÇÕES BÁSICAS
# =====================================================
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "dev-secret"
DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# =====================================================
# 🔹 APLICAÇÕES INSTALADAS
# =====================================================
INSTALLED_APPS = [
    # Django padrão
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Terceiros
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_filters",
    "corsheaders",
    "drf_spectacular",  # ✅ Documentação da API

    # Apps locais
    "finance",
]

# =====================================================
# 🔹 MIDDLEWARES
# =====================================================
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Deve vir antes do CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True  # ✅ Permite todas as origens no modo dev

# =====================================================
# 🔹 CONFIGURAÇÕES PRINCIPAIS
# =====================================================
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

# =====================================================
# 🔹 BANCO DE DADOS (SQLite)
# =====================================================
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# =====================================================
# 🔹 VALIDAÇÃO DE SENHAS (desativada no modo dev)
# =====================================================
AUTH_PASSWORD_VALIDATORS = []

# =====================================================
# 🔹 LOCALIZAÇÃO E TEMPO
# =====================================================
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# =====================================================
# 🔹 ARQUIVOS ESTÁTICOS
# =====================================================
STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# =====================================================
# 🔹 CONFIGURAÇÃO DO DJANGO REST FRAMEWORK
# =====================================================
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    # ✅ Necessário para a documentação (drf-spectacular)
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# =====================================================
# 🔹 CONFIGURAÇÃO DO JWT (TOKEN)
# =====================================================
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# =====================================================
# 🔹 CONFIGURAÇÃO DO DRF-SPECTACULAR (Documentação)
# =====================================================
SPECTACULAR_SETTINGS = {
    "TITLE": "Financefy API",
    "DESCRIPTION": "API de gerenciamento financeiro pessoal, com contas, categorias, transações e anexos de PDFs.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SERVE_PERMISSIONS": ["rest_framework.permissions.AllowAny"],
}

# =====================================================
# 🔹 UPLOADS DE ARQUIVOS (PDFs, imagens etc.)
# =====================================================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Estrutura criada automaticamente:
# media/
# ├── attachments/
# │   ├── fatura-caixa.pdf
# │   ├── comprovante-pagamento.pdf

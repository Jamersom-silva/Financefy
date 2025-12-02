# ================================================================
#  FINANCEFY — URLS.PY (VERSÃO FINAL E TOTALMENTE CORRIGIDA)
# ================================================================
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import routers

# Views (core.api)
from core.api.views import (
    register_user,
    login_user,
    token_refresh_from_cookie,
    logout_user,
    UpdateProfileView,
    ChangePasswordView,
    AccountViewSet,
    CategoryViewSet,
    TransactionViewSet,
    AttachmentViewSet,
    MonthlyReportView,
    CategoryReportView,
)

# Swagger
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

# ================================================================
# 🔹 ROUTER — CRUD Automáticos
# ================================================================
router = routers.DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="accounts")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"attachments", AttachmentViewSet, basename="attachments")

# ================================================================
# 🔹 URLS PRINCIPAIS
# ================================================================
urlpatterns = [
    # Página inicial simples
    path("", lambda req: HttpResponse("<h1>Financefy API</h1><p>Backend rodando 🚀</p>")),

    # Admin
    path("admin/", admin.site.urls),

    # CRUD via Router
    path("api/v1/", include(router.urls)),

    # ============================================================
    # 🔹 AUTENTICAÇÃO (JWT + Cookies HttpOnly)
    # ============================================================
    path("api/v1/auth/register/", register_user, name="auth-register"),
    path("api/v1/auth/login/", login_user, name="auth-login"),
    path("api/v1/auth/refresh/", token_refresh_from_cookie, name="auth-refresh"),
    path("api/v1/auth/logout/", logout_user, name="auth-logout"),

    # Perfil
    path("api/v1/auth/profile/", UpdateProfileView.as_view(), name="profile-update"),
    path("api/v1/auth/change-password/", ChangePasswordView.as_view(), name="change-password"),

    # ============================================================
    # 🔹 RELATÓRIOS — ROTAS QUE O FRONTEND CONSUME
    # ============================================================
    path("api/v1/reports/monthly/", MonthlyReportView.as_view(), name="reports-monthly"),

    # ✔ Nome e URL exatamente como o frontend exige
    path("api/v1/reports/categories/", CategoryReportView.as_view(), name="reports-categories"),

    # ✔ Últimas transações (ligado ao método recent() do ViewSet)
    path(
        "api/v1/reports/recent/",
        TransactionViewSet.as_view({"get": "recent"}),
        name="reports-recent",
    ),

    # ============================================================
    # 🔹 SWAGGER
    # ============================================================
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# ================================================================
# 🔹 Static & Media (somente em DEBUG)
# ================================================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# backend/config/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework import routers

# Views (import direto do core.api)
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

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

router = routers.DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="accounts")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"attachments", AttachmentViewSet, basename="attachments")

urlpatterns = [
    # 🔹 Redireciona / → /api/docs/
    path("", RedirectView.as_view(url="/api/docs/", permanent=False)),

    path("admin/", admin.site.urls),

    # API principal (viewsets)
    path("api/v1/", include(router.urls)),

    # Auth endpoints
    path("api/v1/auth/register/", register_user, name="auth-register"),
    path("api/v1/auth/login/", login_user, name="auth-login"),
    path("api/v1/auth/refresh/", token_refresh_from_cookie, name="auth-refresh"),
    path("api/v1/auth/logout/", logout_user, name="auth-logout"),

    # Profile
    path("api/v1/auth/profile/", UpdateProfileView.as_view(), name="profile-update"),
    path("api/v1/auth/change-password/", ChangePasswordView.as_view(), name="change-password"),

    # Reports
    path("api/v1/reports/monthly/", MonthlyReportView.as_view(), name="reports-monthly"),
    path("api/v1/reports/category/", CategoryReportView.as_view(), name="reports-category"),

    # Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# Serve static & media in development (DEBUG)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

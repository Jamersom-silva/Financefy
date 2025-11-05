from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.conf import settings
from django.conf.urls.static import static

# ============================================================
# 🔹 Importa as views principais
# ============================================================
from core.api.views import (
    AccountViewSet,
    CategoryViewSet,
    TransactionViewSet,
    register_user,
    login_user,
    MonthlyReportView,
    CategoryReportView,
)

# ============================================================
# 🔹 Importa os ViewSets de anexos
# ============================================================
from core.api.attachments import (
    AttachmentGroupViewSet,
    AttachmentRecordViewSet,
    AttachmentViewSet,
)

# ============================================================
# 🔹 API ROUTER (ViewSets)
# ============================================================
router = DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="accounts")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"attachment-groups", AttachmentGroupViewSet, basename="attachment-groups")
router.register(r"attachment-records", AttachmentRecordViewSet, basename="attachment-records")
router.register(r"attachments", AttachmentViewSet, basename="attachments")

# ============================================================
# 🔹 URLS PRINCIPAIS
# ============================================================
urlpatterns = [
    path("admin/", admin.site.urls),

    # Autenticação
    path("api/v1/auth/register/", register_user, name="register"),
    path("api/v1/auth/login/", login_user, name="login"),

    # Relatórios
    path("api/v1/reports/monthly/", MonthlyReportView.as_view(), name="monthly-report"),
    path("api/v1/reports/categories/", CategoryReportView.as_view(), name="category-report"),

    # Endpoints REST principais
    path("api/v1/", include(router.urls)),

    # Documentação Swagger / Redoc
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# Servir mídia (PDFs)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

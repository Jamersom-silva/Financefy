from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    login_user,
    AccountViewSet,
    CategoryViewSet,
    TransactionViewSet,
    MonthlyReportView,
    CategoryReportView,
    UpdateProfileView,
    ChangePasswordView,
)
from .reports import RecentTransactionsView

# ✅ IMPORTS CERTOS para os anexos
from .attachment_groups import AttachmentGroupViewSet
from .attachment_records import AttachmentRecordViewSet
from .attachments import AttachmentViewSet

from django.conf import settings
from django.conf.urls.static import static


# ============================================================
# 🔹 Router (ViewSets)
# ============================================================
router = DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="accounts")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"transactions", TransactionViewSet, basename="transactions")

# ✅ Agora as rotas de anexos corretas:
router.register(r"attachment-groups", AttachmentGroupViewSet, basename="attachment-groups")
router.register(r"attachment-records", AttachmentRecordViewSet, basename="attachment-records")
router.register(r"attachments", AttachmentViewSet, basename="attachments")


# ============================================================
# 🔹 URL Patterns (Rotas da API)
# ============================================================
urlpatterns = [
    # 🔹 Autenticação
    path("auth/register/", register_user, name="register_user"),
    path("auth/login/", login_user, name="login_user"),

    # 🔹 CRUD endpoints automáticos
    path("", include(router.urls)),

    # 🔹 Relatórios
    path("reports/monthly/", MonthlyReportView.as_view(), name="monthly_report"),
    path("reports/categories/", CategoryReportView.as_view(), name="category_report"),
    path("reports/recent/", RecentTransactionsView.as_view(), name="recent_transactions"),

    # 🔹 Usuário (perfil e senha)
    path("profile/update/", UpdateProfileView.as_view(), name="update_profile"),
    path("profile/change-password/", ChangePasswordView.as_view(), name="change_password"),
]

# ============================================================
# 🔹 Servir arquivos de mídia (PDFs)
# ============================================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

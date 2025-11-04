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
    AttachmentViewSet,  # ✅ NOVO
)
from .reports import RecentTransactionsView
from django.conf import settings              # ✅ Para servir arquivos de mídia
from django.conf.urls.static import static    # ✅ Para servir arquivos de mídia
from .attachments import AttachmentViewSet 

# ============================================================
# 🔹 Router (ViewSets)
# ============================================================
router = DefaultRouter()
router.register(r"accounts", AccountViewSet, basename="accounts")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r"attachments", AttachmentViewSet, basename="attachments")  # ✅ nova rota


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
# 🔹 Servir arquivos de mídia (PDFs, imagens etc.)
# ============================================================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

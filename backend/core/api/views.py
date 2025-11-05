from datetime import datetime
from django.contrib.auth import authenticate, get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema
from ..models import Attachment
from .serializers import AttachmentSerializer

from ..models import Account, Category, Transaction
from ..services import update_account_balance, monthly_report, category_report
from .permissions import IsOwner
from .serializers import (
    RegisterSerializer,
    AccountSerializer,
    CategorySerializer,
    TransactionSerializer,
)

User = get_user_model()

# ============================================================
# 🔹 Serializers auxiliares
# ============================================================

class AuthResponseSerializer(serializers.Serializer):
    user = serializers.DictField()
    access = serializers.CharField()
    refresh = serializers.CharField()


class ReportResponseSerializer(serializers.Serializer):
    month = serializers.IntegerField()
    year = serializers.IntegerField()
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=12, decimal_places=2)
    balance = serializers.DecimalField(max_digits=12, decimal_places=2)


# ============================================================
# 🔹 AUTENTICAÇÃO (LOGIN / REGISTRO)
# ============================================================

@extend_schema(
    request=RegisterSerializer,
    responses={201: AuthResponseSerializer},
    tags=["Autenticação"],
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=RegisterSerializer,
    responses={200: AuthResponseSerializer},
    tags=["Autenticação"],
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if not user:
        return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "user": {"id": user.id, "username": user.username, "email": user.email},
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=status.HTTP_200_OK,
    )


# ============================================================
# 🔹 ATUALIZAÇÃO DE PERFIL
# ============================================================

@extend_schema(
    tags=["Usuário"],
    summary="Atualizar dados do usuário",
    description="Permite alterar nome de usuário e e-mail.",
)
class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        username = request.data.get("username")
        email = request.data.get("email")

        if username:
            user.username = username
        if email:
            user.email = email

        user.save()
        return Response(
            {"message": "Perfil atualizado com sucesso!", "user": {"username": user.username, "email": user.email}},
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Usuário"],
    summary="Alterar senha do usuário",
    description="Permite alterar a senha atual mediante confirmação da senha antiga.",
)
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"detail": "Senha antiga incorreta."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 5:
            return Response({"detail": "A nova senha deve ter pelo menos 5 caracteres."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Senha alterada com sucesso!"}, status=status.HTTP_200_OK)


# ============================================================
# 🔹 CONTAS
# ============================================================

@extend_schema(tags=["Contas"])
class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Account.objects.none()
        return Account.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        account = serializer.save(owner=self.request.user)
        update_account_balance(account)


# ============================================================
# 🔹 CATEGORIAS
# ============================================================

@extend_schema(tags=["Categorias"])
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Category.objects.none()
        return Category.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ============================================================
# 🔹 TRANSAÇÕES
# ============================================================

@extend_schema(tags=["Transações"])
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["type", "category", "account"]
    search_fields = ["description"]
    ordering_fields = ["date", "amount"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Transaction.objects.none()
        return Transaction.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        transaction = serializer.save(owner=self.request.user)
        update_account_balance(transaction.account)

    def perform_update(self, serializer):
        transaction = serializer.save()
        update_account_balance(transaction.account)

    def perform_destroy(self, instance):
        account = instance.account
        instance.delete()
        update_account_balance(account)


# ============================================================
# 🔹 RELATÓRIOS
# ============================================================

@extend_schema(tags=["Relatórios"])
class MonthlyReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        month = int(request.query_params.get("month", datetime.now().month))
        year = int(request.query_params.get("year", datetime.now().year))
        data = monthly_report(request.user, month, year)
        return Response(data)


@extend_schema(tags=["Relatórios"])
class CategoryReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        month = int(request.query_params.get("month", datetime.now().month))
        year = int(request.query_params.get("year", datetime.now().year))
        data = category_report(request.user, month, year)
        return Response(data)

# ============================================================
# 🔹 ANEXOS (PDFs de Faturas e Comprovantes)
# ============================================================

@extend_schema(tags=["Anexos"])
class AttachmentViewSet(viewsets.ModelViewSet):
    """
    API para upload e gerenciamento de PDFs (faturas e comprovantes).
    """
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["type", "category"]
    search_fields = ["name", "category__name"]
    ordering_fields = ["uploaded_at", "name"]

    def get_queryset(self):
        """
        Retorna apenas os anexos do usuário logado.
        """
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Attachment.objects.none()
        return Attachment.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Garante que o anexo seja criado com o usuário logado.
        """
        serializer.save(owner=self.request.user)

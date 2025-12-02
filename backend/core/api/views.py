# ================================================================
#  FINANCEFY — VIEWS.PY (VERSÃO FINAL, SEGURA E COMPATÍVEL COM SWAGGER)
# ================================================================
from django.db import models
from datetime import datetime
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.throttling import AnonRateThrottle

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

# Models
from ..models import (
    Account,
    Category,
    Transaction,
    Attachment,
    AttachmentGroup,
    AttachmentRecord,
)

# Serializers
from .serializers import (
    RegisterSerializer,
    AccountSerializer,
    CategorySerializer,
    TransactionSerializer,
    UpdateProfileSerializer,
    ChangePasswordSerializer,
    AttachmentSerializer,
)

# Permissions
from .permissions import IsOwner

User = get_user_model()


# ================================================================
# 🔹 THROTTLE PERSONALIZADO PARA LOGIN
# ================================================================

class LoginThrottle(AnonRateThrottle):
    scope = "login"


# ================================================================
# 🔹 Cookies HttpOnly (Refresh Token)
# ================================================================

def set_refresh_cookie(response, token_str):
    response.set_cookie(
        settings.JWT_REFRESH_COOKIE_NAME,
        token_str,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        path="/api/v1/auth/",
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
    )


def delete_refresh_cookie(response):
    response.delete_cookie(
        settings.JWT_REFRESH_COOKIE_NAME,
        path="/api/v1/auth/"
    )


# ================================================================
# 🔹 REGISTRO DE USUÁRIO
# ================================================================

@extend_schema(
    request=RegisterSerializer,
    responses={201: OpenApiResponse(description="Usuário registrado com sucesso.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    resp = Response({
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "access": str(refresh.access_token),
    }, status=201)

    set_refresh_cookie(resp, str(refresh))
    return resp


# ================================================================
# 🔹 LOGIN
# ================================================================

@extend_schema(
    request=RegisterSerializer,
    responses={200: OpenApiResponse(description="Login bem-sucedido.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@throttle_classes([LoginThrottle])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if not user:
        return Response({"detail": "Credenciais inválidas."}, status=401)

    refresh = RefreshToken.for_user(user)

    resp = Response({
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "access": str(refresh.access_token),
    })

    set_refresh_cookie(resp, str(refresh))
    return resp


# ================================================================
# 🔹 REFRESH VIA COOKIE (HttpOnly)
# ================================================================

@extend_schema(
    responses={200: OpenApiResponse(description="Token atualizado.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def token_refresh_from_cookie(request):
    refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)

    if not refresh_token:
        return Response({"detail": "Refresh token ausente."}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
    except Exception:
        return Response({"detail": "Refresh token inválido."}, status=401)

    access = refresh.access_token

    resp = Response({"access": str(access)})

    # Rotação segura
    if settings.SIMPLE_JWT["ROTATE_REFRESH_TOKENS"]:
        new_refresh = RefreshToken.for_user(refresh.payload["user_id"])
        set_refresh_cookie(resp, str(new_refresh))

    return resp


# ================================================================
# 🔹 LOGOUT
# ================================================================

@extend_schema(
    responses={200: OpenApiResponse(description="Logout realizado.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            pass

    resp = Response({"detail": "Logout realizado."})
    delete_refresh_cookie(resp)
    return resp


# ================================================================
# 🔹 UPDATE PROFILE
# ================================================================

@extend_schema(
    request=UpdateProfileSerializer,
    responses={200: UpdateProfileSerializer},
    tags=["Perfil"]
)
class UpdateProfileView(GenericAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Perfil atualizado.", "user": serializer.data})


# ================================================================
# 🔹 ALTERAR SENHA
# ================================================================

@extend_schema(
    request=ChangePasswordSerializer,
    responses={200: OpenApiResponse(description="Senha alterada.")},
    tags=["Perfil"]
)
class ChangePasswordView(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def put(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old = serializer.validated_data["old_password"]
        new = serializer.validated_data["new_password"]

        if not request.user.check_password(old):
            return Response({"detail": "Senha antiga incorreta."}, status=400)

        request.user.set_password(new)
        request.user.save()

        return Response({"message": "Senha alterada com sucesso!"})


# ================================================================
# 🔹 VIEWSETS (com SAFETY para SWAGGER)
# ================================================================

def safe_queryset(self, Model):
    """Evita erro no drf-spectacular quando request.user é anônimo."""
    if getattr(self, "swagger_fake_view", False):
        return Model.objects.none()
    if not self.request or not self.request.user.is_authenticated:
        return Model.objects.none()
    return Model.objects.filter(owner=self.request.user)


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return safe_queryset(self, Account)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return safe_queryset(self, Category)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["type", "category", "account"]
    search_fields = ["description"]
    ordering_fields = ["date", "amount"]

    def get_queryset(self):
        return safe_queryset(self, Transaction)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ================================================================
# 🔹 RELATÓRIOS
# ================================================================

@extend_schema(tags=["Relatórios"])
class MonthlyReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        month = int(request.query_params.get("month", datetime.now().month))
        year = int(request.query_params.get("year", datetime.now().year))

        qs = Transaction.objects.filter(owner=request.user, date__month=month, date__year=year)

        income = qs.filter(type="income").aggregate(total=models.Sum("amount"))["total"] or 0
        expense = qs.filter(type="expense").aggregate(total=models.Sum("amount"))["total"] or 0

        return Response({
            "month": month,
            "year": year,
            "total_income": income,
            "total_expense": expense,
            "balance": income - expense,
        })


@extend_schema(tags=["Relatórios"])
class CategoryReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        month = int(request.query_params.get("month", datetime.now().month))
        year = int(request.query_params.get("year", datetime.now().year))

        qs = Transaction.objects.filter(owner=request.user, date__month=month, date__year=year)

        data = {}
        for c in Category.objects.filter(owner=request.user):
            total = qs.filter(category=c).aggregate(total=models.Sum("amount"))["total"] or 0
            data[c.name] = total

        return Response({
            "month": month,
            "year": year,
            "categories": data,
        })


# ================================================================
# 🔹 ANEXOS (PDFs)
# ================================================================

class AttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return safe_queryset(self, Attachment)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

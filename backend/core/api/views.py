# ================================================================
#  FINANCEFY — VIEWS.PY (VERSÃO FINAL, 100% CORRIGIDA E FUNCIONAL)
# ================================================================

from datetime import datetime
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.throttling import AnonRateThrottle

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from drf_spectacular.utils import extend_schema, OpenApiResponse

# Models
from ..models import Account, Category, Transaction, Attachment

# Serializers
from .serializers import (
    LoginSerializer,
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
# 🔹 THROTTLE PARA LOGIN
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
        secure=False,      # True em produção com HTTPS
        samesite="Lax",
        path="/",
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
    )


def delete_refresh_cookie(response):
    response.delete_cookie(
        settings.JWT_REFRESH_COOKIE_NAME,
        path="/",
        samesite="Lax",
    )


# ================================================================
# 🔹 REGISTER
# ================================================================
@extend_schema(
    request=RegisterSerializer,
    responses={201: OpenApiResponse(description="Usuário criado.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    response = Response({
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "access": str(refresh.access_token)
    }, status=201)

    set_refresh_cookie(response, str(refresh))
    return response


# ================================================================
# 🔹 LOGIN
# ================================================================
@extend_schema(
    request=LoginSerializer,
    responses={200: OpenApiResponse(description="Login realizado.")},
    tags=["Autenticação"]
)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
@throttle_classes([LoginThrottle])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(username=username, password=password)

    if not user:
        return Response({"detail": "Credenciais inválidas."}, status=401)

    refresh = RefreshToken.for_user(user)

    response = Response({
        "user": {"id": user.id, "username": user.username, "email": user.email},
        "access": str(refresh.access_token)
    })

    set_refresh_cookie(response, str(refresh))
    return response


# ================================================================
# 🔹 REFRESH VIA COOKIE
# ================================================================
@extend_schema(tags=["Autenticação"])
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def token_refresh_from_cookie(request):
    refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)

    if not refresh_token:
        return Response({"detail": "Refresh token ausente."}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access = refresh.access_token
    except Exception:
        return Response({"detail": "Refresh token inválido."}, status=401)

    response = Response({"access": str(access)})

    # Rotação do refresh token
    if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
        try:
            if settings.SIMPLE_JWT.get("BLACKLIST_AFTER_ROTATION", False):
                try:
                    refresh.blacklist()
                except Exception:
                    pass

            user = User.objects.get(id=refresh["user_id"])
            new_refresh = RefreshToken.for_user(user)
            set_refresh_cookie(response, str(new_refresh))

        except Exception:
            return Response({"detail": "Falha ao rotacionar refresh token."}, status=500)

    return response


# ================================================================
# 🔹 LOGOUT
# ================================================================
@extend_schema(tags=["Autenticação"])
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            try:
                token.blacklist()
            except Exception:
                pass
        except Exception:
            pass

    response = Response({"detail": "Logout realizado."})
    delete_refresh_cookie(response)
    return response


# ================================================================
# 🔹 UPDATE PROFILE
# ================================================================
class UpdateProfileView(GenericAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Perfil atualizado.", "user": serializer.data})


# ================================================================
# 🔹 CHANGE PASSWORD
# ================================================================
class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not request.user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Senha antiga incorreta."}, status=400)

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()

        return Response({"message": "Senha alterada com sucesso!"})


# ================================================================
# 🔹 SWAGGER SAFE QUERYSET
# ================================================================
def safe_queryset(self, Model):
    if getattr(self, "swagger_fake_view", False):
        return Model.objects.none()
    if not self.request or not self.request.user.is_authenticated:
        return Model.objects.none()
    return Model.objects.filter(owner=self.request.user)


# ================================================================
# 🔹 VIEWSETS
# ================================================================
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

    # ============================================================
    # 🔥 MÉTODO RECENT — necessário para o FRONTEND
    # ============================================================
    def recent(self, request):
        qs = self.get_queryset().order_by("-date")[:5]

        data = [
            {
                "description": tx.description,
                "account": tx.account.name,
                "category": tx.category.name,
                "type": tx.type,
                "amount": tx.amount,
                "date": tx.date,
            }
            for tx in qs
        ]

        return Response(data)


# ================================================================
# 🔹 RELATÓRIOS
# ================================================================
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


class CategoryReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        month = int(request.query_params.get("month", datetime.now().month))
        year = int(request.query_params.get("year", datetime.now().year))

        qs = Transaction.objects.filter(owner=request.user, date__month=month, date__year=year)

        categories = Category.objects.filter(owner=request.user)
        data = {}

        for c in categories:
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

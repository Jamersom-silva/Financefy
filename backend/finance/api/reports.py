# backend/finance/api/reports.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from drf_spectacular.utils import extend_schema
from ..services import recent_transactions_report


@extend_schema(
    tags=["Relatórios"],
    summary="Últimas Transações",
    description="Retorna as últimas transações do usuário autenticado (limitado a 5).",
)
class RecentTransactionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = recent_transactions_report(request.user, limit=5)
        return Response(data)

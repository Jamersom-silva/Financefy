from decimal import Decimal
from datetime import datetime
from django.db.models import Sum
from collections import defaultdict
from calendar import month_name
from .models import Account, Transaction, Category


# ================================================================
# 🔹 ATUALIZA O SALDO DA CONTA AUTOMATICAMENTE
# ================================================================
def update_account_balance(account: Account) -> None:
    """
    Recalcula o saldo atual da conta com base em todas as transações associadas.
    """

    income_total = (
        Transaction.objects.filter(account=account, type="income")
        .aggregate(total=Sum("amount"))
        .get("total") or Decimal("0.00")
    )

    expense_total = (
        Transaction.objects.filter(account=account, type="expense")
        .aggregate(total=Sum("amount"))
        .get("total") or Decimal("0.00")
    )

    new_balance = account.initial_balance + income_total - expense_total
    account.current_balance = new_balance
    account.save(update_fields=["current_balance"])


# ================================================================
# 🔹 RELATÓRIO MENSAL (para gráfico de linha)
# ================================================================
def monthly_report(user, month=None, year=None) -> dict:
    """
    Retorna um resumo financeiro agregado por mês (usado no gráfico de linha).
    Retorna todos os meses do ano, mesmo que não haja transações.
    """

    if not year:
        year = datetime.now().year

    transactions = Transaction.objects.filter(owner=user, date__year=year)

    monthly_data = defaultdict(lambda: {"income": Decimal("0.00"), "expense": Decimal("0.00"), "balance": Decimal("0.00")})
    total_income = Decimal("0.00")
    total_expense = Decimal("0.00")

    for m in range(1, 13):
        tx = transactions.filter(date__month=m)
        income = tx.filter(type="income").aggregate(total=Sum("amount")).get("total") or Decimal("0.00")
        expense = tx.filter(type="expense").aggregate(total=Sum("amount")).get("total") or Decimal("0.00")
        balance = income - expense

        monthly_data[month_name[m]]["income"] = income
        monthly_data[month_name[m]]["expense"] = expense
        monthly_data[month_name[m]]["balance"] = balance

        total_income += income
        total_expense += expense

    return {
        "year": year,
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "balance": float(total_income - total_expense),
        "monthly_data": dict(monthly_data),
    }


# ================================================================
# 🔹 RELATÓRIO POR CATEGORIA (para gráfico de pizza)
# ================================================================
def category_report(user, month=None, year=None) -> dict:
    """
    Retorna soma das despesas agrupadas por categoria.
    Usado no gráfico de pizza.
    """

    if not month:
        month = datetime.now().month
    if not year:
        year = datetime.now().year

    qs = Transaction.objects.filter(owner=user, type="expense", date__year=year, date__month=month)

    data = (
        qs.values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    return {
        "month": month,
        "year": year,
        "expenses_by_category": {
            item["category__name"] if item["category__name"] else "Uncategorized": float(item["total"]) for item in data
        },
    }


# ================================================================
# 🔹 RELATÓRIO DE ÚLTIMAS TRANSAÇÕES (opcional, para tabela no dashboard)
# ================================================================
def recent_transactions_report(user, limit=5) -> list:
    """
    Retorna as últimas transações do usuário, para o painel inicial.
    """
    transactions = (
        Transaction.objects.filter(owner=user)
        .select_related("account", "category")
        .order_by("-date")[:limit]
    )

    return [
        {
            "description": tx.description,
            "account": tx.account.name,
            "category": tx.category.name if tx.category else "Sem categoria",
            "type": tx.type,
            "amount": float(tx.amount),
            "date": tx.date.strftime("%Y-%m-%d"),
        }
        for tx in transactions
    ]

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class FinanceAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")
        self.accounts_url = "/api/v1/accounts/"
        self.categories_url = "/api/v1/categories/"
        self.transactions_url = "/api/v1/transactions/"
        self.report_monthly_url = "/api/v1/reports/monthly/"

        # cria usuário e obtém token
        payload = {"username": "jamersom", "email": "j@j.com", "password": "12345"}
        res = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.access = res.data["access"]

    def auth(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_full_flow(self):
        self.auth()
        # cria conta
        res = self.client.post(self.accounts_url, {"name": "Banco Inter", "initial_balance": 3000}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        account_id = res.data["id"]

        # cria categoria
        res = self.client.post(self.categories_url, {"name": "Salário", "type": "income"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        category_id = res.data["id"]

        # cria transação (income)
        res = self.client.post(self.transactions_url, {
            "description": "Recebimento",
            "amount": 3000,
            "type": "income",
            "account": account_id,
            "category": category_id,
            "date": "2025-10-29"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # relatório mensal
        res = self.client.get(self.report_monthly_url + "?month=10&year=2025")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(float(res.data["income"]), 3000.0)

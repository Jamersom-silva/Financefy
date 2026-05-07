from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class FinanceAPITests(APITestCase):
    def setUp(self):
        # 🔹 URLs corrigidas (batem com seu urls.py)
        self.register_url = reverse("auth-register")

        self.accounts_url = "/api/v1/accounts/"
        self.categories_url = "/api/v1/categories/"
        self.transactions_url = "/api/v1/transactions/"
        self.report_monthly_url = "/api/v1/reports/monthly/"

        # 🔹 cria usuário (senha válida para validação do Django)
        payload = {
            "username": "jamersom",
            "email": "j@j.com",
            "password": "Test@12345"
        }

        res = self.client.post(self.register_url, payload, format="json")

        # debug útil caso falhe novamente
        if res.status_code != status.HTTP_201_CREATED:
            print("REGISTER ERROR RESPONSE:", res.data)

        # garante que o registro funcionou
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # token retornado pelo backend
        self.access = res.data.get("access")
        self.assertIsNotNone(self.access)

    def auth(self):
        # autenticação com JWT
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_full_flow(self):
        self.auth()

        # cria conta
        res = self.client.post(
            self.accounts_url,
            {"name": "Banco Inter", "initial_balance": 3000},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        account_id = res.data["id"]

        # cria categoria
        res = self.client.post(
            self.categories_url,
            {"name": "Salário", "type": "income"},
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        category_id = res.data["id"]

        # cria transação
        res = self.client.post(
            self.transactions_url,
            {
                "description": "Recebimento",
                "amount": 3000,
                "type": "income",
                "account": account_id,
                "category": category_id,
                "date": "2025-10-29"
            },
            format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # relatório mensal
        res = self.client.get(self.report_monthly_url + "?month=10&year=2025")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # aceita float ou int do backend
        self.assertEqual(float(res.data["total_income"]), 3000.0)
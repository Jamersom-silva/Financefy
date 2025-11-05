from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# ================================================================
# 🔹 CONTA
# ================================================================
class Account(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField("Nome da conta", max_length=120)
    initial_balance = models.DecimalField("Saldo inicial", max_digits=12, decimal_places=2, default=0)
    current_balance = models.DecimalField("Saldo atual", max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField("Criado em", auto_now_add=True)

    class Meta:
        verbose_name = "Conta"
        verbose_name_plural = "Contas"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


# ================================================================
# 🔹 CATEGORIA
# ================================================================
class Category(models.Model):
    TYPE_CHOICES = (
        ("income", "Receita"),
        ("expense", "Despesa"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField("Nome da categoria", max_length=120)
    type = models.CharField("Tipo", max_length=7, choices=TYPE_CHOICES)
    created_at = models.DateTimeField("Criado em", auto_now_add=True)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "name", "type"],
                name="unique_category_per_user_and_type"
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.type})"


# ================================================================
# 🔹 TRANSAÇÃO
# ================================================================
class Transaction(models.Model):
    TYPE_CHOICES = (
        ("income", "Receita"),
        ("expense", "Despesa"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="transactions")
    description = models.CharField("Descrição", max_length=255)
    amount = models.DecimalField("Valor", max_digits=12, decimal_places=2)
    type = models.CharField("Tipo", max_length=7, choices=TYPE_CHOICES)
    date = models.DateField("Data")
    created_at = models.DateTimeField("Criado em", auto_now_add=True)

    class Meta:
        verbose_name = "Transação"
        verbose_name_plural = "Transações"
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"{self.description} ({self.get_type_display()} R$ {self.amount:.2f})"


# ================================================================
# 🔹 GRUPO DE ANEXOS (ex: Nubank, Água, Internet)
# ================================================================
class AttachmentGroup(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attachment_groups")
    name = models.CharField("Nome do grupo", max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Grupo de anexos"
        verbose_name_plural = "Grupos de anexos"
        ordering = ["name"]

    def __str__(self):
        return self.name


# ================================================================
# 🔹 REGISTRO MENSAL (ex: Janeiro 2025 dentro de Nubank)
# ================================================================
class AttachmentRecord(models.Model):
    group = models.ForeignKey(AttachmentGroup, on_delete=models.CASCADE, related_name="records")
    month = models.IntegerField("Mês", choices=[(i, i) for i in range(1, 13)])
    year = models.IntegerField("Ano")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Registro Mensal"
        verbose_name_plural = "Registros Mensais"
        unique_together = ("group", "month", "year")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.group.name} — {self.month:02d}/{self.year}"


# ================================================================
# 🔹 ARQUIVO (Fatura / Comprovante)
# ================================================================
class Attachment(models.Model):
    TYPE_CHOICES = (
        ("invoice", "Fatura"),
        ("receipt", "Comprovante"),
    )

    record = models.ForeignKey(
        AttachmentRecord,
        on_delete=models.CASCADE,
        related_name="attachments",
        null=True,      # ✅ Temporário para permitir migração SEM perder dados
        blank=True
    )

    name = models.CharField("Nome do arquivo", max_length=255)
    type = models.CharField("Tipo", max_length=20, choices=TYPE_CHOICES)
    file = models.FileField("Arquivo PDF", upload_to="attachments/")
    uploaded_at = models.DateTimeField("Enviado em", auto_now_add=True)

    class Meta:
        verbose_name = "Anexo"
        verbose_name_plural = "Anexos"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} — {self.get_type_display()}"

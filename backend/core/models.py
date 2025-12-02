# ================================================================
#  FINANCEFY — MODELS.PY COMPLETO E ATUALIZADO
# ================================================================

import uuid
from pathlib import Path
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

# ================================================================
# 🔹 FUNÇÃO PARA UPLOAD SEGURO DE PDF (nome aleatório)
# ================================================================

def attachment_upload_path(instance, filename):
    ext = Path(filename).suffix.lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    return f"attachments/{filename}"


# ================================================================
# 🔹 MODELO: CONTA
# ================================================================

class Account(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(_("Nome da conta"), max_length=120)
    initial_balance = models.DecimalField(_("Saldo inicial"), max_digits=12, decimal_places=2, default=0)
    current_balance = models.DecimalField(_("Saldo atual"), max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(_("Criado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("Conta")
        verbose_name_plural = _("Contas")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.owner.username})"


# ================================================================
# 🔹 MODELO: CATEGORIA
# ================================================================

class Category(models.Model):
    TYPE_CHOICES = (
        ("income", "Receita"),
        ("expense", "Despesa"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(_("Nome da categoria"), max_length=120)
    type = models.CharField(_("Tipo"), max_length=7, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(_("Criado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("Categoria")
        verbose_name_plural = _("Categorias")
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
# 🔹 MODELO: TRANSAÇÃO
# ================================================================

class Transaction(models.Model):
    TYPE_CHOICES = (
        ("income", "Receita"),
        ("expense", "Despesa"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="transactions")
    description = models.CharField(_("Descrição"), max_length=255)
    amount = models.DecimalField(_("Valor"), max_digits=12, decimal_places=2)
    type = models.CharField(_("Tipo"), max_length=7, choices=TYPE_CHOICES)
    date = models.DateField(_("Data"))
    created_at = models.DateTimeField(_("Criado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("Transação")
        verbose_name_plural = _("Transações")
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"{self.description} ({self.get_type_display()} R$ {self.amount:.2f})"


# ================================================================
# 🔹 MODELO: GRUPO DE ANEXOS
# Exemplo: Nubank, Light, Internet, etc.
# ================================================================

class AttachmentGroup(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attachment_groups")
    name = models.CharField(_("Nome do grupo"), max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Grupo de anexos")
        verbose_name_plural = _("Grupos de anexos")
        ordering = ["name"]

    def __str__(self):
        return self.name


# ================================================================
# 🔹 MODELO: REGISTRO MENSAL
# Exemplo: Janeiro/2025 dentro do grupo Nubank
# ================================================================

class AttachmentRecord(models.Model):
    group = models.ForeignKey(AttachmentGroup, on_delete=models.CASCADE, related_name="records")
    month = models.IntegerField(_("Mês"), choices=[(i, i) for i in range(1, 13)])
    year = models.IntegerField(_("Ano"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Registro Mensal")
        verbose_name_plural = _("Registros Mensais")
        unique_together = ("group", "month", "year")
        ordering = ["-year", "-month"]

    def __str__(self):
        return f"{self.group.name} — {self.month:02d}/{self.year}"


# ================================================================
# 🔹 MODELO: ANEXO (FATURA / COMPROVANTE)
# ================================================================

class Attachment(models.Model):
    TYPE_CHOICES = (
        ("invoice", "Fatura"),
        ("receipt", "Comprovante"),
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attachments")

    record = models.ForeignKey(
        AttachmentRecord,
        on_delete=models.CASCADE,
        related_name="attachments",
        null=True,
        blank=True
    )

    name = models.CharField(_("Nome do arquivo"), max_length=255)
    type = models.CharField(_("Tipo"), max_length=20, choices=TYPE_CHOICES)
    file = models.FileField(_("Arquivo PDF"), upload_to=attachment_upload_path)
    uploaded_at = models.DateTimeField(_("Enviado em"), auto_now_add=True)

    class Meta:
        verbose_name = _("Anexo")
        verbose_name_plural = _("Anexos")
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} — {self.get_type_display()}"

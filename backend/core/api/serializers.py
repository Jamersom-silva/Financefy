from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Account, Category, Transaction, Attachment


# ================================================================
# 🔹 REGISTRO DE USUÁRIO
# ================================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=5)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        """Cria novo usuário com senha criptografada"""
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )


# ================================================================
# 🔹 CONTAS
# ================================================================
class AccountSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Account
        fields = [
            "id",
            "name",
            "initial_balance",
            "current_balance",
            "created_at",
            "owner",
        ]
        read_only_fields = ["id", "created_at", "owner", "current_balance"]

    def validate_initial_balance(self, value):
        """Impede criação de contas com saldo negativo"""
        if value < 0:
            raise serializers.ValidationError("O saldo inicial não pode ser negativo.")
        return value


# ================================================================
# 🔹 CATEGORIAS
# ================================================================
class CategorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Category
        fields = ["id", "name", "type", "owner", "created_at"]
        read_only_fields = ["id", "owner", "created_at"]

    def validate_name(self, value):
        """Garante nomes de categoria com pelo menos 2 caracteres"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("O nome da categoria deve ter pelo menos 2 caracteres.")
        return value


# ================================================================
# 🔹 TRANSAÇÕES (CORRIGIDO E APRIMORADO)
# ================================================================
class TransactionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    account_name = serializers.ReadOnlyField(source="account.name")
    category_name = serializers.ReadOnlyField(source="category.name")

    # ✅ Permite enviar apenas IDs no POST/PUT
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Transaction
        fields = [
            "id",
            "owner",
            "account",
            "account_name",
            "category",
            "category_name",
            "description",
            "amount",
            "type",
            "date",
            "created_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "account_name", "category_name"]

    # =======================
    # 🔸 Validações
    # =======================
    def validate_amount(self, value):
        """Valor precisa ser positivo"""
        if value <= 0:
            raise serializers.ValidationError("O valor da transação deve ser positivo.")
        return value

    def validate(self, data):
        """Categoria e transação devem ter o mesmo tipo"""
        if data["category"].type != data["type"]:
            raise serializers.ValidationError(
                "O tipo da categoria e da transação devem ser iguais (ex: receita/despesa)."
            )
        return data

    def validate_account(self, value):
        """Garante que a conta pertence ao usuário logado"""
        user = self.context["request"].user
        if value.owner != user:
            raise serializers.ValidationError("Essa conta não pertence ao usuário atual.")
        return value

    def validate_category(self, value):
        """Garante que a categoria pertence ao usuário logado"""
        user = self.context["request"].user
        if value.owner != user:
            raise serializers.ValidationError("Essa categoria não pertence ao usuário atual.")
        return value


# ================================================================
# 🔹 PERFIL DO USUÁRIO
# ================================================================
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]

    def validate_username(self, value):
        """Valida tamanho mínimo do nome de usuário"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("O nome de usuário deve ter pelo menos 3 caracteres.")
        return value


# ================================================================
# 🔹 ALTERAÇÃO DE SENHA
# ================================================================
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=5)

    def validate_new_password(self, value):
        """Valida comprimento mínimo da nova senha"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("A nova senha deve ter pelo menos 5 caracteres.")
        return value


# ================================================================
# 🔹 ANEXOS (PDFs de Faturas e Comprovantes)
# ================================================================
class AttachmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Attachment
        fields = [
            "id",
            "owner",
            "name",
            "type",
            "file",
            "uploaded_at",
        ]
        read_only_fields = ["id", "owner", "uploaded_at"]

    # =======================
    # 🔸 Validações
    # =======================
    def validate_file(self, value):
        """Aceita apenas PDFs e limita o tamanho"""
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Somente arquivos PDF são permitidos.")
        if value.size > 5 * 1024 * 1024:  # 5 MB
            raise serializers.ValidationError("O arquivo não pode ultrapassar 5 MB.")
        return value

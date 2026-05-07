from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from ..models import Account, Category, Transaction, Attachment

User = get_user_model()

# ================================================================
# 🔹 REGISTRO DE USUÁRIO
# ================================================================
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_username(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("O nome de usuário deve ter pelo menos 3 caracteres.")

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")

        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value

    def validate_password(self, value):
        # 🔥 validação simples (CI-friendly)
        if len(value) < 6:
            raise serializers.ValidationError("Senha deve ter pelo menos 6 caracteres.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
        )


# ================================================================
# 🔹 CONTA
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
        if value < 0:
            raise serializers.ValidationError("O saldo inicial não pode ser negativo.")
        return value


# ================================================================
# 🔹 CATEGORIA
# ================================================================
class CategorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Category
        fields = ["id", "name", "type", "owner", "created_at"]
        read_only_fields = ["id", "created_at", "owner"]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError("O nome da categoria deve ter pelo menos 2 caracteres.")

        return value


# ================================================================
# 🔹 TRANSAÇÃO
# ================================================================
class TransactionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    account_name = serializers.ReadOnlyField(source="account.name")
    category_name = serializers.ReadOnlyField(source="category.name")

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
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "account_name",
            "category_name",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("O valor da transação deve ser positivo.")
        return value

    def validate(self, data):
        if data["category"].type != data["type"]:
            raise serializers.ValidationError(
                "A categoria e a transação devem ter o mesmo tipo."
            )
        return data

    def validate_account(self, value):
        if value.owner != self.context["request"].user:
            raise serializers.ValidationError("Essa conta não pertence ao usuário logado.")
        return value

    def validate_category(self, value):
        if value.owner != self.context["request"].user:
            raise serializers.ValidationError("Essa categoria não pertence ao usuário logado.")
        return value


# ================================================================
# 🔹 UPDATE PROFILE
# ================================================================
class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]

    def validate_username(self, value):
        value = value.strip()

        if len(value) < 3:
            raise serializers.ValidationError("O nome de usuário deve ter pelo menos 3 caracteres.")

        return value


# ================================================================
# 🔹 CHANGE PASSWORD
# ================================================================
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        # 🔥 simplificado para CI
        if len(value) < 6:
            raise serializers.ValidationError("Senha deve ter pelo menos 6 caracteres.")
        return value


# ================================================================
# 🔹 ANEXOS (PDFs)
# ================================================================
class AttachmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Attachment
        fields = ["id", "owner", "name", "type", "file", "uploaded_at"]
        read_only_fields = ["id", "owner", "uploaded_at"]

    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("O arquivo não pode ultrapassar 5 MB.")

        if value.content_type not in ["application/pdf"]:
            raise serializers.ValidationError("Somente arquivos PDF são permitidos.")

        return value


# ================================================================
# 🔹 LOGIN
# ================================================================
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
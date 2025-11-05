from rest_framework import serializers, viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from ..models import AttachmentGroup, AttachmentRecord, Attachment


# ================================================================
# 🔹 SERIALIZERS
# ================================================================
class AttachmentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttachmentGroup
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]


class AttachmentRecordSerializer(serializers.ModelSerializer):
    group_name = serializers.ReadOnlyField(source="group.name")

    class Meta:
        model = AttachmentRecord
        fields = ["id", "group", "group_name", "month", "year", "created_at"]
        read_only_fields = ["id", "group_name", "created_at"]


class AttachmentSerializer(serializers.ModelSerializer):
    record_label = serializers.ReadOnlyField(source="record.__str__")

    class Meta:
        model = Attachment
        fields = [
            "id",
            "record",
            "record_label",
            "type",
            "file",
            "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at", "record_label"]

    def validate_file(self, value):
        if not value.name.lower().endswith(".pdf"):
            raise serializers.ValidationError("Somente arquivos PDF são permitidos.")
        if value.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError("O arquivo não pode ter mais de 5MB.")
        return value


# ================================================================
# 🔹 VIEWSETS
# ================================================================
class AttachmentGroupViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AttachmentGroup.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AttachmentRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = AttachmentRecord.objects.filter(group__owner=self.request.user)
        group_id = self.request.query_params.get("group")
        if group_id:
            qs = qs.filter(group_id=group_id)
        return qs

    def perform_create(self, serializer):
        # 🔒 Evita criar registro em grupo que não é do usuário
        group = serializer.validated_data.get("group")
        if group.owner != self.request.user:
            raise PermissionDenied("Você não tem permissão para adicionar registros neste grupo.")
        serializer.save()


class AttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Attachment.objects.filter(record__group__owner=self.request.user)
        record_id = self.request.query_params.get("record")
        if record_id:
            qs = qs.filter(record_id=record_id)
        return qs

    def perform_create(self, serializer):
        # 🔒 Evita anexar arquivos em registros de outros usuários
        record = serializer.validated_data.get("record")
        if record.group.owner != self.request.user:
            raise PermissionDenied("Você não tem permissão para adicionar anexos neste registro.")
        serializer.save()

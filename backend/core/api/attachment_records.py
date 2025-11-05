# src/core/api/attachment_records.py
from rest_framework import serializers, viewsets, permissions
from ..models import AttachmentRecord, AttachmentGroup

# ================================================================
# 🔹 SERIALIZER
# ================================================================
class AttachmentRecordSerializer(serializers.ModelSerializer):
    group_name = serializers.ReadOnlyField(source="group.name")

    class Meta:
        model = AttachmentRecord
        fields = ["id", "group", "group_name", "month", "year", "created_at"]
        read_only_fields = ["id", "group_name", "created_at"]


# ================================================================
# 🔹 VIEWSET
# ================================================================
class AttachmentRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtra registros apenas do usuário + filtro por grupo (opcional)"""
        qs = AttachmentRecord.objects.filter(group__owner=self.request.user)

        group_id = self.request.query_params.get("group")
        if group_id:
            qs = qs.filter(group_id=group_id)

        return qs.order_by("-year", "-month")

    def perform_create(self, serializer):
        """Validação: garante que o grupo pertença ao usuário"""
        group = serializer.validated_data["group"]
        if group.owner != self.request.user:
            raise PermissionError("Este grupo não pertence ao usuário.")
        serializer.save()

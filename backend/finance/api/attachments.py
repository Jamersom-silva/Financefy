# src/core/api/attachments.py
from rest_framework import serializers, viewsets, permissions
from ..models import Attachment

# ================================================================
# 🔹 SERIALIZER
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

# ================================================================
# 🔹 VIEWSET
# ================================================================
class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Mostra apenas anexos do usuário autenticado"""
        return Attachment.objects.filter(owner=self.request.user)


    def perform_create(self, serializer):
        """Define o usuário logado como dono do anexo"""
        serializer.save(owner=self.request.user)

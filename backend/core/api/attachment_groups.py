# src/core/api/attachment_groups.py
from rest_framework import serializers, viewsets, permissions
from ..models import AttachmentGroup

# ================================================================
# 🔹 SERIALIZER
# ================================================================
class AttachmentGroupSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = AttachmentGroup
        fields = ["id", "name", "owner", "created_at"]
        read_only_fields = ["id", "owner", "created_at"]


# ================================================================
# 🔹 VIEWSET
# ================================================================
class AttachmentGroupViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Mostra apenas grupos do usuário logado"""
        return AttachmentGroup.objects.filter(owner=self.request.user).order_by("name")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

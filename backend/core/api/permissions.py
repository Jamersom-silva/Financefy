# backend/core/api/permissions.py
from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Permite acesso apenas ao dono do objeto.
    Compatível com objetos que tenham `owner` (FK) ou `owner_id`.
    """

    def has_object_permission(self, request, view, obj):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False

        # Prioriza atributo owner (FK)
        owner = getattr(obj, "owner", None)
        if owner is not None:
            # owner pode ser usuário ou id; compara de forma segura
            try:
                return owner == user or getattr(owner, "id", None) == getattr(user, "id", None)
            except Exception:
                pass

        # Fallback para field owner_id (inteiro)
        return getattr(obj, "owner_id", None) == getattr(user, "id", None)

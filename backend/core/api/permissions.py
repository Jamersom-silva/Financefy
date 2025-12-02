# backend/core/api/permissions.py
from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Permite acesso apenas ao dono do objeto.
    Funciona com modelos que tenham:
        - atributo `owner` (User ou FK para User)
        - OU atributo `owner_id`
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Se o objeto tem "owner", priorizamos esse campo
        if hasattr(obj, "owner"):
            owner = obj.owner

            # owner pode ser:
            # - instância de User
            # - FK que retorna um User
            # - valor None
            if owner:
                if owner == user:
                    return True

                # fallback caso owner seja um SimpleLazyObject
                if getattr(owner, "id", None) == user.id:
                    return True

        # Fallback seguro: compara owner_id se existir
        if hasattr(obj, "owner_id"):
            return obj.owner_id == user.id

        # Se o objeto não tem owner nem owner_id, NÃO permitimos
        return False

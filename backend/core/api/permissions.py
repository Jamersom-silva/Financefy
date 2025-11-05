from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Garante que apenas o dono do objeto possa acessá-lo.
    """

    def has_object_permission(self, request, view, obj):
        return getattr(obj, "owner_id", None) == getattr(request.user, "id", None)

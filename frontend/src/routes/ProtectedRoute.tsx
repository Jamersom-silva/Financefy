import type { ReactNode, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): ReactElement {
  const { accessToken, loading } = useAuth();

  // ⏳ Aguarda o AuthProvider carregar o usuário e token
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Verificando sessão...
      </div>
    );
  }

  // 🔐 Sem token → redireciona para login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Autenticado → libera acesso
  return children as ReactElement;
}

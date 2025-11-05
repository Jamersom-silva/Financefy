import { ReactNode, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protege páginas que exigem autenticação.
 * Aguarda o AuthContext carregar o token antes de renderizar.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps): ReactElement {
  const { token, loading } = useAuth();

  // ⏳ Enquanto o contexto ainda está carregando o token do localStorage
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Verificando sessão...
      </div>
    );
  }

  // 🔐 Se o token não existir → redireciona pro login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Se estiver autenticado → renderiza o conteúdo
  return children as ReactElement;
}

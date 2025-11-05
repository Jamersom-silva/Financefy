// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextBase";

/**
 * 🔹 Hook seguro para consumir o AuthContext
 * Garante que o hook só pode ser usado dentro de <AuthProvider>
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }

  return context;
}

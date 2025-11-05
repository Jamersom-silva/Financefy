// src/context/AuthContextBase.ts
import { createContext } from "react";

/**
 * 🔹 Estrutura do usuário autenticado
 */
export type User = {
  id: number;
  username: string;
  email?: string;
};

/**
 * 🔹 Estrutura de dados do contexto de autenticação
 */
export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (payload: { user: User | null; token: string | null }) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
};

/**
 * 🔹 Contexto de autenticação global
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

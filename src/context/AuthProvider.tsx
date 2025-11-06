// src/context/AuthProvider.tsx
import { useEffect, useState, ReactNode } from "react";
import { toast } from "react-hot-toast";
import { AuthContext, User } from "./AuthContextBase";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restaurar sessão
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // 🔹 Atualiza estado e localStorage
  const setAuth = ({ user, token }: { user: User | null; token: string | null }) => {
    setUser(user);
    setToken(token);

    if (user && token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  // 🔹 Login
  const login = (token: string, user: User) => {
    setAuth({ user, token });
    toast.success(`Bem-vindo(a), ${user.username}!`);
  };

  // 🔹 Logout
  const logout = () => {
    setAuth({ user: null, token: null });
    toast.success("Logout realizado!");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setAuth, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

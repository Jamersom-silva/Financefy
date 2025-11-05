import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null | undefined;
  user: { username: string } | null;
  login: (token: string, user: { username: string }) => void;
  logout: () => void;
  loading: boolean; // 👈 novo campo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true); // 👈 novo estado

  // ✅ Carregar token do localStorage quando o app inicia
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    else setToken(null);

    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false); // 👈 terminou de carregar
  }, []);

  const login = (newToken: string, newUser: { username: string }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}

// financefy-web/src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id?: number;
  username?: string;
  email?: string;
} | null;

type AuthContextType = {
  user: User;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE =process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1";

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Persist access token in localStorage so api.ts (if using localStorage) can read it.
  function saveToken(token: string | null) {
    setAccessToken(token);
    try {
      if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
      else localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
  }

  function saveUser(u: User) {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore storage errors
    }
  }

  // Try silent refresh on app start (uses HttpOnly refresh cookie)
  useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken();
        // If refresh returned an access token, try to restore user from localStorage
        const rawUser = localStorage.getItem(STORAGE_USER_KEY);
        if (rawUser) {
          setUser(JSON.parse(rawUser));
        }
      } catch {
        // ensure clean state if refresh fails
        saveToken(null);
        saveUser(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login: calls backend /auth/login/ and expects { access, user } and sets refresh cookie
  async function login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important: allow server to set refresh cookie
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err?.detail || "Falha no login");
    }

    const data = await res.json();
    if (!data || !data.access) throw new Error("Resposta inválida do servidor");

    saveToken(data.access);
    saveUser(data.user || null);
    setLoading(false);
  }

  // Refresh: calls backend /auth/refresh/ which reads refresh token cookie and returns new access
  async function refreshAccessToken() {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      credentials: "include", // send cookies so backend can read HttpOnly refresh
    });

    if (!res.ok) {
      const err = await safeJson(res);
      throw new Error(err?.detail || "Não foi possível renovar o token");
    }

    const data = await res.json();
    if (!data || !data.access) throw new Error("Resposta inválida ao renovar token");

    saveToken(data.access);
  }

  // Logout: calls backend logout which blacklists refresh and removes cookie
  async function logout() {
    try {
      await fetch(`${API_BASE}/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    } finally {
      saveToken(null);
      saveUser(null);
    }
  }

  // Utility: safe parse JSON from response
  async function safeJson(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    loading,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

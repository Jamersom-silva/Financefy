/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------
// 🌐 API BASE (DEV + PROD)
// ---------------------------------------------------------------
const API_BASE = (import.meta.env.VITE_API_BASE_URL ??
  "http://127.0.0.1:8000/api/v1"
).replace(/\/$/, "");

function apiUrl(path: string) {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

// ---------------------------------------------------------------
// 💾 STORAGE
// ---------------------------------------------------------------
const STORAGE_TOKEN = "token";
const STORAGE_USER = "user";

// ---------------------------------------------------------------
// 🧠 JSON SAFE PARSE
// ---------------------------------------------------------------
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// ===============================================================
// 🚀 AUTH PROVIDER
// ===============================================================
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------
  // 🔐 SET SESSION
  // ---------------------------------------------------------------
  const setSession = useCallback((access: string | null, userData: User | null) => {
    setAccessToken(access);
    setUser(userData);

    if (access) localStorage.setItem(STORAGE_TOKEN, access);
    else localStorage.removeItem(STORAGE_TOKEN);

    if (userData) localStorage.setItem(STORAGE_USER, JSON.stringify(userData));
    else localStorage.removeItem(STORAGE_USER);
  }, []);

  // ---------------------------------------------------------------
  // 🔄 REFRESH TOKEN (COOKIE HTTPONLY)
  // ---------------------------------------------------------------
  const refreshAccessToken = useCallback(async () => {
    const url = apiUrl("/auth/refresh/");
    console.log("[Auth] refreshAccessToken ->", url);

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      const data = await safeJson(res);

      if (!res.ok || !data?.access) {
        throw new Error("Refresh falhou");
      }

      setAccessToken(data.access);
      localStorage.setItem(STORAGE_TOKEN, data.access);

    } catch (err) {
      console.warn("[Auth] refresh falhou:", err);
      setSession(null, null);
      throw err;
    }
  }, []);

  // ---------------------------------------------------------------
  // 🔐 LOGIN
  // ---------------------------------------------------------------
  const login = useCallback(async (username: string, password: string) => {
    const url = apiUrl("/auth/login/");
    console.log("[Auth] login ->", url);

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await safeJson(res);

    if (!res.ok) {
      throw new Error(data?.detail || "Erro ao fazer login.");
    }

    if (!data?.access || !data?.user) {
      throw new Error("Resposta inválida do servidor.");
    }

    setSession(data.access, data.user);
  }, []);

  // ---------------------------------------------------------------
  // 🧾 REGISTER
  // ---------------------------------------------------------------
  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const url = apiUrl("/auth/register/");
      console.log("[Auth] register ->", url);

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          data?.email?.[0] ||
          data?.username?.[0] ||
          data?.password?.[0] ||
          data?.detail ||
          "Erro ao registrar.";
        throw new Error(msg);
      }

      if (!data?.access || !data?.user) {
        throw new Error("Resposta inválida do servidor.");
      }

      setSession(data.access, data.user);
    },
    []
  );

  // ---------------------------------------------------------------
  // 🚪 LOGOUT
  // ---------------------------------------------------------------
  const logout = useCallback(async () => {
    const url = apiUrl("/auth/logout/");

    try {
      await fetch(url, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }

    setSession(null, null);
  }, []);

  // ---------------------------------------------------------------
  // ⚡ AUTO LOGIN (SILENT REFRESH)
  // ---------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken();

        const raw = localStorage.getItem(STORAGE_USER);
        if (raw) setUser(JSON.parse(raw));

      } catch {
        setSession(null, null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------------
// 🧠 HOOK
// ---------------------------------------------------------------
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
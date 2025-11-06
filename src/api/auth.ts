// src/api/auth.ts
const API_URL = "http://127.0.0.1:8000/api/v1/auth";

/**
 * 🔐 Login do usuário (JWT)
 */
export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => {
    throw new Error("Erro inesperado ao tentar logar.");
  });

  if (!res.ok) {
    const message = data?.detail || "Usuário ou senha inválidos.";
    throw new Error(message);
  }

  if (!data.access || !data.user) {
    throw new Error("Resposta inválida do servidor.");
  }

  return data; // ✅ Retorna { user, access, refresh }
}

/**
 * 🧾 Registro de novo usuário
 */
export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json().catch(() => {
    throw new Error("Erro inesperado ao registrar usuário.");
  });

  if (!res.ok) {
    const message =
      data?.email?.[0] || data?.username?.[0] || data?.detail || "Erro ao registrar usuário.";
    throw new Error(message);
  }

  return data; // ✅ Pode retornar { user, access, refresh }
}

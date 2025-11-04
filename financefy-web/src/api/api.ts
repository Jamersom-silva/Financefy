// ===============================================================
// 🔹 src/api/api.ts
// Centraliza todas as chamadas à API do backend Django REST Framework
// com suporte a token JWT, tratamento de erros e upload de arquivos.
// ===============================================================

import { toast } from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

/**
 * 🔹 Retorna headers com token JWT, se existir
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * 🔹 Helper: verifica se é um objeto válido
 */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/**
 * 🔹 Trata respostas de erro do backend (400–500)
 */
async function handleErrorResponse(res: Response): Promise<never> {
  let message = `Erro ${res.status}: ${res.statusText}`;

  try {
    const data = await res.json();
    if (isRecord(data)) {
      if ("detail" in data) {
        message = String(data.detail);
      } else {
        message = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join(" | ");
      }
    }
  } catch {
    const text = await res.text();
    if (text) message = text;
  }

  // ⚠️ Tratamento específico para token expirado ou inválido
  if (res.status === 401) {
    toast.error("⚠️ Sessão expirada. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "/login";
  } else {
    toast.error(message);
  }

  throw new Error(message);
}

/**
 * 🔹 GET genérico (lista ou detalhe)
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  token?: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeaders()) },
  });

  if (!res.ok) await handleErrorResponse(res);
  return (await res.json()) as T;
}

/**
 * 🔹 POST / PUT / DELETE genérico (com suporte a FormData)
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  body?: Record<string, unknown> | FormData,
  isMultipart = false,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!isMultipart) headers["Content-Type"] = "application/json";
  Object.assign(headers, token ? { Authorization: `Bearer ${token}` } : getAuthHeaders());

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isMultipart ? (body as FormData) : body ? JSON.stringify(body) : null,
  });

  if (!res.ok) await handleErrorResponse(res);

  if (res.status === 204 || method === "DELETE") {
    toast.success("Operação concluída com sucesso!");
    return {} as T;
  }

  try {
    const data = (await res.json()) as T;
    if (method === "POST") toast.success("Registro criado com sucesso!");
    if (method === "PUT") toast.success("Registro atualizado com sucesso!");
    return data;
  } catch {
    toast.success("Operação concluída!");
    return {} as T;
  }
}

/**
 * 🔹 Upload direto (mantido por compatibilidade)
 */
export async function apiUpload<T = unknown>(
  endpoint: string,
  file: File,
  fieldName = "file"
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  return apiRequest<T>(endpoint, "POST", formData, true);
}

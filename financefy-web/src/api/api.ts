// ===============================================================
// 🔹 src/api/api.ts — Cliente HTTP centralizado
// ===============================================================

import { toast } from "react-hot-toast";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

/**
 * --------------------------------------------------------------
 * 🔹 Pega o token salvo no localStorage
 * --------------------------------------------------------------
 */
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * --------------------------------------------------------------
 * 🔹 Checa se é um objeto
 * --------------------------------------------------------------
 */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/**
 * --------------------------------------------------------------
 * 🔹 Tratamento centralizado de erros HTTP
 * --------------------------------------------------------------
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
          .map(
            ([key, val]) =>
              `${key}: ${Array.isArray(val) ? val.join(", ") : val}`
          )
          .join(" | ");
      }
    }
  } catch {
    const text = await res.text();
    if (text) message = text;
  }

  // Sessão expirada → logout automático
  if (res.status === 401) {
    toast.error("⚠️ Sessão expirada. Faça login novamente.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  } else {
    toast.error(message);
  }

  throw new Error(message);
}

/**
 * --------------------------------------------------------------
 * 🔹 GET genérico
 * --------------------------------------------------------------
 */
export async function apiGet<T = unknown>(
  endpoint: string
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) await handleErrorResponse(res);
  return (await res.json()) as T;
}

/**
 * --------------------------------------------------------------
 * 🔹 POST / PUT / DELETE genérico
 * --------------------------------------------------------------
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  body?: Record<string, unknown> | FormData,
  isMultipart = false
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!isMultipart) headers["Content-Type"] = "application/json";

  Object.assign(headers, getAuthHeaders());

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isMultipart ? (body as FormData) : body ? JSON.stringify(body) : null,
  });

  if (!res.ok) await handleErrorResponse(res);

  // DELETE → retorna vazio
  if (res.status === 204 || method === "DELETE") {
    toast.success("Operação concluída!");
    return {} as T;
  }

  try {
    const data = (await res.json()) as T;

    if (method === "POST") toast.success("Criado com sucesso!");
    if (method === "PUT") toast.success("Atualizado com sucesso!");

    return data;
  } catch {
    toast.success("Operação realizada!");
    return {} as T;
  }
}

/**
 * --------------------------------------------------------------
 * 🔹 Upload de arquivos (PDFs, Imagens etc.)
 * --------------------------------------------------------------
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

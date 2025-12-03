// src/api/api.ts

import { toast } from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

async function handleErrorResponse(res: Response): Promise<never> {
  let message = `Erro ${res.status}: ${res.statusText}`;

  try {
    const data = await res.json();
    if (isRecord(data)) {
      if ("detail" in data) {
        message = String(data.detail);
      } else {
        message = Object.entries(data)
          .map(([key, val]) =>
            `${key}: ${Array.isArray(val) ? val.join(", ") : val}`
          )
          .join(" | ");
      }
    }
  } catch {
    const text = await res.text();
    if (text) message = text;
  }

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

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) await handleErrorResponse(res);
  return (await res.json()) as T;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  body?: Record<string, unknown> | FormData,
  isMultipart = false
): Promise<T> {
  const headers: Record<string, string> = {};

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  Object.assign(headers, getAuthHeaders());

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: "include",
    headers,
    body: isMultipart ? (body as FormData) : body ? JSON.stringify(body) : null,
  });

  if (!res.ok) await handleErrorResponse(res);

  if (res.status === 204 || method === "DELETE") {
    return {} as T;
  }

  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

export async function apiUpload<T = unknown>(
  endpoint: string,
  file: File,
  fieldName = "file"
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  return apiRequest<T>(endpoint, "POST", formData, true);
}

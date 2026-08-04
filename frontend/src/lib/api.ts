const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  status: number;
};

export type ApiError = {
  success: false;
  message: string;
  errors: Record<string, string[]> | null;
  status: number;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

type RequestOptions = RequestInit & { token?: string };

async function request<T>(path: string, { token, ...options }: RequestOptions = {}): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const body = (await response.json().catch(() => null)) as Omit<ApiResult<T>, "status"> | null;

    if (body) {
      return { ...body, status: response.status } as ApiResult<T>;
    }

    return {
      success: false,
      message: "Sunucudan geçersiz bir yanıt alındı.",
      errors: null,
      status: response.status,
    };
  } catch {
    return {
      success: false,
      message: "Sunucuya bağlanılamadı, lütfen internet bağlantınızı kontrol edin.",
      errors: null,
      status: 0,
    };
  }
}

export function apiGet<T>(path: string, token?: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "GET", token });
}

export function apiPost<T>(path: string, payload: unknown, token?: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "POST", body: JSON.stringify(payload), token });
}

export function apiPatch<T>(path: string, payload: unknown, token?: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(payload), token });
}

export function apiPut<T>(path: string, payload: unknown, token?: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "PUT", body: JSON.stringify(payload), token });
}

export function apiDelete<T>(path: string, token?: string): Promise<ApiResult<T>> {
  return request<T>(path, { method: "DELETE", token });
}

import { apiDelete, apiGet, apiPatch, apiPost, apiPut, type ApiResult } from "./api";
import { clearAdminToken, getAdminToken } from "./adminAuth";

/**
 * Token bulunamazsa veya sunucu 401 donerse oturumu temizler; cagiran
 * bilesen (AdminGuard) bir sonraki render'da giris sayfasina yonlendirir.
 */
function handleUnauthorized<T>(result: ApiResult<T>): ApiResult<T> {
  if (!result.success && result.status === 401) {
    clearAdminToken();
  }

  return result;
}

export async function adminGet<T>(path: string): Promise<ApiResult<T>> {
  const result = await apiGet<T>(path, getAdminToken() ?? undefined);
  return handleUnauthorized(result);
}

export async function adminPost<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  const result = await apiPost<T>(path, payload, getAdminToken() ?? undefined);
  return handleUnauthorized(result);
}

export async function adminPatch<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  const result = await apiPatch<T>(path, payload, getAdminToken() ?? undefined);
  return handleUnauthorized(result);
}

export async function adminPut<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  const result = await apiPut<T>(path, payload, getAdminToken() ?? undefined);
  return handleUnauthorized(result);
}

export async function adminDelete<T>(path: string): Promise<ApiResult<T>> {
  const result = await apiDelete<T>(path, getAdminToken() ?? undefined);
  return handleUnauthorized(result);
}

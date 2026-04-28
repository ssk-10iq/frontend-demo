import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'http://localhost:3000/api/v1';

// ── Token storage ─────────────────────────────────────────────────────────────

const KEYS = { ACCESS: 'pm_access_token', REFRESH: 'pm_refresh_token' } as const;

export const tokenStore = {
  getAccess:    (): string | null => localStorage.getItem(KEYS.ACCESS),
  getRefresh:   (): string | null => localStorage.getItem(KEYS.REFRESH),
  set(access: string, refresh: string): void {
    localStorage.setItem(KEYS.ACCESS, access);
    localStorage.setItem(KEYS.REFRESH, refresh);
  },
  clear(): void {
    localStorage.removeItem(KEYS.ACCESS);
    localStorage.removeItem(KEYS.REFRESH);
  },
};

// ── Axios instance ────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: attempt a silent token refresh, then retry once.
// Uses a plain axios call (not apiClient) to avoid interceptor loops.
let refreshing: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const refreshToken = tokenStore.getRefresh();

    if (!refreshToken) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    try {
      // Deduplicate concurrent refresh calls
      if (!refreshing) {
        refreshing = axios
          .post<{ access_token: string; refresh_token: string }>(
            `${BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
          )
          .then((res) => {
            tokenStore.set(res.data.access_token, res.data.refresh_token);
            return res.data.access_token;
          })
          .finally(() => { refreshing = null; });
      }

      const newToken = await refreshing;
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch {
      tokenStore.clear();
      return Promise.reject(error);
    }
  },
);

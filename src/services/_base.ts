const API = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ?? "";

export async function apiCall<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  if (!API) {
    // No backend configured — return fallback (frontend-only mode)
    return fallback as T;
  }
  try {
    const res = await fetch(`${API}${path}`, init);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback as T;
  }
}

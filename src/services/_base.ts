const API = "http://localhost:3001";

/** Read stored JWT from Zustand persisted state in localStorage */
function getToken(): string | null {
  try {
    const stored = localStorage.getItem("voiceguard-auth");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function apiCall<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const token = getToken();

    // Build headers — inject JWT if available, but never override Content-Type for FormData
    const authHeader: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    const finalInit: RequestInit = {
      ...init,
      headers: {
        ...authHeader,
        ...(init?.headers ?? {}),
      },
    };

    const res = await fetch(`${API}${path}`, finalInit);
    if (!res.ok) {
      const body = await res.text();
      let message: string;
      try {
        const parsed = JSON.parse(body);
        message = parsed.message || parsed.error || `API ${res.status}`;
      } catch {
        message = `API ${res.status}: ${body}`;
      }
      throw new Error(message);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`API fallback used for ${path}:`, (err as Error).message);
      return fallback;
    }
    throw err;
  }
}

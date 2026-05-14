import { supabase } from "../lib/supabase";

const API = "http://localhost:3001"; // Pointing to our new Node.js backend

export async function apiCall<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const customInit: RequestInit = { ...init, headers: { ...init?.headers } };
    
    // Attach Supabase token if logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      customInit.headers = {
        ...customInit.headers,
        Authorization: `Bearer ${session.access_token}`,
      };
    }

    const res = await fetch(`${API}${path}`, customInit);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`API Error (${path}):`, err);
    return fallback as T;
  }
}

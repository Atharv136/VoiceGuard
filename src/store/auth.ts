import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id?: string;
  name: string;
  email: string;
  age: number;
  emergencyContact?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  onboardingDone: boolean;
  theme: "light" | "dark";
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  setOnboardingDone: (v: boolean) => void;
  setTheme: (t: "light" | "dark") => void;
  updateUser: (patch: Partial<User>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      onboardingDone: false,
      theme: "light",
      login: (user, token) => set({ user, accessToken: token }),
      logout: async () => {
        set({ user: null, accessToken: null, onboardingDone: false });
      },
      setOnboardingDone: (v) => set({ onboardingDone: v }),
      setTheme: (t) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
        set({ theme: t });
      },
      updateUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: "voiceguard-auth" },
  ),
);

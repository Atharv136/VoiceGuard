import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export type User = {
  id?: string;
  name: string;
  email: string;
  age: number;
  emergencyContact?: string;
};

type AuthState = {
  user: User | null;
  onboardingDone: boolean;
  theme: "light" | "dark";
  login: (user: User) => void;
  logout: () => Promise<void>;
  setOnboardingDone: (v: boolean) => void;
  setTheme: (t: "light" | "dark") => void;
  updateUser: (patch: Partial<User>) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onboardingDone: false,
      theme: "light",
      login: (user) => set({ user }),
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, onboardingDone: false });
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

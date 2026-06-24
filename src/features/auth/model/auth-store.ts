import type { UserSession } from "@entities/user/model/user.types";
import { create } from "zustand";

interface AuthState {
  session: UserSession | null;
  isAuthenticated: boolean;
  setSession: (session: UserSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  setSession: (session) => set({ session, isAuthenticated: true }),
  clearSession: () => set({ session: null, isAuthenticated: false }),
}));

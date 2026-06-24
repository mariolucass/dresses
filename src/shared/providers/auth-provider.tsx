"use client";

import type { UserSession } from "@entities/user/model/user.types";
import { seedDatabase } from "@shared/lib/seed";
import { storage, STORAGE_KEYS } from "@shared/lib/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: UserSession | null) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializa o seed de dados uma única vez
    seedDatabase();
    // Recupera a sessão salva
    const saved = storage.getItem<UserSession>(STORAGE_KEYS.SESSION);
    if (saved) {
      const isExpired = new Date(saved.expiresAt) < new Date();
      if (!isExpired) {
        setSessionState(saved);
      } else {
        storage.removeItem(STORAGE_KEYS.SESSION);
      }
    }
    setIsLoading(false);
  }, []);

  const setSession = (newSession: UserSession | null) => {
    if (newSession) {
      storage.setItem(STORAGE_KEYS.SESSION, newSession);
    } else {
      storage.removeItem(STORAGE_KEYS.SESSION);
    }
    setSessionState(newSession);
  };

  const clearSession = () => setSession(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        isLoading,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}

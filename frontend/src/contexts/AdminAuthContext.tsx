"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminGet, adminPost } from "@/lib/adminApi";
import { clearAdminToken, getAdminToken, setAdminToken } from "@/lib/adminAuth";

type AdminUser = {
  id: number;
  name: string;
  email: string;
};

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AdminAuthContextValue = {
  status: AuthStatus;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [user, setUser] = useState<AdminUser | null>(null);

  const checkSession = useCallback(async () => {
    if (!getAdminToken()) {
      setStatus("unauthenticated");
      return;
    }

    const result = await adminGet<AdminUser>("/auth/me");

    if (result.success) {
      setUser(result.data);
      setStatus("authenticated");
    } else {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta oturum kontrolu icin standart veri cekme deseni
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminPost<{ token: string; user: AdminUser }>("/auth/login", { email, password });

    if (result.success) {
      setAdminToken(result.data.token);
      setUser(result.data.user);
      setStatus("authenticated");
      return { success: true, message: result.message };
    }

    return { success: false, message: result.message };
  }, []);

  const logout = useCallback(async () => {
    await adminPost("/auth/logout", {});
    clearAdminToken();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth, AdminAuthProvider icinde kullanilmalidir.");
  }

  return context;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
      </div>
    );
  }

  return <>{children}</>;
}

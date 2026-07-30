"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, getAccessToken, isSupabaseConfigured } from "@/lib/supabase";

export type Ticket = {
  orderId: string;
  eventSlug: string;
  eventTitle: string;
  tierName: string;
  quantity: number;
  paid: number;
  date: string;
};

export type Enrolment = {
  orderId: string;
  courseSlug: string;
  courseTitle: string;
  paid: number;
  date: string;
};

export type Membership = {
  tierId: string;
  tierName: string;
  price: number;
  since: string;
  renewsAt: string;
};

export type User = {
  name: string;
  email: string;
  membership: Membership | null;
  tickets: Ticket[];
  enrolments: Enrolment[];
};

export type AuthResult = { error?: string; needsConfirmation?: boolean };

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithProvider: (provider: "google" | "azure" | "apple", next?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  cancelMembership: () => Promise<AuthResult>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const NOT_CONFIGURED =
  "Sign-in is not available yet — the site owner has not connected the authentication service (Supabase).";

type OrderRow = {
  id: string;
  kind: "ticket" | "course" | "membership";
  title: string;
  slug: string | null;
  tier: string | null;
  quantity: number;
  amount: number; // pence
  created_at: string;
  cancelled_at: string | null;
};

function deriveFromOrders(rows: OrderRow[]): Pick<User, "membership" | "tickets" | "enrolments"> {
  const tickets: Ticket[] = [];
  const enrolments: Enrolment[] = [];
  let membership: Membership | null = null;

  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  for (const r of rows) {
    if (r.kind === "ticket") {
      tickets.push({
        orderId: r.id,
        eventSlug: r.slug ?? "",
        eventTitle: r.title,
        tierName: r.tier ?? "",
        quantity: r.quantity,
        paid: Math.round(r.amount / 100),
        date: r.created_at,
      });
    } else if (r.kind === "course") {
      enrolments.push({
        orderId: r.id,
        courseSlug: r.slug ?? "",
        courseTitle: r.title,
        paid: Math.round(r.amount / 100),
        date: r.created_at,
      });
    } else if (
      r.kind === "membership" &&
      !r.cancelled_at &&
      new Date(r.created_at) > yearAgo &&
      !membership
    ) {
      const renews = new Date(r.created_at);
      renews.setFullYear(renews.getFullYear() + 1);
      membership = {
        tierId: r.slug ?? "",
        tierName: r.tier ?? r.title,
        price: Math.round(r.amount / 100),
        since: r.created_at,
        renewsAt: renews.toISOString(),
      };
    }
  }
  return { membership, tickets, enrolments };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const emailRef = useRef<string | null>(null);

  const loadOrders = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data: sessionData } = await sb.auth.getSession();
    const session = sessionData.session;
    if (!session) return;
    const { data, error } = await sb
      .from("orders")
      .select("id, kind, title, slug, tier, quantity, amount, created_at, cancelled_at")
      .order("created_at", { ascending: false });
    if (!error && data) {
      const derived = deriveFromOrders(data as OrderRow[]);
      setUser((prev) => (prev ? { ...prev, ...derived } : prev));
    }
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const applySession = (sessionUser: { email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (cancelled) return;
      if (!sessionUser?.email) {
        emailRef.current = null;
        setUser(null);
        return;
      }
      if (emailRef.current === sessionUser.email) return; // already applied
      emailRef.current = sessionUser.email;
      const meta = sessionUser.user_metadata ?? {};
      const name =
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        sessionUser.email.split("@")[0].replace(/[._]/g, " ");
      setUser({
        name,
        email: sessionUser.email,
        membership: null,
        tickets: [],
        enrolments: [],
      });
      void loadOrders();
    };

    sb.auth.getSession().then(({ data }) => {
      applySession(data.session?.user ?? null);
      if (!cancelled) setReady(true);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadOrders]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const sb = getSupabase();
    if (!sb) return { error: NOT_CONFIGURED };
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error: friendly(error.message) };
    return {};
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const sb = getSupabase();
      if (!sb) return { error: NOT_CONFIGURED };
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: friendly(error.message) };
      if (!data.session) return { needsConfirmation: true };
      return {};
    },
    []
  );

  const signInWithProvider = useCallback(
    async (provider: "google" | "azure" | "apple", next = "/dashboard"): Promise<AuthResult> => {
      const sb = getSupabase();
      if (!sb) return { error: NOT_CONFIGURED };
      const redirectTo = `${window.location.origin}${next.startsWith("/") ? next : "/dashboard"}`;
      const { error } = await sb.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          ...(provider === "azure" ? { scopes: "openid profile email" } : {}),
        },
      });
      if (error) return { error: friendly(error.message) };
      return {}; // browser redirects away
    },
    []
  );

  const logout = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    emailRef.current = null;
    setUser(null);
  }, []);

  const cancelMembership = useCallback(async (): Promise<AuthResult> => {
    const token = await getAccessToken();
    if (!token) return { error: NOT_CONFIGURED };
    const res = await fetch("/api/membership/cancel", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { error: body?.error ?? "Could not cancel membership. Please contact us." };
    }
    setUser((prev) => (prev ? { ...prev, membership: null } : prev));
    return {};
  }, []);

  const refresh = useCallback(async () => {
    await loadOrders();
  }, [loadOrders]);

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        configured: isSupabaseConfigured,
        login,
        register,
        signInWithProvider,
        logout,
        cancelMembership,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Incorrect email or password.";
  if (m.includes("already registered")) return "An account with this email already exists — please log in.";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider"))
    return "This sign-in provider is not enabled yet. Please use email and password.";
  if (m.includes("rate limit")) return "Too many attempts — please wait a minute and try again.";
  return message;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "girsd_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const login = useCallback(
    (email: string, name?: string) => {
      persist({
        name: name ?? email.split("@")[0].replace(/[._]/g, " "),
        email,
        membership: null,
        tickets: [],
        enrolments: [],
        ...(safeExisting(email) ?? {}),
      } as User);
    },
    [persist]
  );

  const register = useCallback(
    (name: string, email: string) => {
      persist({ name, email, membership: null, tickets: [], enrolments: [] });
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function safeExisting(email: string): Partial<User> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY + "_" + email);
    return raw ? (JSON.parse(raw) as Partial<User>) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

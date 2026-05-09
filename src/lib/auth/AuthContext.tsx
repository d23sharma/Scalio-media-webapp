import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, Role } from "./types";

const STORAGE_KEY = "auth.currentUser";

interface AuthContextValue {
  currentUser: AuthUser | null;
  login: (email: string, _password: string, role?: Role) => AuthUser;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  /** Owner-only: mock update of another user's role (no backend). */
  setUserRole: (userId: string, role: Role) => void;
  /** Mock list of users for owner controls. */
  users: AuthUser[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
}

// Mock seed users for owner controls demo (in-memory only).
const SEED_USERS: AuthUser[] = [
  { id: "u_1", email: "alice@example.com", role: "member", token: "mock_1" },
  { id: "u_2", email: "bob@example.com", role: "admin", token: "mock_2" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>(SEED_USERS);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    setCurrentUser(readStoredUser());
  }, []);

  const login = useCallback((email: string, _password: string, role: Role = "member"): AuthUser => {
    const user: AuthUser = {
      id: `u_${Date.now()}`,
      email,
      role,
      token: `mock_${Math.random().toString(36).slice(2)}`,
    };
    writeStoredUser(user);
    setCurrentUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    writeStoredUser(null);
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      writeStoredUser(next);
      return next;
    });
  }, []);

  const setUserRole = useCallback((userId: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, login, logout, updateUser, setUserRole, users }),
    [currentUser, login, logout, updateUser, setUserRole, users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

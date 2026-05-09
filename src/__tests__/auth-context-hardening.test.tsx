import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import type { AuthUser } from "@/lib/auth/types";

const STORAGE_KEY = "auth.currentUser";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthContext hardening", () => {
  beforeEach(() => window.localStorage.clear());

  it("restores token + user from localStorage on mount", () => {
    const stored: AuthUser = {
      id: "u_persist",
      email: "persist@example.com",
      role: "admin",
      token: "tkn_abc123",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.currentUser).toEqual(stored);
    expect(result.current.currentUser?.token).toBe("tkn_abc123");
  });

  it("derived state (role + isAuthenticated) is correct after restore", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: "u", email: "o@x.com", role: "owner", token: "t" }),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Derived from currentUser (no separate flag in context).
    const isAuthenticated = result.current.currentUser !== null;
    const role = result.current.currentUser?.role;

    expect(isAuthenticated).toBe(true);
    expect(role).toBe("owner");
  });

  it("logout clears localStorage and resets all user state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("a@b.com", "pw", "admin");
    });
    expect(result.current.currentUser).not.toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    act(() => {
      result.current.logout();
    });

    expect(result.current.currentUser).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    // Derived flags reset too.
    expect(result.current.currentUser?.role).toBeUndefined();
  });
});

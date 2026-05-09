import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";

const STORAGE_KEY = "auth.currentUser";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthContext persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores user in localStorage on login", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("a@b.com", "pw", "admin");
    });

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const stored = JSON.parse(raw!);
    expect(stored.email).toBe("a@b.com");
    expect(stored.role).toBe("admin");
  });

  it("restores currentUser from localStorage on mount (reload)", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: "u_x", email: "saved@example.com", role: "owner", token: "t" }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.currentUser?.email).toBe("saved@example.com");
    expect(result.current.currentUser?.role).toBe("owner");
  });

  it("clears localStorage on logout", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("a@b.com", "pw", "member");
    });
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    act(() => {
      result.current.logout();
    });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(result.current.currentUser).toBeNull();
  });
});

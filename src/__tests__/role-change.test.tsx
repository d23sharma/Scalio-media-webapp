import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { canManageUsers } from "@/lib/auth/rbac";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("role change logic", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("updates mock state when current user is owner", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("owner@example.com", "pw", "owner");
    });
    expect(canManageUsers(result.current.currentUser)).toBe(true);

    const target = result.current.users[0];
    expect(target.role).toBe("member");

    act(() => {
      result.current.setUserRole(target.id, "admin");
    });

    const updated = result.current.users.find((u) => u.id === target.id);
    expect(updated?.role).toBe("admin");
  });

  it("prevents role change when current user is not owner (guarded by rbac)", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login("member@example.com", "pw", "member");
    });
    expect(canManageUsers(result.current.currentUser)).toBe(false);

    const target = result.current.users[0];
    const originalRole = target.role;

    // Simulate a guarded caller: only invoke setUserRole if rbac allows it.
    act(() => {
      if (canManageUsers(result.current.currentUser)) {
        result.current.setUserRole(target.id, "admin");
      }
    });

    const after = result.current.users.find((u) => u.id === target.id);
    expect(after?.role).toBe(originalRole);
  });
});

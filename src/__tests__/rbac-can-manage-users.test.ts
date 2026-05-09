import { describe, it, expect } from "vitest";
import { canManageUsers } from "@/lib/auth/rbac";
import type { AuthUser } from "@/lib/auth/types";

const make = (role: AuthUser["role"]): AuthUser => ({
  id: "u",
  email: "u@x.com",
  role,
  token: "t",
});

describe("canManageUsers", () => {
  it("returns true for owner", () => {
    expect(canManageUsers(make("owner"))).toBe(true);
  });

  it("returns false for admin", () => {
    expect(canManageUsers(make("admin"))).toBe(false);
  });

  it("returns false for member", () => {
    expect(canManageUsers(make("member"))).toBe(false);
  });

  it("returns false for null/unauthenticated", () => {
    expect(canManageUsers(null)).toBe(false);
  });
});

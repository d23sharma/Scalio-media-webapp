import { describe, it, expect } from "vitest";
import { canManageUsers } from "@/lib/auth/rbac";
import type { AuthUser, Role } from "@/lib/auth/types";

/**
 * Pure function tests for the setUserRole helper logic.
 * Replicates the in-memory state update from AuthContext without rendering UI.
 */
function setUserRole(
  users: AuthUser[],
  caller: AuthUser | null,
  userId: string,
  role: Role,
): AuthUser[] {
  if (!canManageUsers(caller)) return users;
  return users.map((u) => (u.id === userId ? { ...u, role } : u));
}

const baseUsers: AuthUser[] = [
  { id: "u_1", email: "alice@example.com", role: "member", token: "t1" },
  { id: "u_2", email: "bob@example.com", role: "admin", token: "t2" },
];

const owner: AuthUser = { id: "o", email: "o@x.com", role: "owner", token: "to" };
const member: AuthUser = { id: "m", email: "m@x.com", role: "member", token: "tm" };
const admin: AuthUser = { id: "a", email: "a@x.com", role: "admin", token: "ta" };

describe("setUserRole helper", () => {
  it("allows role change when canManageUsers(user) is true (owner)", () => {
    const next = setUserRole(baseUsers, owner, "u_1", "admin");
    expect(next.find((u) => u.id === "u_1")?.role).toBe("admin");
  });

  it("blocks role change when caller is a member", () => {
    const next = setUserRole(baseUsers, member, "u_1", "admin");
    expect(next).toEqual(baseUsers);
    expect(next.find((u) => u.id === "u_1")?.role).toBe("member");
  });

  it("blocks role change when caller is an admin (not owner)", () => {
    const next = setUserRole(baseUsers, admin, "u_1", "owner");
    expect(next).toEqual(baseUsers);
  });

  it("blocks role change when caller is null (unauthenticated)", () => {
    const next = setUserRole(baseUsers, null, "u_1", "admin");
    expect(next).toEqual(baseUsers);
  });

  it("returns the same array reference when blocked (state unchanged)", () => {
    const next = setUserRole(baseUsers, member, "u_1", "admin");
    expect(next).toBe(baseUsers);
  });
});

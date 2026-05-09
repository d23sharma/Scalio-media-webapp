import type { AuthUser, Role } from "./types";

/**
 * Role-based access control utilities.
 *
 * Rules:
 *  - Member: no listing privileges
 *  - Admin: edit only
 *  - Owner: full access (edit + delete + user management)
 */

export function canEditListing(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === "admin" || user.role === "owner";
}

export function canDeleteListing(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === "owner";
}

export function canManageUsers(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === "owner";
}

export function hasRole(user: AuthUser | null, role: Role): boolean {
  return !!user && user.role === role;
}

export function hasAnyRole(user: AuthUser | null, roles: Role[]): boolean {
  return !!user && roles.includes(user.role);
}

/* ---- Usage examples ----
import { canEditListing, canDeleteListing, canManageUsers } from "@/lib/auth/rbac";
import { useAuth } from "@/lib/auth/AuthContext";

function ListingActions() {
  const { currentUser } = useAuth();
  return (
    <>
      {canEditListing(currentUser) && <button>Edit</button>}
      {canDeleteListing(currentUser) && <button>Delete</button>}
      {canManageUsers(currentUser) && <a href="/admin/users">Manage users</a>}
    </>
  );
}
------------------------- */

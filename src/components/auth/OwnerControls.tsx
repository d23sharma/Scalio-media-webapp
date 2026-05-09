import { useAuth } from "@/lib/auth/AuthContext";
import { canManageUsers } from "@/lib/auth/rbac";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/auth/types";

/**
 * Owner-only mock controls: promote users to admin and toggle membership status.
 * Renders nothing for non-owners.
 */
export function OwnerControls() {
  const { currentUser, users, setUserRole } = useAuth();

  if (!canManageUsers(currentUser)) return null;

  const cycleMembership = (current: Role): Role => {
    // Simple status cycle: member -> admin -> member
    return current === "member" ? "admin" : "member";
  };

  return (
    <section
      aria-labelledby="owner-controls-title"
      className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm"
    >
      <h2 id="owner-controls-title" className="text-lg font-semibold text-foreground">
        Owner controls
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Promote users or toggle membership status.
      </p>

      <ul className="mt-4 divide-y divide-border">
        {users.map((u) => (
          <li key={u.id} className="flex items-center justify-between py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{u.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {u.role}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={u.role === "admin" || u.role === "owner"}
                onClick={() => setUserRole(u.id, "admin")}
              >
                Promote to admin
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={u.role === "owner"}
                onClick={() => setUserRole(u.id, cycleMembership(u.role))}
              >
                Toggle status
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/auth/types";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [{ title: "User Management" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: UsersPage,
});

const ROLES: Role[] = ["member", "admin", "owner"];

function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["owner"]}>
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-foreground">User Management</h1>
          <UsersList />
        </div>
      </main>
    </ProtectedRoute>
  );
}

function UsersList() {
  const { users, setUserRole } = useAuth();
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {users.map((u) => (
        <li key={u.id} className="flex items-center justify-between p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{u.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">Change role for {u.email}</span>
            <select
              value={u.role}
              onChange={(e) => setUserRole(u.id, e.target.value as Role)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}

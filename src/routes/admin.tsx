import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OwnerControls } from "@/components/auth/OwnerControls";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "owner"]}>
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Admin</h1>
          <OwnerControls />
        </div>
      </main>
    </ProtectedRoute>
  );
}

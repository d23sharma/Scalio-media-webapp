import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/auth/types";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

function Seed({ role }: { role: Role }) {
  const { login } = useAuth();
  useEffect(() => {
    login("u@example.com", "pw", role);
  }, [login, role]);
  return null;
}

// Mirrors the guard used by /admin route.
function AdminGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["admin", "owner"]}>{children}</ProtectedRoute>;
}

describe("/admin route guard", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    window.localStorage.clear();
  });

  it("redirects unauthenticated users to /sign-in", () => {
    render(
      <AuthProvider>
        <AdminGuard>
          <div>admin-content</div>
        </AdminGuard>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/sign-in" });
    expect(screen.queryByText("admin-content")).not.toBeInTheDocument();
  });

  it('redirects role="member" to "/"', () => {
    render(
      <AuthProvider>
        <Seed role="member" />
        <AdminGuard>
          <div>admin-content</div>
        </AdminGuard>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
    expect(screen.queryByText("admin-content")).not.toBeInTheDocument();
  });

  it('allows access when role="admin"', () => {
    render(
      <AuthProvider>
        <Seed role="admin" />
        <AdminGuard>
          <div>admin-content</div>
        </AdminGuard>
      </AuthProvider>,
    );
    expect(screen.getByText("admin-content")).toBeInTheDocument();
    // No unauthorized redirect to "/" should occur for an admin.
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });

  it('allows access when role="owner"', () => {
    render(
      <AuthProvider>
        <Seed role="owner" />
        <AdminGuard>
          <div>admin-content</div>
        </AdminGuard>
      </AuthProvider>,
    );
    expect(screen.getByText("admin-content")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });
});

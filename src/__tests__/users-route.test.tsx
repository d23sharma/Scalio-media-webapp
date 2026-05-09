import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
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

// We test the route's access guard, not the UI.
function UsersGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={["owner"]}>{children}</ProtectedRoute>;
}

describe("/users route guard", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    window.localStorage.clear();
  });

  it("redirects to /sign-in if not authenticated", () => {
    render(
      <AuthProvider>
        <UsersGuard>
          <div>users-page</div>
        </UsersGuard>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/sign-in" });
  });

  it('redirects to "/" if role is not "owner"', () => {
    render(
      <AuthProvider>
        <Seed role="admin" />
        <UsersGuard>
          <div>users-page</div>
        </UsersGuard>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });
});

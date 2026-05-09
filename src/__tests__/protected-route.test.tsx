import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/auth/types";
import { useEffect } from "react";

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

describe("ProtectedRoute", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    window.localStorage.clear();
  });

  it("redirects to /sign-in when no user is authenticated", () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>secret</div>
        </ProtectedRoute>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/sign-in" });
  });

  it('redirects to "/" when user role is not in allowedRoles', () => {
    render(
      <AuthProvider>
        <Seed role="member" />
        <ProtectedRoute allowedRoles={["owner"]}>
          <div>secret</div>
        </ProtectedRoute>
      </AuthProvider>,
    );
    // allow effects to flush
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });
});

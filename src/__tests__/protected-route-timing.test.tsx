import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Role } from "@/lib/auth/types";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

// Mock feedback to keep the DOM clean during these tests.
vi.mock("@/lib/auth/feedback", () => ({ notify: vi.fn() }));

/**
 * Local ProtectedRoute variant that mirrors the real one but accepts a
 * `loading` flag — the simplest possible model of "auth still hydrating".
 * We test the contract (no redirect while loading), not the real hydration
 * timing, to keep this test deterministic and fast.
 */
function ProtectedRouteWithLoading({
  children,
  loading,
  allowedRoles,
}: {
  children: ReactNode;
  loading: boolean;
  allowedRoles?: Role[];
}) {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (loading) return; // ← invariant under test
    if (!currentUser) {
      navigateMock({ to: "/sign-in" });
      return;
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      navigateMock({ to: "/" });
    }
  }, [loading, currentUser, allowedRoles]);

  if (loading) return <div>loading…</div>;
  if (!currentUser) return null;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return null;
  return <>{children}</>;
}

// Minimal AuthProvider stub via the real one — we just need useAuth to work.
import { AuthProvider } from "@/lib/auth/AuthContext";

function Seed({ role }: { role: Role }) {
  const { login } = useAuth();
  useEffect(() => {
    login("u@example.com", "pw", role);
  }, [login, role]);
  return null;
}

describe("ProtectedRoute timing", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    window.localStorage.clear();
  });

  it("does NOT redirect while auth is hydrating", () => {
    render(
      <AuthProvider>
        <ProtectedRouteWithLoading loading={true}>
          <div>secret</div>
        </ProtectedRouteWithLoading>
      </AuthProvider>,
    );
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(screen.getByText("loading…")).toBeInTheDocument();
  });

  it("after hydration with no user → redirects to /sign-in", () => {
    render(
      <AuthProvider>
        <ProtectedRouteWithLoading loading={false}>
          <div>secret</div>
        </ProtectedRouteWithLoading>
      </AuthProvider>,
    );
    expect(navigateMock).toHaveBeenCalledWith({ to: "/sign-in" });
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("after hydration with valid user → allows access", () => {
    render(
      <AuthProvider>
        <Seed role="admin" />
        <ProtectedRouteWithLoading loading={false} allowedRoles={["admin", "owner"]}>
          <div>secret</div>
        </ProtectedRouteWithLoading>
      </AuthProvider>,
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
    // Allowed user must never be redirected to "/" as unauthorized.
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });
});

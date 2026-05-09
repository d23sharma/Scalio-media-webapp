import { type ReactElement, type ReactNode, useEffect } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { Role } from "@/lib/auth/types";

/**
 * Shared test utilities for auth + route guard tests.
 * Keep this file dependency-free (only vitest + RTL + project code).
 */

/** Reusable navigate mock for `@tanstack/react-router`. */
export const navigateMock = vi.fn();

/**
 * Install the router mock. Call inside the test file's top-level scope:
 *   import { mockRouter, navigateMock } from "./test-utils";
 *   mockRouter();
 */
export function mockRouter() {
  vi.mock("@tanstack/react-router", () => ({
    useNavigate: () => navigateMock,
  }));
}

/** Seeds an authenticated user into AuthContext via login(). */
function Seed({ role, email = "u@example.com" }: { role: Role; email?: string }) {
  const { login } = useAuth();
  useEffect(() => {
    login(email, "pw", role);
  }, [login, role, email]);
  return null;
}

/**
 * Render `ui` inside <AuthProvider>. If `role` is provided, a user is
 * logged in synchronously on mount before assertions run.
 */
export function renderWithAuth(
  ui: ReactElement,
  opts: { role?: Role; email?: string } = {},
): RenderResult {
  return render(
    <AuthProvider>
      {opts.role ? <Seed role={opts.role} email={opts.email} /> : null}
      {ui}
    </AuthProvider>,
  );
}

/**
 * Render `children` wrapped in a <ProtectedRoute> with the given allowedRoles,
 * inside an AuthProvider seeded with `role` (or no user when omitted).
 */
export function mockProtectedRoute(
  children: ReactNode,
  opts: { role?: Role; allowedRoles?: Role[] } = {},
): RenderResult {
  const { role, allowedRoles } = opts;
  return renderWithAuth(<ProtectedRoute allowedRoles={allowedRoles}>{children}</ProtectedRoute>, {
    role,
  });
}

/** Reset navigate mock + localStorage between tests. */
export function resetAuthTestState() {
  navigateMock.mockClear();
  window.localStorage.clear();
}

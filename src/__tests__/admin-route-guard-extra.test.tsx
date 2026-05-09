import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { mockRouter, navigateMock, mockProtectedRoute, resetAuthTestState } from "./test-utils";

mockRouter();

const ALLOWED = ["admin", "owner"] as const;

describe("/admin route guard — extra edge cases", () => {
  beforeEach(resetAuthTestState);

  it("initial state with no user redirects to /sign-in", () => {
    mockProtectedRoute(<div>admin-content</div>, { allowedRoles: [...ALLOWED] });
    expect(navigateMock).toHaveBeenCalledWith({ to: "/sign-in" });
    expect(screen.queryByText("admin-content")).not.toBeInTheDocument();
  });

  it("after login as admin → allows access (no redirect)", () => {
    mockProtectedRoute(<div>admin-content</div>, {
      role: "admin",
      allowedRoles: [...ALLOWED],
    });
    expect(screen.getByText("admin-content")).toBeInTheDocument();
    // An allowed role must never be sent to the unauthorized "/" redirect.
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });

  it("after login as owner → allows access (no unauthorized redirect)", () => {
    mockProtectedRoute(<div>admin-content</div>, {
      role: "owner",
      allowedRoles: [...ALLOWED],
    });
    expect(screen.getByText("admin-content")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/" });
  });

  it("after login as member → redirects to /", () => {
    mockProtectedRoute(<div>admin-content</div>, {
      role: "member",
      allowedRoles: [...ALLOWED],
    });
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
    expect(screen.queryByText("admin-content")).not.toBeInTheDocument();
  });
});

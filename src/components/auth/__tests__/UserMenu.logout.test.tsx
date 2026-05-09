import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { UserMenu } from "../UserMenu";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import type { AuthUser } from "@/lib/auth/types";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: { children: React.ReactNode } & Record<string, unknown>) => (
    <a {...(rest as Record<string, string>)}>{children}</a>
  ),
}));

const SEED: AuthUser = {
  id: "u_1",
  email: "alice@example.com",
  role: "member",
  token: "t",
  name: "Alice",
};

function Harness() {
  const { currentUser, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.email : "none"}</span>
      <UserMenu onLogout={logout} />
    </div>
  );
}

describe("UserMenu logout behavior", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("auth.currentUser", JSON.stringify(SEED));
  });

  it("clears localStorage and currentUser on logout", () => {
    const { container, getByRole, getByTestId } = render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    expect(getByTestId("user").textContent).toBe(SEED.email);

    const wrapper = container.querySelector(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    fireEvent.click(getByRole("menuitem", { name: /logout/i }));

    expect(window.localStorage.getItem("auth.currentUser")).toBeNull();
    expect(getByTestId("user").textContent).toBe("none");
  });
});

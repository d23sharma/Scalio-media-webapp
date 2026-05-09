import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { UserMenu } from "../UserMenu";
import { AuthProvider } from "@/lib/auth/AuthContext";
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
  name: "Alice Doe",
  packageName: "Pro",
  lastLogin: "2026-05-01",
};

describe("UserMenu dropdown", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("auth.currentUser", JSON.stringify(SEED));
  });

  it("renders user details and menu items when hovered (state)", () => {
    const onLogout = vi.fn();
    const { container, getByText, getByRole } = render(
      <AuthProvider>
        <UserMenu onLogout={onLogout} />
      </AuthProvider>,
    );

    const wrapper = container.querySelector(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(getByText("Alice Doe")).toBeInTheDocument();
    expect(getByText("alice@example.com")).toBeInTheDocument();
    expect(getByText("Profile")).toBeInTheDocument();
    expect(getByText("Pro")).toBeInTheDocument();
    expect(getByText("2026-05-01")).toBeInTheDocument();

    const logoutBtn = getByRole("menuitem", { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalled();
  });
});

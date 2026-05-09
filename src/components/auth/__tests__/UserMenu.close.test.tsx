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
  name: "Alice",
};

describe("UserMenu close behavior", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("auth.currentUser", JSON.stringify(SEED));
  });

  it("closes on mouseLeave", () => {
    const { container, queryByRole } = render(
      <AuthProvider>
        <UserMenu onLogout={() => {}} />
      </AuthProvider>,
    );
    const wrapper = container.querySelector(".relative") as HTMLElement;

    fireEvent.mouseEnter(wrapper);
    expect(queryByRole("menu")).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    const { container, queryByRole } = render(
      <AuthProvider>
        <div>
          <UserMenu onLogout={() => {}} />
          <button data-testid="outside">outside</button>
        </div>
      </AuthProvider>,
    );
    const wrapper = container.querySelector(".relative") as HTMLElement;

    fireEvent.mouseEnter(wrapper);
    expect(queryByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});

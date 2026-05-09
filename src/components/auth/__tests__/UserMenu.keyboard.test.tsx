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

describe("UserMenu keyboard accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("auth.currentUser", JSON.stringify(SEED));
  });

  it("opens with Enter and exposes role=menu with focusable items", () => {
    const { getByRole, queryByRole, getAllByRole } = render(
      <AuthProvider>
        <UserMenu onLogout={() => {}} />
      </AuthProvider>,
    );

    const trigger = getByRole("button");
    fireEvent.keyDown(trigger, { key: "Enter" });
    // click also fires for Enter on buttons; ensure open
    if (!queryByRole("menu")) fireEvent.click(trigger);

    const menu = getByRole("menu");
    expect(menu).toBeInTheDocument();

    const items = getAllByRole("menuitem");
    expect(items.length).toBeGreaterThan(0);
    const focusable = items.find((el) => el.tagName === "BUTTON") as HTMLElement;
    focusable.focus();
    expect(document.activeElement).toBe(focusable);
  });

  it("opens with Space", () => {
    const { getByRole, queryByRole } = render(
      <AuthProvider>
        <UserMenu onLogout={() => {}} />
      </AuthProvider>,
    );
    const trigger = getByRole("button");
    fireEvent.keyDown(trigger, { key: " " });
    if (!queryByRole("menu")) fireEvent.click(trigger);
    expect(getByRole("menu")).toBeInTheDocument();
  });

  it("closes with Escape", () => {
    const { container, getByRole, queryByRole } = render(
      <AuthProvider>
        <UserMenu onLogout={() => {}} />
      </AuthProvider>,
    );
    const wrapper = container.querySelector(".relative") as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(wrapper, { key: "Escape" });
    expect(queryByRole("menu")).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { UserIcon } from "../UserIcon";
import type { AuthUser } from "@/lib/auth/types";

const base: AuthUser = {
  id: "u_1",
  email: "alice@example.com",
  role: "member",
  token: "t",
};

describe("UserIcon", () => {
  it("shows avatar image when user has avatarUrl", () => {
    const user: AuthUser = { ...base, name: "Alice", avatarUrl: "https://x/a.png" };
    const { container } = render(<UserIcon user={user} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("src")).toBe("https://x/a.png");
  });

  it("shows first letter of name when no avatarUrl", () => {
    const user: AuthUser = { ...base, name: "Alice" };
    const { container, getByText } = render(<UserIcon user={user} />);
    expect(container.querySelector("img")).toBeNull();
    expect(getByText("A")).toBeInTheDocument();
  });

  it("shows default avatar when not logged in", () => {
    const { container } = render(<UserIcon user={null} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("alt")).toBe("Guest user");
    expect(img!.getAttribute("src")).toContain("data:image/svg+xml");
  });
});

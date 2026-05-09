import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";

const STORAGE_KEY = "auth.currentUser";

function Probe() {
  const { currentUser, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="email">{currentUser?.email ?? "none"}</span>
      <button onClick={() => login("a@b.com", "pw", "member")}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe("auth session", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists user from localStorage on reload (hydration)", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: "u_x", email: "saved@example.com", role: "member", token: "t" }),
    );

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    // hydration runs in useEffect after mount
    expect(await screen.findByText("saved@example.com")).toBeInTheDocument();
  });

  it("logout clears localStorage and resets currentUser", async () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("login").click();
    });
    expect(screen.getByTestId("email")).toHaveTextContent("a@b.com");
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    act(() => {
      screen.getByText("logout").click();
    });
    expect(screen.getByTestId("email")).toHaveTextContent("none");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthForm } from "@/components/auth/AuthForm";

describe("Sign In form (AuthForm)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows error when email and password are empty", () => {
    const onSubmit = vi.fn();
    render(<AuthForm title="Sign in" submitLabel="Sign in" onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByTestId("auth-error")).toHaveTextContent(/email is required/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows error for invalid email format", () => {
    const onSubmit = vi.fn();
    render(<AuthForm title="Sign in" submitLabel="Sign in" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByTestId("auth-error")).toHaveTextContent(/valid email/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls mocked login() with valid input", async () => {
    const login = vi.fn();
    const onSubmit = vi.fn(({ email, password }: { email: string; password: string }) => {
      login(email, password, "member");
    });
    render(<AuthForm title="Sign in" submitLabel="Sign in" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "secret123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Allow async submit handler to flush
    await Promise.resolve();
    await Promise.resolve();

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
      role: undefined,
    });
    expect(login).toHaveBeenCalledWith("user@example.com", "secret123", "member");
  });
});

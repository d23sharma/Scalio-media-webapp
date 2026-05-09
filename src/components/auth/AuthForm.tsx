import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Role } from "@/lib/auth/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthFormValues {
  email: string;
  password: string;
  role?: Role;
}

interface AuthFormProps {
  title: string;
  submitLabel: string;
  showPassword?: boolean;
  showRole?: boolean;
  footer?: ReactNode;
  onSubmit: (values: AuthFormValues) => void | Promise<void>;
}

export function AuthForm({
  title,
  submitLabel,
  showPassword = true,
  showRole = false,
  footer,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email is required.");
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address.");
    if (showPassword && !password) return setError("Password is required.");
    if (showPassword && password.length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setSubmitting(true);
      await onSubmit({ email: email.trim(), password, role: showRole ? role : undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-hero px-4 py-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 30%, oklch(0.68 0.18 245 / 0.25), transparent), radial-gradient(50% 50% at 70% 60%, oklch(0.78 0.18 160 / 0.2), transparent)",
        }}
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative w-full max-w-md space-y-5 rounded-3xl glass p-8 shadow-card"
        aria-labelledby="auth-form-title"
      >
        <div className="text-center">
          <h1 id="auth-form-title" className="font-display text-3xl font-bold text-[#1A1A2E]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">Welcome to Scalio Media</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {showPassword && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {showRole && (
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        )}

        <p
          role="alert"
          aria-live="polite"
          className="min-h-5 text-sm text-destructive"
          data-testid="auth-error"
        >
          {error}
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-brand text-white shadow-glow hover:scale-[1.01] transition-transform"
        >
          {submitting ? "Please wait…" : submitLabel}
        </Button>

        {footer && <div className="text-center text-sm text-[#1B2A4A]/80">{footer}</div>}
      </form>
    </main>
  );
}

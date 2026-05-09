import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{6,}$/;
// 8+ chars, 1 upper, 1 lower, 1 number, 1 special, no spaces
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

export interface SignUpValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

interface Props {
  onSubmit: (values: SignUpValues) => void | Promise<void>;
}

export function SignUpForm({ onSubmit }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!firstName.trim()) return setError("First name is required.");
    if (!lastName.trim()) return setError("Last name is required.");
    if (!PHONE_RE.test(phone.trim())) return setError("Enter a valid phone number.");
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address.");
    if (!PASSWORD_RE.test(password))
      return setError(
        "Password must be 8+ chars with uppercase, lowercase, number, special char, and no spaces.",
      );
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setSubmitting(true);
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
      });
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
        className="relative w-full max-w-md space-y-4 rounded-3xl glass p-8 shadow-card"
        aria-labelledby="signup-title"
      >
        <div className="text-center">
          <h1 id="signup-title" className="font-display text-3xl font-bold text-[#1A1A2E]">
            Create account
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">Welcome to Scalio Media</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-[#6B7280]">
            Min 8 chars, with uppercase, lowercase, number, special character, no spaces.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <p
          role="alert"
          aria-live="polite"
          className="min-h-5 text-sm text-destructive"
          data-testid="signup-error"
        >
          {error}
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-brand text-white shadow-glow hover:scale-[1.01] transition-transform"
        >
          {submitting ? "Please wait…" : "Sign Up"}
        </Button>

        <button
          type="button"
          onClick={() => setError("Google sign-up is not connected in this demo.")}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#1A1A2E] hover:bg-[#F5F7FA] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.1l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.1z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.6 34.6 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.5 5.5c-.5.4 7-5.1 7-15.1 0-1.2-.1-2.3-.4-3.5z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="text-center text-sm text-[#1B2A4A]/80">
          Already have an account?{" "}
          <Link to="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </main>
  );
}

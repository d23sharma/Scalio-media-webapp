import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password" },
      { name: "description", content: "Reset your account password." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-hero px-4 py-16 overflow-hidden">
        <div className="relative w-full max-w-md rounded-3xl glass p-8 text-center shadow-card">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Check your email</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            If an account exists, a password reset link has been sent.
          </p>
          <Link
            to="/sign-in"
            className="mt-5 inline-block text-sm font-semibold text-[#4A9EFF] underline"
          >
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AuthForm
      title="Reset password"
      submitLabel="Send reset link"
      showPassword={false}
      onSubmit={() => {
        // Mock only — no backend.
        setSent(true);
      }}
      footer={
        <Link to="/sign-in" className="underline">
          Back to sign in
        </Link>
      }
    />
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth/AuthContext";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Sign In" }, { name: "description", content: "Sign in to your account." }],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthForm
      title="Sign in"
      submitLabel="Sign in"
      onSubmit={({ email, password }) => {
        // Mock: no backend. Default role = member on sign-in.
        login(email, password, "member");
        navigate({ to: "/" });
      }}
      footer={
        <>
          <Link to="/sign-up" className="underline">
            Create account
          </Link>
          {" · "}
          <Link to="/reset-password" className="underline">
            Forgot password?
          </Link>
        </>
      }
    />
  );
}

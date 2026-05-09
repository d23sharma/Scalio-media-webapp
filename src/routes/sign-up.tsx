import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuth } from "@/lib/auth/AuthContext";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [{ title: "Sign Up" }, { name: "description", content: "Create a new account." }],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const { login, updateUser } = useAuth();
  const navigate = useNavigate();

  return (
    <SignUpForm
      onSubmit={({ firstName, lastName, phone, email, password }) => {
        login(email, password, "member");
        updateUser({ name: `${firstName} ${lastName}`, phone });
        navigate({ to: "/" });
      }}
    />
  );
}

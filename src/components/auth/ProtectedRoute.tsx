import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/AuthContext";
import { notify } from "@/lib/auth/feedback";
import type { Role } from "@/lib/auth/types";

interface ProtectedRouteProps {
  children: ReactNode;
  /** If provided, only users with one of these roles can view. */
  allowedRoles?: Role[];
  /** Where to send unauthenticated users. Defaults to /sign-in. */
  redirectTo?: string;
  /** Where to send authenticated-but-unauthorized users. */
  unauthorizedTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/sign-in",
  unauthorizedTo = "/",
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Not authenticated → redirect to sign-in
    if (!currentUser) {
      notify("Please sign in to continue", "error");
      navigate({ to: redirectTo });
      return;
    }
    // Authenticated but role not allowed → redirect to home
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      notify("Unauthorized access", "error");
      navigate({ to: unauthorizedTo });
    }
  }, [currentUser, allowedRoles, redirectTo, unauthorizedTo, navigate]);

  if (!currentUser) return null;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return null;
  return <>{children}</>;
}

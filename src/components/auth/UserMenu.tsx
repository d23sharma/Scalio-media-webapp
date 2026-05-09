import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { UserIcon } from "./UserIcon";
import { useAuth } from "@/lib/auth/AuthContext";

interface UserMenuProps {
  onLogout: () => void;
}

export const UserMenu = ({ onLogout }: UserMenuProps) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target === e.currentTarget.querySelector("button")
    ) {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={onKeyDown}
    >
      {currentUser ? (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
          }}
          className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <UserIcon user={currentUser} />
        </button>
      ) : (
        <Link
          to="/sign-in"
          aria-label="Sign in"
          className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <UserIcon user={null} />
        </Link>
      )}

      {currentUser && open && (
        <div
          role="menu"
          className="user-menu-panel absolute right-0 top-full mt-2 w-64 origin-top-right user-menu-open"
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white truncate">
              {currentUser.name || currentUser.email}
            </p>
            <p className="text-xs text-white/60 truncate">{currentUser.email}</p>
          </div>
          <div className="py-1 text-sm">
            <Link
              to="/profile"
              role="menuitem"
              className="block px-4 py-2 text-white/90 hover:bg-white/10 transition-colors"
            >
              Profile
            </Link>
            <div className="px-4 py-2 text-white/80">
              <span className="text-white/60">Package: </span>
              {currentUser.packageName || "Free"}
            </div>
            <div className="px-4 py-2 text-white/80">
              <span className="text-white/60">Last login: </span>
              {currentUser.lastLogin || "—"}
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-white/90 hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

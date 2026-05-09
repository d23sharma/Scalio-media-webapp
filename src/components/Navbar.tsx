import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { UserMenu } from "./auth/UserMenu";
import { track } from "@/lib/analytics";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasAnyRole } from "@/lib/auth/rbac";
import { notify } from "@/lib/auth/feedback";

type NavLink =
  | { label: string; hash: string; route: false }
  | { label: string; to: "/blog"; route: true };

const links: NavLink[] = [
  { label: "Home", hash: "home", route: false },
  { label: "Services", hash: "services", route: false },
  { label: "Packages", hash: "packages", route: false },
  { label: "Results", hash: "results", route: false },
  { label: "Blog", to: "/blog", route: true },
  { label: "Contact", hash: "contact", route: false },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstDrawerLinkRef = useRef<HTMLAnchorElement>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const showAdmin = hasAnyRole(currentUser, ["admin", "owner"]);

  const handleLogout = () => {
    logout(); // clears localStorage auth data via AuthContext
    notify("Logged out successfully");
    navigate({ to: "/" });
    setOpen(false);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close on Escape, lock scroll, return focus to toggle
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // move focus into drawer
    setTimeout(() => firstDrawerLinkRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    track("cta_click", { location: "navbar", label: "Get Free Audit" });
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const handleNavClick = (label: string) => {
    track("nav_click", { label });
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav py-3" : "py-5 bg-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a
          href="#home"
          className="flex items-center gap-3 group rounded-md"
          aria-label="Scalio Media — back to top"
        >
          <img
            src="/logo.png"
            alt="Scalio Media Logo"
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Scalio<span className="text-gradient"> Media</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
          {links.map((l) =>
            l.route ? (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => handleNavClick(l.label)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group rounded-sm"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-brand transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : (
              <Link
                key={l.hash}
                to="/"
                hash={l.hash}
                onClick={() => handleNavClick(l.label)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group rounded-sm"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-brand transition-all duration-300 group-hover:w-full" />
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {showAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}
          <a
            href="#contact-form"
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-brand text-white text-sm font-semibold shadow-glow hover:scale-105 transition-transform"
          >
            Get Free Audit
          </a>
          <UserMenu onLogout={handleLogout} />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            ref={toggleRef}
            onClick={() => setOpen((v) => !v)}
            className="text-white p-2 rounded-md"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            type="button"
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-nav mt-3 mx-6 rounded-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col p-4 gap-1" aria-label="Mobile">
              {links.map((l, i) =>
                l.route ? (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => handleNavClick(l.label)}
                    className="px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <Link
                    key={l.hash}
                    to="/"
                    hash={l.hash}
                    onClick={() => handleNavClick(l.label)}
                    className="px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {l.label}
                  </Link>
                ),
              )}
              {showAdmin && (
                <Link
                  to="/admin"
                  onClick={() => handleNavClick("Admin")}
                  className="px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
                >
                  Admin
                </Link>
              )}
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl text-left text-white/90 hover:bg-white/10 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => handleNavClick("Sign In")}
                  className="px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              )}
              <a
                href="#contact-form"
                onClick={scrollToContact}
                className="mt-2 px-4 py-3 rounded-xl bg-gradient-brand text-white font-semibold text-center"
              >
                Get Free Audit
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

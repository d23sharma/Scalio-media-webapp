/**
 * Minimal auth feedback utility — no external libraries.
 *
 * Renders a transient toast in a singleton container. Falls back to
 * `window.alert` in non-DOM environments (SSR/tests without document body).
 *
 * Usage:
 *   import { notify } from "@/lib/auth/feedback";
 *   notify("Logged out successfully");
 *   notify("Unauthorized access", "error");
 */

export type FeedbackKind = "info" | "error";

const CONTAINER_ID = "auth-feedback-container";

function ensureContainer(): HTMLElement | null {
  if (typeof document === "undefined" || !document.body) return null;
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.style.cssText =
      "position:fixed;top:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none;";
    document.body.appendChild(el);
  }
  return el;
}

export function notify(message: string, kind: FeedbackKind = "info"): void {
  const container = ensureContainer();
  if (!container) {
    if (typeof window !== "undefined" && typeof window.alert === "function") {
      window.alert(message);
    }
    return;
  }
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.setAttribute("role", kind === "error" ? "alert" : "status");
  toast.style.cssText = `pointer-events:auto;padding:.625rem .875rem;border-radius:.5rem;font-size:.875rem;color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.25);background:${
    kind === "error" ? "#b91c1c" : "#111827"
  };opacity:0;transform:translateY(-4px);transition:opacity .2s, transform .2s;`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-4px)";
    window.setTimeout(() => toast.remove(), 220);
  }, 2400);
}

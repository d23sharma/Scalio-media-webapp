/**
 * Consent + Do Not Track utilities.
 *
 * Analytics may only fire when:
 *   1. The user has NOT enabled Do Not Track (DNT/GPC), AND
 *   2. The user has explicitly granted consent (stored in localStorage).
 *
 * The contract:
 *   - getConsent()      -> "granted" | "denied" | "unknown"
 *   - setConsent(value) -> persists + dispatches a window event
 *   - isDoNotTrack()    -> reads navigator.doNotTrack / msDoNotTrack / GPC
 *   - canTrack()        -> convenience: granted && !DNT
 *   - onConsentChange() -> subscribe to changes
 */

export type Consent = "granted" | "denied" | "unknown";

const STORAGE_KEY = "scalio.consent.v1";
const EVENT_NAME = "scalio:consent-change";

export function isDoNotTrack(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  // Standard DNT
  const dnt =
    navigator.doNotTrack ||
    // @ts-expect-error legacy
    window.doNotTrack ||
    // @ts-expect-error legacy IE
    navigator.msDoNotTrack;
  if (dnt === "1" || dnt === "yes" || dnt === true) return true;
  // Global Privacy Control
  // @ts-expect-error not in lib.dom yet
  if (navigator.globalPrivacyControl === true) return true;
  return false;
}

export function getConsent(): Consent {
  if (typeof window === "undefined") return "unknown";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* noop */
  }
  return "unknown";
}

export function setConsent(value: Exclude<Consent, "unknown">) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* noop */
  }
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: value }));
  } catch {
    /* noop */
  }
}

export function canTrack(): boolean {
  return !isDoNotTrack() && getConsent() === "granted";
}

export function onConsentChange(cb: (value: Consent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<Consent>).detail ?? getConsent();
    cb(detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

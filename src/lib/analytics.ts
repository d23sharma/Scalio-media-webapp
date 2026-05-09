/**
 * Lightweight, consent-gated analytics dispatcher.
 *
 * Events are queued until the user grants consent. Once consent is granted
 * (and Do Not Track is NOT enabled), queued events flush and future events
 * dispatch immediately. If consent is denied or DNT is on, events are dropped
 * silently.
 *
 * Forwards to:
 *  - Google Analytics (window.gtag) if present
 *  - Meta Pixel (window.fbq) if present
 *  - A custom `lovable:track` CustomEvent (always emitted in dev for debug)
 *
 * No PII should ever be passed in `params`.
 */
import { canTrack, getConsent, isDoNotTrack, onConsentChange } from "./consent";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface QueuedEvent {
  event: string;
  params: EventParams;
  ts: number;
}

const queue: QueuedEvent[] = [];
const MAX_QUEUE = 50;
let listenerAttached = false;

function attachConsentListener() {
  if (listenerAttached || typeof window === "undefined") return;
  listenerAttached = true;
  onConsentChange((value) => {
    if (value === "granted" && !isDoNotTrack()) {
      flush();
    } else if (value === "denied") {
      queue.length = 0;
    }
  });
}

function dispatch(event: string, params: EventParams) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* noop */
  }
  try {
    window.fbq?.("trackCustom", event, params);
  } catch {
    /* noop */
  }
  try {
    window.dispatchEvent(new CustomEvent("lovable:track", { detail: { event, params } }));
  } catch {
    /* noop */
  }
}

function flush() {
  while (queue.length) {
    const item = queue.shift()!;
    dispatch(item.event, item.params);
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  attachConsentListener();

  // Hard block under Do Not Track / Global Privacy Control.
  if (isDoNotTrack()) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics] dropped (DNT)", event, params);
    }
    return;
  }

  const consent = getConsent();

  if (consent === "granted") {
    dispatch(event, params);
  } else if (consent === "unknown") {
    // Queue until the user decides. Drop oldest if queue overflows.
    queue.push({ event, params, ts: Date.now() });
    if (queue.length > MAX_QUEUE) queue.shift();
  } else {
    // denied -> drop
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", consent, event, params);
  }
}

export const analytics = { track };

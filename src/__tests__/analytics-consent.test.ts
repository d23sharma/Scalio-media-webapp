/**
 * End-to-end consent gating for analytics.
 *
 * Verifies:
 *  - track() does NOT dispatch before consent is granted (events are queued)
 *  - Once consent is granted, queued events flush and future events fire
 *  - Consent persists across page reloads (simulated by re-importing modules)
 *  - Denied consent drops events permanently
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

type DispatchedEvent = { event: string; params: Record<string, unknown> };

function captureLovableTrack(): DispatchedEvent[] {
  const events: DispatchedEvent[] = [];
  window.addEventListener("lovable:track", (e) => {
    const detail = (e as CustomEvent).detail as DispatchedEvent;
    events.push(detail);
  });
  return events;
}

async function freshModules() {
  vi.resetModules();
  const consent = await import("@/lib/consent");
  const analytics = await import("@/lib/analytics");
  return { consent, analytics };
}

beforeEach(() => {
  // Clean slate between tests: storage, listeners, DNT.
  window.localStorage.clear();
  // Force DNT off (jsdom defaults are inconsistent).
  Object.defineProperty(window.navigator, "doNotTrack", {
    configurable: true,
    get: () => "0",
  });
  // @ts-expect-error – test override
  window.navigator.globalPrivacyControl = false;
});

describe("analytics consent gating", () => {
  it("does NOT fire events before consent is granted", async () => {
    const { analytics } = await freshModules();
    const events = captureLovableTrack();

    analytics.track("hero_cta_click", { label: "Get Free Audit" });
    analytics.track("nav_click", { label: "Services" });

    expect(events).toHaveLength(0);
  });

  it("flushes queued events and fires future events after consent is granted", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    analytics.track("queued_event", { source: "before_consent" });
    expect(events).toHaveLength(0);

    consent.setConsent("granted");

    // Queued event should have been flushed.
    expect(events.map((e) => e.event)).toContain("queued_event");

    // Future events fire immediately.
    analytics.track("post_consent_event", { ok: true });
    expect(events.map((e) => e.event)).toContain("post_consent_event");
  });

  it("persists consent across simulated page reloads", async () => {
    // First "page load": grant consent.
    {
      const { consent } = await freshModules();
      consent.setConsent("granted");
    }

    // Second "page load": fresh modules, but localStorage persists.
    const { consent, analytics } = await freshModules();
    expect(consent.getConsent()).toBe("granted");
    expect(consent.canTrack()).toBe(true);

    const events = captureLovableTrack();
    analytics.track("reload_event", { reloaded: true });
    expect(events.map((e) => e.event)).toContain("reload_event");
  });

  it("drops events when consent is explicitly denied", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    consent.setConsent("denied");
    analytics.track("should_be_dropped", { x: 1 });

    expect(events).toHaveLength(0);
  });

  it("respects Do Not Track even after consent is granted", async () => {
    Object.defineProperty(window.navigator, "doNotTrack", {
      configurable: true,
      get: () => "1",
    });

    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    consent.setConsent("granted");
    analytics.track("dnt_event", { x: 1 });

    expect(events).toHaveLength(0);
  });
});

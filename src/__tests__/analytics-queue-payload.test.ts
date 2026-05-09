/**
 * Regression test: queued analytics payloads.
 *
 * Verifies that events fired BEFORE consent is granted are:
 *   1. Not dispatched at all (queued internally)
 *   2. Preserved with EXACT event names + params
 *   3. Flushed in original order, exactly once, after consent is granted
 *   4. Not re-flushed on subsequent consent re-affirmation
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

type DispatchedEvent = { event: string; params: Record<string, unknown> };

function captureLovableTrack(): DispatchedEvent[] {
  const events: DispatchedEvent[] = [];
  window.addEventListener("lovable:track", (e) => {
    events.push((e as CustomEvent).detail as DispatchedEvent);
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
  window.localStorage.clear();
  Object.defineProperty(window.navigator, "doNotTrack", {
    configurable: true,
    get: () => "0",
  });
  // @ts-expect-error – test override
  window.navigator.globalPrivacyControl = false;
});

describe("queued analytics payloads (regression)", () => {
  it("preserves exact event names and params for queued events", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    const queued = [
      { event: "hero_cta_click", params: { label: "Get Free Audit", location: "hero" } },
      { event: "nav_click", params: { label: "Services" } },
      { event: "package_view", params: { slug: "standard", price: 14999 } },
    ];

    queued.forEach((q) => analytics.track(q.event, q.params));
    expect(events).toHaveLength(0);

    consent.setConsent("granted");

    expect(events).toHaveLength(queued.length);
    queued.forEach((q, i) => {
      expect(events[i].event).toBe(q.event);
      expect(events[i].params).toEqual(q.params);
    });
  });

  it("flushes queued events in original FIFO order", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    analytics.track("first", { i: 1 });
    analytics.track("second", { i: 2 });
    analytics.track("third", { i: 3 });

    consent.setConsent("granted");

    expect(events.map((e) => e.event)).toEqual(["first", "second", "third"]);
  });

  it("flushes each queued event exactly once (no duplicates after re-grant)", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    analytics.track("only_once", { v: "x" });

    consent.setConsent("granted");
    // Re-affirm consent — should NOT re-flush.
    consent.setConsent("granted");

    const occurrences = events.filter((e) => e.event === "only_once");
    expect(occurrences).toHaveLength(1);
  });

  it("does not flush queued events if consent is denied", async () => {
    const { consent, analytics } = await freshModules();
    const events = captureLovableTrack();

    analytics.track("never_fired", { reason: "denied" });
    consent.setConsent("denied");

    expect(events.filter((e) => e.event === "never_fired")).toHaveLength(0);
  });
});

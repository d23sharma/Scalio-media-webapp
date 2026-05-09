/**
 * Verifies that low-level analytics calls (gtag, fbq) are completely suppressed
 * before consent is granted — not just the dispatch wrapper events — and that
 * they only start firing after explicit consent. Also verifies queued events
 * never double-fire across consent toggles.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

async function freshModules() {
  vi.resetModules();
  const consent = await import("@/lib/consent");
  const analytics = await import("@/lib/analytics");
  return { consent, analytics };
}

beforeEach(() => {
  // Clear any consent-change listeners left over from previous test modules
  // by signalling "denied" — each listener clears its own module's queue.
  try {
    window.dispatchEvent(new CustomEvent("scalio:consent-change", { detail: "denied" }));
  } catch {
    /* noop */
  }

  window.localStorage.clear();
  Object.defineProperty(window.navigator, "doNotTrack", {
    configurable: true,
    get: () => "0",
  });
  // @ts-expect-error – test override
  window.navigator.globalPrivacyControl = false;

  // Install fresh spies on every test.
  (window as unknown as { gtag: ReturnType<typeof vi.fn> }).gtag = vi.fn();
  (window as unknown as { fbq: ReturnType<typeof vi.fn> }).fbq = vi.fn();
});

describe("gtag/fbq are fully suppressed before consent", () => {
  it("does NOT call gtag before consent", async () => {
    const { analytics } = await freshModules();
    analytics.track("pre_consent_event_a", { x: 1 });
    analytics.track("pre_consent_event_b", { x: 2 });
    expect((window as any).gtag).not.toHaveBeenCalled();
  });

  it("does NOT call fbq before consent", async () => {
    const { analytics } = await freshModules();
    analytics.track("pre_consent_event_c", { x: 3 });
    expect((window as any).fbq).not.toHaveBeenCalled();
  });

  it("starts calling gtag and fbq only AFTER consent is granted", async () => {
    const { consent, analytics } = await freshModules();

    analytics.track("queued_event", { src: "before" });
    expect((window as any).gtag).not.toHaveBeenCalled();
    expect((window as any).fbq).not.toHaveBeenCalled();

    consent.setConsent("granted");

    // Flushed queued event hits gtag + fbq exactly once.
    expect((window as any).gtag).toHaveBeenCalledTimes(1);
    expect((window as any).fbq).toHaveBeenCalledTimes(1);

    analytics.track("post_consent_event", { src: "after" });
    expect((window as any).gtag).toHaveBeenCalledTimes(2);
    expect((window as any).fbq).toHaveBeenCalledTimes(2);
  });

  it("queued events never double-fire after consent", async () => {
    const { consent, analytics } = await freshModules();

    analytics.track("queued_once", { i: 1 });
    consent.setConsent("granted");
    expect((window as any).gtag).toHaveBeenCalledTimes(1);

    // Flipping consent off and back on must NOT replay the original queue.
    consent.setConsent("denied");
    consent.setConsent("granted");

    // Still only the original single dispatch — nothing replayed.
    expect((window as any).gtag).toHaveBeenCalledTimes(1);
    expect((window as any).fbq).toHaveBeenCalledTimes(1);
  });

  it("does NOT call gtag/fbq when consent is denied", async () => {
    const { consent, analytics } = await freshModules();
    consent.setConsent("denied");
    analytics.track("denied_event", { x: 1 });
    expect((window as any).gtag).not.toHaveBeenCalled();
    expect((window as any).fbq).not.toHaveBeenCalled();
  });

  it("does NOT call gtag/fbq under Do Not Track even after consent", async () => {
    Object.defineProperty(window.navigator, "doNotTrack", {
      configurable: true,
      get: () => "1",
    });
    const { consent, analytics } = await freshModules();
    consent.setConsent("granted");
    analytics.track("dnt_event", { x: 1 });
    expect((window as any).gtag).not.toHaveBeenCalled();
    expect((window as any).fbq).not.toHaveBeenCalled();
  });
});

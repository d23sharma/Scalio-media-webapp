import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { notify } from "@/lib/auth/feedback";

const CONTAINER_ID = "auth-feedback-container";

describe("notify()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a toast element to the DOM", () => {
    notify("Hello world");
    const container = document.getElementById(CONTAINER_ID);
    expect(container).not.toBeNull();
    expect(container!.children.length).toBe(1);
    expect(container!.textContent).toContain("Hello world");
  });

  it("removes the toast after timeout", () => {
    notify("Bye world");
    const container = document.getElementById(CONTAINER_ID)!;
    expect(container.children.length).toBe(1);

    // Advance past visible duration (2400ms) + fade-out (220ms).
    vi.advanceTimersByTime(2400);
    vi.advanceTimersByTime(220);

    expect(container.children.length).toBe(0);
  });
});

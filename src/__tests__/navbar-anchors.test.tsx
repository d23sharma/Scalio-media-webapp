/**
 * Verifies that every navbar link target (#home, #services, #packages, #results, #contact)
 * exists in the rendered DOM and that scrollIntoView/getElementById can resolve them
 * without throwing. Uses the real app router with memory history at "/".
 */
import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { getRouter } from "@/router";

const NAVBAR_TARGETS = ["home", "services", "packages", "results", "contact"];

afterEach(() => cleanup());

beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q: string) => ({
        matches: false,
        media: q,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  }
  if (!window.IntersectionObserver) {
    // @ts-expect-error – minimal stub for framer-motion whileInView
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    };
  }
});

async function renderHome() {
  const router = getRouter();
  router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("navbar anchor targets exist in the page", () => {
  it("all navbar section ids are present in the rendered home page", async () => {
    await renderHome();
    await waitFor(
      () => {
        for (const id of NAVBAR_TARGETS) {
          expect(document.getElementById(id), `Missing #${id}`).not.toBeNull();
        }
      },
      { timeout: 3000 },
    );
  });

  it("each anchor target can be scrolled to without throwing", async () => {
    await renderHome();
    await waitFor(
      () => {
        expect(document.getElementById("contact")).not.toBeNull();
      },
      { timeout: 3000 },
    );
    for (const id of NAVBAR_TARGETS) {
      const el = document.getElementById(id);
      expect(el, `Missing #${id}`).not.toBeNull();
      expect(() => el!.scrollIntoView({ behavior: "smooth" })).not.toThrow();
    }
  });
});

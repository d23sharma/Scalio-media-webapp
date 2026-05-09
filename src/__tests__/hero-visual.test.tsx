import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// framer-motion stub
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const passthrough =
    (tag: string) =>
    ({ children, ...props }: any) =>
      React.createElement(tag, props, children);
  return {
    motion: new Proxy({}, { get: (_t, k: string) => passthrough(k) }),
    AnimatePresence: ({ children }: any) => children,
  };
});

import { Hero } from "@/components/Hero";

/**
 * "Visual" snapshot via the DOM: confirms each social icon is rendered
 * (not display:none) and carries responsive positioning + sizing classes
 * that target mobile, tablet, and desktop breakpoints. This is the
 * highest-value assertion we can make without a real browser screenshotter.
 */
describe("Hero — social icons across breakpoints", () => {
  afterEach(() => cleanup());

  it("renders Instagram, YouTube, and Facebook icons, each visible", () => {
    render(<Hero />);
    // lucide-react renders an <svg> with class "lucide-<name>"
    const ig = document.querySelector("svg.lucide-instagram");
    const yt = document.querySelector("svg.lucide-youtube");
    const fb = document.querySelector("svg.lucide-facebook");
    expect(ig).toBeTruthy();
    expect(yt).toBeTruthy();
    expect(fb).toBeTruthy();

    for (const icon of [ig, yt, fb]) {
      const wrapper = icon!.closest("div")?.parentElement as HTMLElement;
      // Wrapper must NOT be hidden at any breakpoint via `hidden` class.
      expect(wrapper.className).not.toMatch(/\bhidden\b/);
    }
  });

  it("each icon container has responsive position + size classes for mobile/tablet/desktop", () => {
    render(<Hero />);
    const icons = ["lucide-instagram", "lucide-youtube", "lucide-facebook"];
    for (const cls of icons) {
      const svg = document.querySelector(`svg.${cls}`)!;
      // Outer floating wrapper carries position classes
      const floater = svg.closest("div")!.parentElement as HTMLElement;
      const className = floater.className;
      // Mobile-first base (no prefix) + sm: (tablet) + md: (desktop) breakpoint tokens
      expect(className).toMatch(/(left|right)-3/); // mobile base position
      expect(className).toMatch(/sm:(left|right)-/); // tablet
      expect(className).toMatch(/md:(left|right)-/); // desktop

      // Icon itself uses responsive sizing
      expect(svg.getAttribute("class") || "").toMatch(/w-5/);
      expect(svg.getAttribute("class") || "").toMatch(/sm:w-/);
      expect(svg.getAttribute("class") || "").toMatch(/md:w-/);
    }
  });

  it("hero heading is present (smoke check the section rendered)", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: /dominate/i })).toBeInTheDocument();
  });
});

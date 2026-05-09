import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  Outlet,
} from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog-data";

/**
 * E2E-style test: drives the real /blog page through user interactions
 * and asserts that search + category filters update the visible card list
 * purely client-side — no fetch / XHR allowed.
 */

// Stub framer-motion to avoid animation noise (no API calls either way).
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

// Lightweight stubs for surrounding chrome so we test the filter logic.
vi.mock("@/components/Navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/Footer", () => ({ Footer: () => null }));

import { Route as BlogFileRoute } from "@/routes/blog";

function renderBlog() {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const blogRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/blog",
    component: (BlogFileRoute.options as any).component,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([blogRoute]),
    history: createMemoryHistory({ initialEntries: ["/blog"] }),
  });
  return render(<RouterProvider router={router} />);
}

function getCards() {
  // Each blog card is an <article> with an <h2> title.
  return screen
    .queryAllByRole("article")
    .filter((el) => within(el).queryByRole("heading", { level: 2 }));
}

describe("blog page — client-side search & category filter", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let xhrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch" as any).mockImplementation(() => {
      throw new Error("fetch should not be called from blog filters");
    });
    xhrSpy = vi.spyOn(XMLHttpRequest.prototype, "open").mockImplementation(() => {
      throw new Error("XHR should not be called from blog filters");
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    xhrSpy.mockRestore();
    cleanup();
  });

  it("renders all posts initially", async () => {
    renderBlog();
    // wait for router to mount
    await screen.findByRole("searchbox");
    expect(getCards().length).toBe(BLOG_POSTS.length);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("filters posts by category pill (no network calls)", async () => {
    const user = userEvent.setup();
    renderBlog();
    await screen.findByRole("searchbox");

    const pill = screen.getByRole("button", { name: "Instagram Growth" });
    await user.click(pill);

    expect(pill).toHaveAttribute("aria-pressed", "true");
    const expected = BLOG_POSTS.filter((p) => p.category === "Instagram Growth").length;
    expect(expected).toBeGreaterThan(0);
    expect(getCards().length).toBe(expected);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("narrows the visible list as the user types in the search box", async () => {
    const user = userEvent.setup();
    renderBlog();
    const input = await screen.findByRole("searchbox");

    const before = getCards().length;
    await user.type(input, "Reels");
    const after = getCards().length;

    const expected = BLOG_POSTS.filter((p) => {
      const q = "reels";
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }).length;

    expect(after).toBe(expected);
    expect(after).toBeLessThan(before);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows an empty-state message when search matches nothing", async () => {
    const user = userEvent.setup();
    renderBlog();
    const input = await screen.findByRole("searchbox");

    await user.type(input, "zzz-no-match-xyz-9999");

    expect(getCards().length).toBe(0);
    expect(screen.getByText(/No articles match your search/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("combines category + search and resets when cleared", async () => {
    const user = userEvent.setup();
    renderBlog();
    const input = await screen.findByRole("searchbox");

    await user.click(screen.getByRole("button", { name: "Small Business" }));
    await user.type(input, "Instagram");

    const expected = BLOG_POSTS.filter(
      (p) =>
        p.category === "Small Business" &&
        (p.title.toLowerCase().includes("instagram") ||
          p.excerpt.toLowerCase().includes("instagram") ||
          p.category.toLowerCase().includes("instagram")),
    ).length;
    expect(getCards().length).toBe(expected);

    // Reset back to All
    await user.clear(input);
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(getCards().length).toBe(BLOG_POSTS.length);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

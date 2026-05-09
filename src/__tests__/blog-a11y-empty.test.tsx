import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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

const getCards = () =>
  screen.queryAllByRole("article").filter((el) => within(el).queryByRole("heading", { level: 2 }));

describe("blog filters — accessibility & empty state", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let xhrSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch" as any).mockImplementation(() => {
      throw new Error("fetch should not be called");
    });
    xhrSpy = vi.spyOn(XMLHttpRequest.prototype, "open").mockImplementation(() => {
      throw new Error("XHR should not be called");
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    xhrSpy.mockRestore();
    cleanup();
  });

  it("category pills are reachable by keyboard (tab + activate)", async () => {
    const user = userEvent.setup();
    renderBlog();
    const search = await screen.findByRole("searchbox");
    search.focus();
    expect(document.activeElement).toBe(search);

    // Tab into the filter group and activate the first non-"All" pill.
    await user.tab();
    const active = document.activeElement as HTMLElement;
    expect(active.tagName).toBe("BUTTON");
    expect(active).toHaveAttribute("aria-pressed");

    const pill = screen.getByRole("button", { name: "Instagram Growth" });
    pill.focus();
    await user.keyboard("{Enter}");
    expect(pill).toHaveAttribute("aria-pressed", "true");
  });

  it("filter group is labelled and uses aria-pressed for state", async () => {
    renderBlog();
    await screen.findByRole("searchbox");
    const group = screen.getByRole("group", { name: /filter articles by category/i });
    expect(group).toBeInTheDocument();
    const all = screen.getByRole("button", { name: "All" });
    expect(all).toHaveAttribute("aria-pressed", "true");
  });

  it("announces filter + search changes via a polite live region", async () => {
    const user = userEvent.setup();
    renderBlog();
    const search = await screen.findByRole("searchbox");
    const status = screen.getByTestId("filter-status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status.textContent).toMatch(/Showing \d+ articles/);

    await user.type(search, "Reels");
    expect(status.textContent).toContain("Search: Reels");

    await user.click(screen.getByRole("button", { name: "Instagram Growth" }));
    expect(status.textContent).toContain("Filter: Instagram Growth");
  });

  it("empty category shows the empty state with a working Clear filters button", async () => {
    const user = userEvent.setup();
    renderBlog();
    await screen.findByRole("searchbox");

    // "Email Marketing" is intentionally seeded with zero posts.
    const emptyPill = screen.getByRole("button", { name: "Email Marketing" });
    await user.click(emptyPill);

    expect(getCards().length).toBe(0);
    const empty = screen.getByTestId("empty-state");
    const clear = within(empty).getByRole("button", { name: /clear filters/i });
    expect(clear).toBeInTheDocument();

    await user.click(clear);
    expect(getCards().length).toBe(BLOG_POSTS.length);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("Clear filters also resets the search box query", async () => {
    const user = userEvent.setup();
    renderBlog();
    const search = await screen.findByRole("searchbox");
    await user.type(search, "zzz-no-match-xyz-9999");
    expect(getCards().length).toBe(0);

    await user.click(
      within(screen.getByTestId("empty-state")).getByRole("button", {
        name: /clear filters/i,
      }),
    );
    expect((search as HTMLInputElement).value).toBe("");
    expect(getCards().length).toBe(BLOG_POSTS.length);
  });
});

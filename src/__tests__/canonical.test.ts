/**
 * Asserts the route's canonical link matches the configured domain exactly.
 *
 * This guards against environment drift — e.g. accidentally publishing with
 * http://, a preview subdomain, or a trailing-slash variant.
 */
import { describe, it, expect } from "vitest";
import { Route } from "@/routes/index";

const EXPECTED_CANONICAL = "https://scaliomedia.in";

function getHead() {
  // TanStack Router head() is a function that takes match context; we don't
  // need any of it for static metadata.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Route.options.head as any)({});
}

describe("canonical link", () => {
  it("is present in the route head", () => {
    const head = getHead();
    const canonical = head.links?.find((l: { rel: string }) => l.rel === "canonical");
    expect(canonical, "No <link rel=canonical> in route head").toBeTruthy();
  });

  it("uses https:// and matches the configured domain exactly", () => {
    const head = getHead();
    const canonical = head.links?.find(
      (l: { rel: string; href: string }) => l.rel === "canonical",
    ) as { href: string } | undefined;
    expect(canonical?.href).toBeDefined();
    expect(canonical!.href.startsWith("https://")).toBe(true);
    expect(canonical!.href).toBe(EXPECTED_CANONICAL);
  });

  it("does not drift to a preview/staging host", () => {
    const head = getHead();
    const canonical = head.links?.find(
      (l: { rel: string; href: string }) => l.rel === "canonical",
    ) as { href: string } | undefined;
    expect(canonical!.href).not.toMatch(/lovable\.app|localhost|vercel\.app|preview/i);
    expect(canonical!.href).not.toMatch(/^http:\/\//);
  });
});

/**
 * Verifies public/robots.txt:
 *  - Contains a Sitemap: line pointing at the configured domain
 *  - Disallow rules match the expected pattern (only /api/ disallowed)
 *  - Has a User-agent: * directive that allows the rest of the site
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://scaliomedia.in";
const EXPECTED_DISALLOWS = ["/api/"];
const EXPECTED_ALLOWS = ["/"];

let robots = "";

beforeAll(() => {
  robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
});

describe("robots.txt", () => {
  it("declares a wildcard User-agent block", () => {
    expect(robots).toMatch(/^User-agent:\s*\*/m);
  });

  it("contains a Sitemap line pointing at the configured domain", () => {
    const match = robots.match(/^Sitemap:\s*(\S+)/m);
    expect(match, "Missing Sitemap: line in robots.txt").not.toBeNull();
    const sitemapUrl = match![1];
    expect(sitemapUrl.startsWith("https://")).toBe(true);
    expect(sitemapUrl).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("Allow rules match the expected pattern", () => {
    const allows = [...robots.matchAll(/^Allow:\s*(\S+)/gm)].map((m) => m[1]);
    for (const expected of EXPECTED_ALLOWS) {
      expect(allows, `Expected Allow: ${expected}`).toContain(expected);
    }
  });

  it("Disallow rules match the expected pattern (and only the expected pattern)", () => {
    const disallows = [...robots.matchAll(/^Disallow:\s*(\S*)/gm)]
      .map((m) => m[1])
      .filter((v) => v.length > 0);
    expect(disallows.sort()).toEqual([...EXPECTED_DISALLOWS].sort());
  });

  it("does not accidentally disallow the site root", () => {
    expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  });
});

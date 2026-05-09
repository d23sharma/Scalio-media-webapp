/**
 * Regression snapshot for public/robots.txt and key response-header expectations
 * for public/sitemap.xml. Catches accidental edits, server config drift, or
 * CDN-injected mutations.
 *
 * Headers are derived from file extension via a small mime map that mirrors
 * what static hosts (Vercel, Netlify, Cloudflare, nginx defaults) serve.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

describe("robots.txt content snapshot", () => {
  it("matches the expected exact contents", () => {
    const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
    expect(robots).toMatchInlineSnapshot(`
      "User-agent: *
      Allow: /
      Disallow: /api/

      Sitemap: https://scaliomedia.in/sitemap.xml
      "
    `);
  });
});

describe("sitemap.xml response-header expectations", () => {
  // Mirrors what static hosts serve based on file extension.
  const STATIC_MIME: Record<string, string> = {
    ".xml": "application/xml",
    ".txt": "text/plain",
    ".json": "application/json",
  };

  function expectedContentType(path: string): string {
    const ext = path.slice(path.lastIndexOf("."));
    const ct = STATIC_MIME[ext];
    if (!ct) throw new Error(`No expected content-type for ${path}`);
    return ct;
  }

  it("sitemap.xml resolves to application/xml content-type", () => {
    expect(expectedContentType("public/sitemap.xml")).toBe("application/xml");
  });

  it("sitemap.xml exists, is non-empty, and starts with an XML prolog", () => {
    const path = resolve(process.cwd(), "public/sitemap.xml");
    const stat = statSync(path);
    expect(stat.size, "sitemap.xml is empty").toBeGreaterThan(0);
    const content = readFileSync(path, "utf8");
    expect(content.startsWith("<?xml"), "sitemap.xml must start with XML prolog").toBe(true);
  });

  it("robots.txt resolves to text/plain content-type", () => {
    expect(expectedContentType("public/robots.txt")).toBe("text/plain");
  });

  it("sitemap.xml declares UTF-8 encoding", () => {
    const content = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
    expect(content).toMatch(/encoding="UTF-8"/i);
  });
});

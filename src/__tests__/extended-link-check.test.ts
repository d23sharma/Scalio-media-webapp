import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";

/**
 * Extended CI link check — complements internal-links.test.ts.
 *  - Every blog slug round-trips against its title (no drift)
 *  - Every blog post category is a known category
 *  - sitemap.xml references real, existing routes
 *  - Canonical URL on /blog matches the produced route path
 */

const SITE_URL = "https://scaliomedia.in";
const ROUTES_DIR = join(process.cwd(), "src", "routes");

function discoverRoutes(): Set<string> {
  const files = readdirSync(ROUTES_DIR);
  const routes = new Set<string>();
  for (const f of files) {
    if (!f.endsWith(".tsx") || f.startsWith("__")) continue;
    const base = f.replace(/\.tsx$/, "");
    if (base === "index") {
      routes.add("/");
      continue;
    }
    routes.add("/" + base.split(".").join("/"));
  }
  return routes;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

describe("extended link check — blog metadata", () => {
  it("each blog slug is a deterministic transform of its title (no manual drift)", () => {
    for (const p of BLOG_POSTS) {
      expect(p.slug, `slug drift for "${p.title}"`).toBe(slugify(p.title));
    }
  });

  it("each blog post category is registered in BLOG_CATEGORIES", () => {
    const known = new Set(BLOG_CATEGORIES);
    for (const p of BLOG_POSTS) {
      expect(known.has(p.category), `unknown category: ${p.category}`).toBe(true);
    }
  });
});

describe("extended link check — sitemap & canonical", () => {
  const sitemap = readFileSync(join(process.cwd(), "public", "sitemap.xml"), "utf8");
  const routes = discoverRoutes();

  it("every <loc> in sitemap.xml resolves to an existing route or in-page anchor", () => {
    const locs = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    for (const url of locs) {
      // Strip site origin and any hash anchor
      const path = url.replace(SITE_URL, "").split("#")[0] || "/";
      expect(
        routes.has(path),
        `sitemap URL '${url}' has no matching route file (path '${path}')`,
      ).toBe(true);
    }
  });

  it("blog route canonical resolves to /blog under the production domain", () => {
    const src = readFileSync(join(ROUTES_DIR, "blog.tsx"), "utf8");
    const m = src.match(/rel:\s*"canonical",\s*href:\s*`([^`]+)`/);
    expect(m, "missing canonical link in blog.tsx").toBeTruthy();
    const resolved = m![1].replace("${SITE_URL}", SITE_URL);
    expect(resolved).toBe(`${SITE_URL}/blog`);
  });
});

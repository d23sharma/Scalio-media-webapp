import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { BLOG_POSTS } from "@/lib/blog-data";

/**
 * CI guard: every internal link rendered by the navbar, blog list, and
 * blog post slugs must resolve to a real route file (or a real in-page
 * anchor). Catches broken routes, stale slugs, and canonical drift before
 * they ship.
 */

const SITE_URL = "https://scaliomedia.in";
const ROUTES_DIR = join(process.cwd(), "src", "routes");

// Build the set of static route paths that the file-based router exposes.
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
    // Convert flat dot-separated names into URL paths, preserving $params.
    const path = "/" + base.split(".").join("/");
    routes.add(path);
  }
  return routes;
}

const ROUTES = discoverRoutes();

// Anchors that hash-style navbar links must scroll to. These IDs are
// rendered on the index route by the corresponding section components.
const INDEX_ANCHORS = new Set([
  "home",
  "services",
  "packages",
  "results",
  "contact",
  "contact-form",
]);

// Mirror of Navbar links — keep in sync if you change the navbar.
const NAVBAR_LINKS: Array<{ kind: "hash"; href: string } | { kind: "route"; to: string }> = [
  { kind: "hash", href: "#home" },
  { kind: "hash", href: "#services" },
  { kind: "hash", href: "#packages" },
  { kind: "hash", href: "#results" },
  { kind: "route", to: "/blog" },
  { kind: "hash", href: "#contact" },
  { kind: "hash", href: "#contact-form" }, // CTA button
];

describe("internal navbar links resolve", () => {
  it("every route-style navbar link points to an existing route file", () => {
    for (const link of NAVBAR_LINKS) {
      if (link.kind !== "route") continue;
      expect(
        ROUTES.has(link.to),
        `Navbar route '${link.to}' has no matching file in src/routes/`,
      ).toBe(true);
    }
  });

  it("every hash navbar link targets a known section anchor", () => {
    for (const link of NAVBAR_LINKS) {
      if (link.kind !== "hash") continue;
      const id = link.href.replace(/^#/, "");
      expect(
        INDEX_ANCHORS.has(id),
        `Navbar hash '${link.href}' is not a known section id on '/'`,
      ).toBe(true);
    }
  });
});

describe("blog post links resolve", () => {
  it("every blog post has a non-empty, URL-safe slug", () => {
    const seen = new Set<string>();
    for (const p of BLOG_POSTS) {
      expect(p.slug, `Blog post '${p.title}' is missing a slug`).toBeTruthy();
      expect(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug),
        `Blog slug '${p.slug}' is not URL-safe (lowercase, dash-separated only)`,
      ).toBe(true);
      expect(seen.has(p.slug), `Duplicate blog slug detected: '${p.slug}'`).toBe(false);
      seen.add(p.slug);
    }
  });

  it("the /blog index route exists for every post link to land on", () => {
    expect(ROUTES.has("/blog")).toBe(true);
  });
});

describe("canonical URLs match the configured production domain", () => {
  const HTTPS_DOMAIN = /^https:\/\/scaliomedia\.in(\/|$)/;

  function readCanonical(file: string): string | null {
    const src = readFileSync(join(ROUTES_DIR, file), "utf8");
    const m = src.match(/rel:\s*"canonical",\s*href:\s*`?([^`"']+)`?/);
    return m ? m[1] : null;
  }

  it("blog route canonical uses https + production domain", () => {
    const raw = readCanonical("blog.tsx");
    expect(raw, "blog route is missing a canonical link").toBeTruthy();
    const resolved = raw!.replace("${SITE_URL}", SITE_URL);
    expect(
      HTTPS_DOMAIN.test(resolved),
      `Blog canonical drifted from production domain: '${resolved}'`,
    ).toBe(true);
  });

  it("SITE_URL constants in route files all point to the production domain", () => {
    for (const f of readdirSync(ROUTES_DIR)) {
      if (!f.endsWith(".tsx") || f.startsWith("__")) continue;
      const src = readFileSync(join(ROUTES_DIR, f), "utf8");
      const m = src.match(/const\s+SITE_URL\s*=\s*"([^"]+)"/);
      if (!m) continue;
      expect(m[1], `Route '${f}' declares a SITE_URL that does not match production`).toBe(
        SITE_URL,
      );
    }
  });
});

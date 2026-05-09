/**
 * Parses public/sitemap.xml and verifies:
 *  - It is well-formed XML with a <urlset> root
 *  - Each navbar link target appears as a <loc> entry (root or anchor)
 *  - Each <loc> URL uses the configured domain over https
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
// jsdom DOMParser is provided by the vitest jsdom environment.

const SITE_URL = "https://scaliomedia.in";

// Mirror of links exported from src/components/Navbar.tsx (kept in sync).
const NAVBAR_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Packages", href: "#packages" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

let locs: string[] = [];

beforeAll(() => {
  const xml = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) throw new Error(`sitemap.xml is not well-formed: ${parserError.textContent}`);
  const urlset = doc.querySelector("urlset");
  if (!urlset) throw new Error("sitemap.xml is missing a <urlset> root element");
  locs = Array.from(doc.querySelectorAll("url > loc")).map(
    (n: Element) => n.textContent?.trim() ?? "",
  );
});

describe("sitemap.xml", () => {
  it("contains at least one <loc> entry", () => {
    expect(locs.length).toBeGreaterThan(0);
  });

  it("every <loc> uses https and the configured domain", () => {
    for (const loc of locs) {
      expect(loc.startsWith(`${SITE_URL}/`) || loc === SITE_URL || loc === `${SITE_URL}/`).toBe(
        true,
      );
    }
  });

  it("includes the site root", () => {
    expect(locs.some((l) => l === `${SITE_URL}/` || l === SITE_URL)).toBe(true);
  });

  it.each(NAVBAR_LINKS)("navbar link $label ($href) is reachable via the sitemap", ({ href }) => {
    // "#home" -> root URL counts; other anchors should appear as ${SITE_URL}/${href}
    if (href === "#home") {
      expect(locs.some((l) => l === SITE_URL || l === `${SITE_URL}/`)).toBe(true);
      return;
    }
    const expected = `${SITE_URL}/${href}`;
    expect(
      locs.includes(expected),
      `Sitemap is missing a <loc> for navbar link ${href} (expected ${expected})`,
    ).toBe(true);
  });
});

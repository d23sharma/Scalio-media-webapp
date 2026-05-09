/**
 * Verifies every URL in sitemap.xml and the Sitemap line in robots.txt:
 *  - Has no whitespace
 *  - Contains no illegal characters
 *  - Round-trips through the WHATWG URL parser
 *  - Each path/hash component is properly URL-encoded (encodeURI idempotent)
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// RFC 3986 unreserved + reserved + percent. Anything else is illegal in a URI.
const ILLEGAL_URL_CHAR = /[^A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/;

function collectUrls(): string[] {
  const xml = readFileSync(resolve(process.cwd(), "public/sitemap.xml"), "utf8");
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const urls = Array.from(doc.querySelectorAll("url > loc")).map(
    (n) => n.textContent?.trim() ?? "",
  );

  const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
  const sitemapMatch = robots.match(/^Sitemap:\s*(\S+)/m);
  if (sitemapMatch) urls.push(sitemapMatch[1]);

  return urls;
}

let urls: string[] = [];

beforeAll(() => {
  urls = collectUrls();
});

describe("URL encoding & hygiene (sitemap + robots)", () => {
  it("collected at least one URL to validate", () => {
    expect(urls.length).toBeGreaterThan(0);
  });

  it("no URL contains whitespace", () => {
    for (const u of urls) {
      expect(/\s/.test(u), `URL contains whitespace: "${u}"`).toBe(false);
    }
  });

  it("no URL contains illegal characters", () => {
    for (const u of urls) {
      const bad = u.match(ILLEGAL_URL_CHAR);
      expect(bad, `URL contains illegal char ${JSON.stringify(bad?.[0])}: "${u}"`).toBeNull();
    }
  });

  it("every URL parses with the WHATWG URL parser", () => {
    for (const u of urls) {
      expect(() => new URL(u), `Unparseable URL: "${u}"`).not.toThrow();
    }
  });

  it("every URL is properly percent-encoded (encodeURI is idempotent)", () => {
    for (const u of urls) {
      // If the URL is already encoded, decoding then re-encoding yields the same string.
      let decoded: string;
      try {
        decoded = decodeURI(u);
      } catch {
        throw new Error(`URL has malformed percent-encoding: "${u}"`);
      }
      const reencoded = encodeURI(decoded);
      expect(reencoded, `URL is not properly URL-encoded: "${u}"`).toBe(u);
    }
  });

  it('no URL contains raw < > " { } | \\ ^ ` characters', () => {
    const forbidden = /[<>"{}|\\^`]/;
    for (const u of urls) {
      expect(forbidden.test(u), `URL contains forbidden char: "${u}"`).toBe(false);
    }
  });
});

/**
 * Metadata snapshot test.
 *
 * Pins the Open Graph tags, Twitter card tags, and the JSON-LD
 * ProfessionalService schema fields against expected values so future
 * regressions (typos, accidental rewrites, broken templating) are caught.
 *
 * If you intentionally change brand metadata, update EXPECTED below.
 */
import { describe, it, expect } from "vitest";
import { Route } from "@/routes/index";

const SITE_URL = "https://scaliomedia.in";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const head = (Route.options.head as any)({});
const meta: Array<Record<string, string>> = head.meta ?? [];
const scripts: Array<Record<string, string>> = head.scripts ?? [];

function getMeta(key: "name" | "property", value: string): string | undefined {
  return meta.find((m) => m[key] === value)?.content;
}

const EXPECTED = {
  title: "Scalio Media — Premium Social Media Marketing Agency in India",
  og: {
    "og:title": "Scalio Media — Grow Your Brand. Dominate Social Media.",
    "og:description":
      "Premium social media marketing for ambitious brands. Reels, ads, growth strategy — done for you.",
    "og:type": "website",
    "og:url": SITE_URL,
    "og:locale": "en_IN",
    "og:site_name": "Scalio Media",
  },
  twitter: {
    "twitter:card": "summary_large_image",
    "twitter:title": "Scalio Media — Grow Your Brand. Dominate Social Media.",
    "twitter:description":
      "Premium social media marketing for ambitious brands. Reels, ads, growth strategy — done for you.",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Scalio Media",
    url: SITE_URL,
    telephone: "+91-84088-11234",
    email: "hello@scaliomedia.in",
    areaServed: "IN",
    priceRange: "₹₹",
  },
};

describe("metadata snapshot", () => {
  it("page title matches expected", () => {
    expect(meta.find((m) => m.title)?.title).toBe(EXPECTED.title);
  });

  it("Open Graph tags match expected values", () => {
    for (const [prop, value] of Object.entries(EXPECTED.og)) {
      expect(getMeta("property", prop), `og tag ${prop}`).toBe(value);
    }
  });

  it("Twitter tags match expected values", () => {
    for (const [name, value] of Object.entries(EXPECTED.twitter)) {
      expect(getMeta("name", name), `twitter tag ${name}`).toBe(value);
    }
  });

  it("includes a JSON-LD ProfessionalService script", () => {
    const ld = scripts.find((s) => s.type === "application/ld+json");
    expect(ld, "Missing JSON-LD script in route head").toBeTruthy();
    expect(ld!.children).toBeTruthy();
  });

  it("JSON-LD fields match expected values", () => {
    const ld = scripts.find((s) => s.type === "application/ld+json")!;
    const parsed = JSON.parse(ld.children as unknown as string);
    for (const [key, value] of Object.entries(EXPECTED.jsonLd)) {
      expect(parsed[key], `JSON-LD field ${key}`).toBe(value);
    }
    // Address shape sanity check.
    expect(parsed.address?.["@type"]).toBe("PostalAddress");
    expect(parsed.address?.addressCountry).toBe("IN");
    // sameAs must be a non-empty array of https URLs.
    expect(Array.isArray(parsed.sameAs)).toBe(true);
    expect(parsed.sameAs.length).toBeGreaterThan(0);
    for (const url of parsed.sameAs) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("canonical, og:url, and JSON-LD url all agree", () => {
    const canonical = head.links?.find((l: { rel: string }) => l.rel === "canonical")?.href;
    const ogUrl = getMeta("property", "og:url");
    const ld = scripts.find((s) => s.type === "application/ld+json")!;
    const parsed = JSON.parse(ld.children as unknown as string);
    expect(canonical).toBe(SITE_URL);
    expect(ogUrl).toBe(SITE_URL);
    expect(parsed.url).toBe(SITE_URL);
  });
});

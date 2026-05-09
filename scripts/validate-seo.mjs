#!/usr/bin/env node
/**
 * SEO + structured data validator.
 *
 * Fetches a rendered HTML document and asserts:
 *
 *   - Exactly one <h1> on the page.
 *   - Required <meta> tags: description, viewport, robots (warn).
 *   - Open Graph: og:title, og:description, og:type, og:url.
 *   - Twitter: twitter:card, twitter:title, twitter:description.
 *   - JSON-LD: parses, has @context + @type=ProfessionalService, with the
 *     required ProfessionalService fields (name, url, telephone, address,
 *     description).
 *   - <link rel="canonical">.
 *
 * Exits non-zero on any failure and prints a human-readable report.
 *
 * Usage:
 *   node scripts/validate-seo.mjs                       # checks http://localhost:8080
 *   node scripts/validate-seo.mjs --port 3000           # custom port
 *   node scripts/validate-seo.mjs --url https://site/   # check a live URL
 */
import { setTimeout as wait } from "node:timers/promises";

const args = process.argv.slice(2);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const REMOTE_URL = valueOf("--url");
const DEV_PORT = valueOf("--port") || process.env.PORT || "8080";
const TARGET_URL = REMOTE_URL || `http://localhost:${DEV_PORT}/`;

// ---------- pretty printer ----------
const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

const issues = [];
const warns = [];
const passes = [];

const fail = (msg) => issues.push(msg);
const warn = (msg) => warns.push(msg);
const pass = (msg) => passes.push(msg);

// ---------- assertions ----------
function assertMeta(html, { name, property, required = true, label }) {
  const attr = name ? `name="${name}"` : `property="${property}"`;
  // Tolerant of attribute order: look for either order.
  const re = new RegExp(
    `<meta[^>]*(?:${attr}[^>]*content="([^"]*)"|content="([^"]*)"[^>]*${attr})`,
    "i",
  );
  const m = html.match(re);
  const value = m?.[1] ?? m?.[2];
  if (!value) {
    (required ? fail : warn)(`Missing meta ${label || name || property}`);
    return null;
  }
  pass(
    `meta ${label || name || property} = "${value.slice(0, 60)}${value.length > 60 ? "…" : ""}"`,
  );
  return value;
}

function checkHeadings(html) {
  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (h1s.length === 0) fail("No <h1> found on page");
  else if (h1s.length > 1) fail(`Multiple <h1> found (${h1s.length})`);
  else pass("Exactly one <h1>");
}

function checkCanonical(html) {
  const m = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  if (!m) fail('Missing <link rel="canonical">');
  else pass(`canonical = ${m[1]}`);
}

function checkJsonLd(html) {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [...html.matchAll(re)];
  if (blocks.length === 0) {
    fail("No JSON-LD <script> block found");
    return;
  }
  let foundService = false;
  for (const [, raw] of blocks) {
    let data;
    try {
      data = JSON.parse(raw.trim());
    } catch (e) {
      fail(`JSON-LD failed to parse: ${e.message}`);
      continue;
    }
    const arr = Array.isArray(data) ? data : [data];
    for (const node of arr) {
      if (!node["@context"]) fail("JSON-LD node missing @context");
      const type = node["@type"];
      if (
        type === "ProfessionalService" ||
        (Array.isArray(type) && type.includes("ProfessionalService"))
      ) {
        foundService = true;
        const required = ["name", "url", "telephone", "address", "description"];
        for (const k of required) {
          if (!node[k]) fail(`ProfessionalService JSON-LD missing "${k}"`);
        }
        if (node.address && typeof node.address === "object") {
          const addr = node.address;
          if (!addr.addressCountry) warn("ProfessionalService.address missing addressCountry");
          if (!addr.addressLocality) warn("ProfessionalService.address missing addressLocality");
        }
        if (foundService) pass("ProfessionalService JSON-LD valid");
      }
    }
  }
  if (!foundService) fail('JSON-LD found but no @type "ProfessionalService" node');
}

function runChecks(html) {
  checkHeadings(html);
  checkCanonical(html);

  assertMeta(html, { name: "description" });
  assertMeta(html, { name: "viewport" });
  assertMeta(html, { name: "robots", required: false });

  assertMeta(html, { property: "og:title" });
  assertMeta(html, { property: "og:description" });
  assertMeta(html, { property: "og:type" });
  assertMeta(html, { property: "og:url" });
  assertMeta(html, { property: "og:image", required: false, label: "og:image (recommended)" });

  assertMeta(html, { name: "twitter:card" });
  assertMeta(html, { name: "twitter:title" });
  assertMeta(html, { name: "twitter:description" });

  checkJsonLd(html);
}

// ---------- runners ----------
async function fetchUrl(url) {
  const res = await fetch(url, { headers: { "user-agent": "scalio-seo-validator/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return await res.text();
}

async function waitForServer(url, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return true;
    } catch {
      /* retry */
    }
    await wait(500);
  }
  return false;
}

async function main() {
  console.log(c.bold(`Validating ${TARGET_URL}\n`));

  if (!REMOTE_URL) {
    const ready = await waitForServer(TARGET_URL);
    if (!ready) {
      console.error(
        c.red(`No server reachable at ${TARGET_URL}.\n`) +
          `Start the dev server first (e.g. \`bun run dev\`) or pass --url.`,
      );
      process.exit(2);
    }
  }

  const html = await fetchUrl(TARGET_URL);
  runChecks(html);

  console.log("");
  for (const p of passes) console.log(c.green("✓ ") + p);
  for (const w of warns) console.log(c.yellow("! ") + w);
  for (const i of issues) console.log(c.red("✗ ") + i);

  console.log("");
  console.log(
    `${c.bold("SEO check:")} ${c.green(passes.length + " passed")}, ` +
      `${c.yellow(warns.length + " warnings")}, ${c.red(issues.length + " errors")}`,
  );

  if (issues.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error(c.red("Validator crashed:"), e);
  process.exit(2);
});

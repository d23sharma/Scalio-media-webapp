import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog-data";

const SITE_URL = "https://scaliomedia.in";
const TITLE = "Growth Playbook — Scalio Media Blog";
const DESCRIPTION =
  "Actionable strategies for Instagram growth, online business, and social media success.";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
});

type Filter = "All" | BlogCategory;

function BlogPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOG_POSTS.filter((p) => {
      const matchCat = filter === "All" || p.category === filter;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, filter]);

  return (
    <div className="bg-white dark:bg-[#0E1320] text-[#1A1A2E] dark:text-white overflow-x-hidden">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section className="relative pt-36 pb-16 overflow-hidden bg-hero">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60 animate-pulse-glow pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 30% 30%, oklch(0.68 0.18 245 / 0.25), transparent), radial-gradient(50% 50% at 70% 60%, oklch(0.78 0.18 160 / 0.2), transparent)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full glass-dark text-white text-xs font-semibold tracking-widest uppercase">
              Blog
            </span>
            <h1 className="mt-6 font-display font-bold text-5xl md:text-6xl text-white leading-tight">
              Growth <span className="text-gradient">Playbook</span>
            </h1>
            <p className="mt-5 text-white/75 text-lg max-w-2xl mx-auto">
              Actionable strategies for Instagram growth, online business, and social media success.
            </p>

            {/* Search */}
            <div className="mt-10 max-w-xl mx-auto">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="glass rounded-full flex items-center gap-3 px-5 py-3">
                <Search size={18} className="text-[#1B2A4A]" aria-hidden="true" />
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  className="flex-1 bg-transparent outline-none text-[#1A1A2E] placeholder:text-[#6B7280] text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Grid */}
        <section className="py-16 bg-[#F5F7FA] dark:bg-transparent">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="flex flex-wrap gap-2 justify-center"
              role="group"
              aria-label="Filter articles by category"
            >
              {BLOG_CATEGORIES.map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      active
                        ? "bg-gradient-brand text-white shadow-glow"
                        : "bg-white text-[#1A1A2E] border border-[#E5E7EB] hover:border-[#4A9EFF] dark:bg-white/5 dark:text-white dark:border-white/10"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Polite live region announces filter changes for screen readers */}
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
              data-testid="filter-status"
            >
              {posts.length === 0
                ? `No articles match. Filter: ${filter}. Search: ${query || "none"}.`
                : `Showing ${posts.length} article${posts.length === 1 ? "" : "s"}. Filter: ${filter}. Search: ${query || "none"}.`}
            </p>

            {posts.length === 0 ? (
              <div className="mt-16 text-center" data-testid="empty-state">
                <p className="text-[#6B7280] dark:text-white/70">
                  No articles match your search. Try a different keyword or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("All");
                  }}
                  className="mt-5 inline-flex items-center px-5 py-2 rounded-full bg-gradient-brand text-white text-sm font-semibold shadow-glow hover:scale-105 transition-transform"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((p) => (
                  <article key={p.slug} className="tilt-card glass rounded-3xl p-7 flex flex-col">
                    <span className="self-start px-3 py-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold tracking-widest uppercase">
                      {p.category}
                    </span>
                    <h2 className="mt-5 font-display font-bold text-xl text-[#1A1A2E] dark:text-white leading-snug">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-[#6B7280] dark:text-white/70 text-sm leading-relaxed flex-1">
                      {p.excerpt}
                    </p>
                    <div className="mt-6 pt-5 border-t border-[#E5E7EB]/60 dark:border-white/10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[#6B7280] dark:text-white/60 text-xs">
                        <Clock size={12} aria-hidden="true" /> {p.readTime}
                      </span>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        className="text-sm font-semibold text-[#1A1A2E] dark:text-white hover:text-[#4A9EFF] inline-flex items-center gap-1"
                        aria-label={`Read more: ${p.title}`}
                      >
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

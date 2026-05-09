import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-data";

const SITE_URL = "https://scaliomedia.in";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Post not found" }] };
    return {
      meta: [
        { title: `${post.title} — Scalio Media` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE_URL}/blog/${post.slug}` },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/blog/${post.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1A1A2E]">Post not found</h1>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-brand text-white font-semibold"
        >
          <ArrowLeft size={16} /> Back to blog
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-white text-center">
      <div>
        <p className="text-[#6B7280]">{error.message}</p>
        <Link to="/blog" className="mt-4 inline-block text-[#4A9EFF] underline">
          Back to blog
        </Link>
      </div>
    </div>
  ),
});

function BlogDetailPage() {
  const { post } = Route.useLoaderData();

  // Generate a simple long-form body from the excerpt so the page feels complete.
  const paragraphs = [
    post.excerpt,
    `In this piece we break down the playbook behind "${post.title}" — the exact tactics, sequencing, and pitfalls our team has learned shipping content for hundreds of brands.`,
    `Why it matters: most ${post.category.toLowerCase()} advice online is generic. The frameworks here are field-tested and built for operators who need outcomes, not theory.`,
    `What you'll take away: a repeatable system you can apply this week, plus benchmarks to measure whether it's working. Bookmark this post and revisit it as you scale.`,
  ];

  return (
    <div className="bg-white text-[#1A1A2E] overflow-x-hidden">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <header className="relative pt-36 pb-14 bg-hero text-white">
          <div className="relative max-w-3xl mx-auto px-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6"
            >
              <ArrowLeft size={16} /> Back to blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold tracking-widest uppercase">
              {post.category}
            </span>
            <h1 className="mt-5 font-display font-bold text-4xl md:text-5xl leading-tight">
              {post.title}
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 text-white/70 text-sm">
              <Clock size={14} /> {post.readTime}
            </div>
          </div>
        </header>

        <article className="max-w-3xl mx-auto px-6 py-16 prose-lg">
          <div
            className="rounded-3xl bg-gradient-to-br from-[#1B2A4A] to-[#4A9EFF] aspect-[16/9] flex items-center justify-center text-white text-center px-8 mb-10 shadow-card"
            aria-label={`Cover image for ${post.title}`}
          >
            <span className="font-display font-bold text-2xl md:text-3xl">{post.category}</span>
          </div>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[#1A1A2E] text-lg leading-relaxed mb-6">
              {p}
            </p>
          ))}
          <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex items-center justify-between">
            <Link
              to="/blog"
              className="text-sm font-semibold text-[#1B2A4A] hover:text-[#4A9EFF] inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> All articles
            </Link>
            <Link
              to="/"
              hash="contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-brand text-white text-sm font-semibold shadow-glow"
            >
              Work with us
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

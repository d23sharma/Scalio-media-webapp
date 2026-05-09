import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FEATURED_POSTS } from "@/lib/blog-data";

export const BlogPreview = () => {
  return (
    <section id="blog" className="relative py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5F7FA] text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase">
              From the Blog
            </span>
            <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
              Growth <span className="text-gradient">Playbook</span>
            </h2>
            <p className="mt-4 text-[#6B7280] text-lg">
              Tactical breakdowns from the campaigns we run every day.
            </p>
          </motion.div>

          <Link
            to="/blog"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A2E] text-white text-sm font-semibold hover:bg-[#1B2A4A] transition-colors"
          >
            View All Posts <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_POSTS.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="tilt-card p-7 rounded-3xl bg-white border border-[#F5F7FA] shadow-card flex flex-col"
            >
              <span className="self-start px-3 py-1 rounded-full bg-gradient-brand text-white text-[10px] font-bold tracking-widest uppercase">
                {p.category}
              </span>
              <h3 className="mt-5 font-display font-bold text-xl text-[#1A1A2E] leading-snug">
                {p.title}
              </h3>
              <p className="mt-3 text-[#6B7280] text-sm leading-relaxed flex-1">
                {p.excerpt}
              </p>
              <div className="mt-6 pt-5 border-t border-[#F5F7FA] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[#6B7280] text-xs">
                  <Clock size={12} aria-hidden="true" /> {p.readTime}
                </span>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="text-sm font-semibold text-[#1A1A2E] hover:text-[#4A9EFF] inline-flex items-center gap-1"
                  aria-label={`Read more: ${p.title}`}
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="md:hidden mt-10 flex justify-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A2E] text-white text-sm font-semibold"
          >
            View All Posts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";

const packages = [
  {
    slug: "starter" as const,
    name: "Starter Growth Pack",
    badge: "Best for Beginners",
    features: [
      "12 posts/month (4 Reels + 8 Carousels)",
      "Caption writing + Hashtag strategy",
      "Profile optimisation",
      "Monthly performance report",
    ],
    highlighted: false,
  },
  {
    slug: "standard" as const,
    name: "Standard Brand Pack",
    badge: "Most Popular",
    features: [
      "20 posts + 8 Reels/month",
      "SEO integration",
      "Story templates",
      "Competitor analysis",
      "Weekly strategy calls",
    ],
    highlighted: true,
  },
  {
    slug: "premium" as const,
    name: "Premium Scale Pack",
    badge: "Best Results",
    features: [
      "Everything in Standard",
      "Meta Ads management",
      "Lead generation campaigns",
      "4K video shoot (8 videos)",
      "Script writing + viral hook strategy",
    ],
    highlighted: false,
  },
];

export const Packages = () => {
  return (
    <section
      id="packages"
      className="relative py-28 bg-gradient-to-b from-[#F5F7FA] via-white to-[#F5F7FA]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase shadow-sm">
            Pricing
          </span>
          <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E]">
            Pick a Plan That <span className="text-gradient">Fits Your Goals</span>
          </h2>
          <p className="mt-5 text-[#6B7280] text-lg">
            Custom-tailored growth plans. No long-term contracts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                p.highlighted
                  ? "bg-[#1B2A4A] text-white shadow-glow ring-1 ring-[#4A9EFF]/40 md:scale-105 animate-pulse-glow"
                  : "bg-white shadow-card hover:shadow-elegant"
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-brand text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-glow-green">
                  <Sparkles size={12} /> MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                    p.highlighted ? "bg-white/10 text-[#00D48A]" : "bg-[#F5F7FA] text-[#1B2A4A]"
                  }`}
                >
                  {p.badge}
                </span>
                <h3
                  className={`mt-4 font-display font-bold text-2xl ${
                    p.highlighted ? "text-white" : "text-[#1A1A2E]"
                  }`}
                >
                  {p.name}
                </h3>
                <div
                  className={`mt-4 font-mono-brand text-3xl font-bold ${
                    p.highlighted ? "text-gradient" : "text-[#1B2A4A]"
                  }`}
                >
                  Custom
                </div>
                <p className={`text-sm ${p.highlighted ? "text-white/60" : "text-[#6B7280]"}`}>
                  Tailored to your business
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        p.highlighted ? "bg-[#00D48A]/20" : "bg-[#00D48A]/10"
                      }`}
                    >
                      <Check size={12} className="text-[#00D48A]" />
                    </span>
                    <span
                      className={`text-sm leading-relaxed ${
                        p.highlighted ? "text-white/90" : "text-[#1A1A2E]"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/growth-plan/$plan"
                params={{ plan: p.slug }}
                onClick={() => track("package_get_started", { plan: p.slug, name: p.name })}
                className={`group flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-semibold transition-all ${
                  p.highlighted
                    ? "bg-gradient-brand text-white hover:scale-105"
                    : "bg-[#1B2A4A] text-white hover:bg-[#1A1A2E]"
                }`}
              >
                Get Started
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

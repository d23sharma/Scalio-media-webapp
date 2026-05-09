import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Calendar,
  TrendingUp,
  Target,
  Sparkles,
  MessageCircle,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { useEffect, useState } from "react";

const SITE_URL = "https://scaliomedia.in";

type PlanSlug = "starter" | "standard" | "premium";

interface MonthBlock {
  title: string;
  focus: string;
  deliverables: string[];
  kpi: string;
}

interface Plan {
  slug: PlanSlug;
  name: string;
  badge: string;
  tagline: string;
  goal: string;
  duration: string;
  audience: string;
  months: MonthBlock[];
  outcomes: string[];
  highlighted: boolean;
}

const PLANS: Record<PlanSlug, Plan> = {
  starter: {
    slug: "starter",
    name: "Starter Growth Pack",
    badge: "Best for Beginners",
    tagline: "Build a credible, consistent presence in 90 days.",
    goal: "Reach 10K engaged followers with a clear brand identity.",
    duration: "90-day plan",
    audience: "Solo founders, local businesses, and creators just getting started.",
    highlighted: false,
    months: [
      {
        title: "Month 1 — Foundation",
        focus: "Profile lift-off & content engine",
        deliverables: [
          "Brand audit + competitor breakdown",
          "Bio, highlights & profile optimisation",
          "12 posts (4 Reels + 8 Carousels)",
          "Caption + hashtag system",
        ],
        kpi: "+25% profile visits, +15% follower growth",
      },
      {
        title: "Month 2 — Momentum",
        focus: "Voice consistency & first viral attempts",
        deliverables: [
          "12 posts with refined hooks",
          "2 trend-jacking Reels per week",
          "Story templates (10 reusable)",
          "Engagement playbook for DMs",
        ],
        kpi: "2× reach, +30% saves & shares",
      },
      {
        title: "Month 3 — Scale",
        focus: "Repeatable wins & monthly reporting",
        deliverables: [
          "12 posts + best-performer remixes",
          "Monthly performance report",
          "Content calendar handover",
          "Strategy call: what to double down on",
        ],
        kpi: "10K engaged audience milestone",
      },
    ],
    outcomes: [
      "A profile that converts visitors into followers",
      "A repeatable weekly content rhythm",
      "Clear data on what your audience loves",
    ],
  },
  standard: {
    slug: "standard",
    name: "Standard Brand Pack",
    badge: "Most Popular",
    tagline: "Become the brand people remember in your category.",
    goal: "Hit 50K reach/month with a recognisable, high-trust brand.",
    duration: "120-day plan",
    audience: "Growing brands, D2C, and service businesses ready to scale.",
    highlighted: true,
    months: [
      {
        title: "Month 1 — Strategy Sprint",
        focus: "Positioning, SEO & competitor mapping",
        deliverables: [
          "Deep competitor + keyword analysis",
          "SEO-integrated content pillars",
          "20 posts + 8 Reels",
          "Story template kit + weekly call",
        ],
        kpi: "+40% impressions, +20% follower growth",
      },
      {
        title: "Month 2 — Authority",
        focus: "Thought leadership + viral hooks",
        deliverables: [
          "20 posts + 8 Reels (hook-tested)",
          "Carousel series for saves",
          "Influencer collab shortlist",
          "Weekly strategy + analytics call",
        ],
        kpi: "3× saves, +50% shares",
      },
      {
        title: "Month 3 — Conversion",
        focus: "Turn reach into leads",
        deliverables: [
          "20 posts + 8 Reels + CTAs",
          "Lead magnet launch",
          "DM funnel + booking automation",
          "Mid-plan review & optimisation",
        ],
        kpi: "First 100 inbound leads",
      },
      {
        title: "Month 4 — Compounding",
        focus: "Scale the formula that works",
        deliverables: [
          "20 posts + 8 Reels (data-driven)",
          "Re-edit & repost top performers",
          "Quarterly brand performance report",
          "Roadmap for the next quarter",
        ],
        kpi: "50K reach/month sustained",
      },
    ],
    outcomes: [
      "A recognised brand voice in your niche",
      "Predictable lead flow from organic content",
      "An SEO + social engine that compounds monthly",
    ],
  },
  premium: {
    slug: "premium",
    name: "Premium Scale Pack",
    badge: "Best Results",
    tagline: "Scale aggressively with content + paid + lead-gen working as one.",
    goal: "Generate qualified leads daily with a full-funnel growth engine.",
    duration: "180-day plan",
    audience: "Established brands and high-ticket businesses ready to dominate.",
    highlighted: false,
    months: [
      {
        title: "Months 1–2 — Production Engine",
        focus: "4K shoots, scripts & viral hooks",
        deliverables: [
          "8 cinematic 4K videos",
          "Script writing + viral hook library",
          "Everything in Standard, scaled 1.5×",
          "Dedicated content producer",
        ],
        kpi: "Premium asset library shipped",
      },
      {
        title: "Months 3–4 — Paid Acceleration",
        focus: "Meta Ads + retargeting funnel",
        deliverables: [
          "Meta Ads management (full setup)",
          "Creative testing (5 angles/week)",
          "Pixel + CAPI + conversion tracking",
          "Weekly ad performance review",
        ],
        kpi: "ROAS 3×+, CPL down 40%",
      },
      {
        title: "Months 5–6 — Lead Gen at Scale",
        focus: "Full funnel optimisation",
        deliverables: [
          "Lead-gen campaigns (multi-channel)",
          "Landing page CRO sprints",
          "CRM + WhatsApp automation",
          "Quarterly board-ready report",
        ],
        kpi: "Daily qualified leads on autopilot",
      },
    ],
    outcomes: [
      "A predictable, paid + organic lead machine",
      "Best-in-class creative that competitors copy",
      "A growth team without the overhead",
    ],
  },
};

export const Route = createFileRoute("/growth-plan/$plan")({
  component: GrowthPlanPage,
  head: ({ params }) => {
    const slug = params.plan as PlanSlug;
    const plan = PLANS[slug];
    if (!plan) {
      return {
        meta: [{ title: "Growth Plan — Scalio Media" }],
      };
    }
    const title = `${plan.name} — ${plan.duration} Growth Plan | Scalio Media`;
    const description = `${plan.tagline} ${plan.goal}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE_URL}/growth-plan/${slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/growth-plan/${slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Plan not found</h1>
        <Link to="/" className="mt-4 inline-block text-[#4A9EFF] underline">
          Back to home
        </Link>
      </div>
    </div>
  ),
});

function GrowthPlanPage() {
  const { plan: slug } = useParams({ from: "/growth-plan/$plan" });
  const plan = PLANS[slug as PlanSlug];

  useEffect(() => {
    if (plan) {
      track("growth_plan_view", { plan: plan.slug });
    }
  }, [plan]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Plan not found</h1>
          <p className="mt-2 text-[#6B7280]">The growth plan you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-brand text-white font-semibold"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#1A1A2E] min-h-screen">
      {/* Hero band */}
      <header className="relative bg-hero text-white pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#4A9EFF]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#00D48A]/20 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <Link
            to="/"
            onClick={() => track("growth_plan_back", { plan: plan.slug })}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8"
          >
            <ArrowLeft size={16} /> Back to packages
          </Link>

          <span className="inline-block px-4 py-1.5 rounded-full glass-dark text-white/90 text-xs font-bold tracking-widest uppercase">
            {plan.badge} · {plan.duration}
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 font-display font-bold text-4xl md:text-6xl leading-tight"
          >
            {plan.name}
          </motion.h1>

          <p className="mt-5 text-lg md:text-xl text-white/75 max-w-3xl">{plan.tagline}</p>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            <InfoCard icon={<Target size={18} />} label="Goal" value={plan.goal} />
            <InfoCard icon={<Calendar size={18} />} label="Duration" value={plan.duration} />
            <InfoCard icon={<TrendingUp size={18} />} label="Built for" value={plan.audience} />
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase shadow-sm">
              Roadmap
            </span>
            <h2 className="mt-6 font-display font-bold text-3xl md:text-4xl text-[#1A1A2E]">
              Your <span className="text-gradient">{plan.duration}</span> roadmap
            </h2>
          </div>

          <ol className="relative border-l-2 border-[#1B2A4A]/10 ml-3 space-y-10">
            {plan.months.map((m, i) => (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="pl-8 relative"
              >
                <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-gradient-brand shadow-glow" />
                <h3 className="font-display font-bold text-xl text-[#1A1A2E]">{m.title}</h3>
                <p className="mt-1 text-[#1B2A4A] font-semibold text-sm uppercase tracking-wider">
                  {m.focus}
                </p>
                <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
                  {m.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-[#1A1A2E] text-sm">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#00D48A]/15 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-[#00D48A]" />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#1B2A4A] bg-white px-3 py-1.5 rounded-full shadow-sm">
                  <Sparkles size={12} className="text-[#4A9EFF]" /> Target KPI: {m.kpi}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1A1A2E] text-center">
            What you'll <span className="text-gradient">walk away with</span>
          </h2>
          <ul className="mt-10 grid sm:grid-cols-3 gap-5">
            {plan.outcomes.map((o) => (
              <li key={o} className="bg-[#F5F7FA] rounded-2xl p-6 text-[#1A1A2E] shadow-card">
                <Check className="text-[#00D48A] mb-3" size={22} />
                <p className="text-sm leading-relaxed">{o}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Buy package */}
      <BuyPackageSection planName={plan.name} />

      {/* CTA */}
      <section className="py-20 bg-[#1B2A4A] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl md:text-4xl">
            Ready to start your <span className="text-gradient">{plan.duration}</span>?
          </h2>
          <p className="mt-4 text-white/70">
            Talk to our team and we'll tailor this plan to your business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/918408811234"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("growth_plan_cta", { plan: plan.slug, channel: "whatsapp" })}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow hover:scale-105 transition-transform"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
            <Link
              to="/"
              hash="contact-form"
              onClick={() => track("growth_plan_cta", { plan: plan.slug, channel: "form" })}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-dark text-white font-semibold hover:bg-white/15"
            >
              Book a free audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-dark rounded-2xl p-5">
      <div className="flex items-center gap-2 text-[#00D48A] text-xs uppercase tracking-widest font-bold">
        {icon} {label}
      </div>
      <p className="mt-2 text-white text-sm leading-snug">{value}</p>
    </div>
  );
}

type PayMethod = "card-credit" | "card-debit" | "upi";

function BuyPackageSection({ planName }: { planName: string }) {
  const [method, setMethod] = useState<PayMethod>("card-credit");
  const navigate = useNavigate();
  const options: { id: PayMethod; label: string; icon: React.ReactNode; hint: string }[] = [
    {
      id: "card-credit",
      label: "Credit Card",
      icon: <CreditCard size={20} />,
      hint: "Visa, Mastercard, Amex",
    },
    { id: "card-debit", label: "Debit Card", icon: <Wallet size={20} />, hint: "All major banks" },
    { id: "upi", label: "UPI", icon: <Smartphone size={20} />, hint: "GPay, PhonePe, Paytm" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5F7FA] text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase">
            Buy Package
          </span>
          <h2 className="mt-6 font-display font-bold text-3xl md:text-4xl text-[#1A1A2E]">
            Get the <span className="text-gradient">{planName}</span>
          </h2>
          <p className="mt-3 text-[#6B7280]">Choose a payment method to continue.</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Payment method"
          className="mt-10 grid sm:grid-cols-3 gap-4"
        >
          {options.map((o) => {
            const active = method === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMethod(o.id)}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  active
                    ? "border-[#4A9EFF] bg-[#F5F9FF] shadow-card"
                    : "border-[#E5E7EB] bg-white hover:border-[#4A9EFF]/60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? "bg-gradient-brand text-white" : "bg-[#F5F7FA] text-[#1B2A4A]"}`}
                >
                  {o.icon}
                </div>
                <p className="mt-3 font-semibold text-[#1A1A2E]">{o.label}</p>
                <p className="text-xs text-[#6B7280] mt-1">{o.hint}</p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-8 w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow hover:scale-[1.02] transition-transform"
          onClick={() => {
            track("buy_package_proceed", { plan: planName, method });
            navigate({ to: "/payment", search: { method, plan: planName, amount: "" } });
          }}
        >
          Proceed to Pay
        </button>
        <p className="mt-3 text-center text-xs text-[#6B7280]">
          Demo only — no payment will be processed.
        </p>
      </div>
    </section>
  );
}

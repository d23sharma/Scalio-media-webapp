import { motion } from "framer-motion";
import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  handle: string;
  initials: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Aarav Mehta",
    handle: "@aarav.fitcoach",
    initials: "AM",
    quote:
      "Went from 1.2K to 47K followers in 4 months. The reels strategy alone changed my business.",
  },
  {
    name: "Priya Sharma",
    handle: "Founder, Bloom Beauty",
    initials: "PS",
    quote:
      "Engagement rate jumped from 1.8% to 7.4%. We're booked out 6 weeks ahead from Instagram leads.",
  },
  {
    name: "Rohan Kapoor",
    handle: "Kapoor & Sons Realty",
    initials: "RK",
    quote:
      "Saved ~20 hours/week and closed ₹38L in property deals sourced directly from DMs last quarter.",
  },
  {
    name: "Neha Iyer",
    handle: "@nehacooks",
    initials: "NI",
    quote:
      "First viral reel hit 2.3M views in week 3. Brand collabs started rolling in the next week.",
  },
  {
    name: "Vikram Singh",
    handle: "CEO, NorthGear",
    initials: "VS",
    quote: "Instagram is now our #1 revenue channel — ₹12L+/month in tracked sales, up from zero.",
  },
  {
    name: "Sanya Verma",
    handle: "Verma Pediatric Clinic",
    initials: "SV",
    quote:
      "30+ new patient enquiries every month. The team finally feels like an in-house marketing arm.",
  },
];

const Card = ({ t, i }: { t: Testimonial; i: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="tilt-card p-7 rounded-3xl bg-white border border-[#F5F7FA] shadow-card flex flex-col"
  >
    <div className="flex items-center gap-1 text-[#FFB400]" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star key={idx} size={16} fill="currentColor" stroke="currentColor" aria-hidden="true" />
      ))}
    </div>
    <p className="mt-5 text-[#1A1A2E] leading-relaxed">"{t.quote}"</p>
    <div className="mt-6 flex items-center gap-3 pt-5 border-t border-[#F5F7FA]">
      <div
        className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm"
        aria-hidden="true"
      >
        {t.initials}
      </div>
      <div>
        <div className="font-semibold text-[#1A1A2E] text-sm">{t.name}</div>
        <div className="text-[#6B7280] text-xs">{t.handle}</div>
      </div>
    </div>
  </motion.article>
);

export const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-28 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
            Real Brands. <span className="text-gradient">Real Results.</span>
          </h2>
          <p className="mt-5 text-[#6B7280] text-lg">
            Don't take our word for it — here's what founders & creators say after working with
            Scalio Media.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

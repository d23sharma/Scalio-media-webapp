import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const tags = [
  "Restaurants",
  "Clinics",
  "Real Estate",
  "Coaches",
  "D2C Brands",
  "Salons",
  "Fitness",
  "Education",
];

const stats = [
  { value: 50, suffix: "+", label: "Clients" },
  { value: 200, suffix: "+", label: "Reels Created" },
  { value: 98, suffix: "%", label: "Retention Rate" },
  { value: 3, suffix: "M+", label: "Reach Generated" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref} className="font-mono-brand">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export const TrustBar = () => {
  return (
    <section
      aria-labelledby="trustbar-heading"
      className="relative bg-[#F5F7FA] py-16 overflow-hidden"
    >
      <h2 id="trustbar-heading" className="sr-only">
        Trusted by leading brands across India
      </h2>
      {/* Marquee */}
      <div className="relative overflow-hidden mb-12 py-4">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F5F7FA] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F5F7FA] to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee">
          {[...tags, ...tags, ...tags].map((tag, i) => (
            <div key={i} className="flex items-center gap-6 px-6">
              <span className="text-sm font-semibold tracking-widest text-[#1A1A2E]/40 uppercase">
                Trusted by 50+ brands
              </span>
              <span className="px-5 py-2 rounded-full bg-white shadow-sm text-[#1A1A2E] font-medium text-sm whitespace-nowrap">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center p-6 rounded-2xl bg-white shadow-card"
          >
            <div className="text-4xl md:text-5xl font-bold text-gradient">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-[#6B7280] font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

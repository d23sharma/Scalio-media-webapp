import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const stats = [
  { value: 3, suffix: "M+", label: "Total Reach" },
  { value: 200, suffix: "+", label: "Videos Created" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 98, suffix: "%", label: "Client Retention" },
];

const points = ["No long-term contracts", "Weekly strategy calls", "Dedicated account manager"];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toString());

  useEffect(() => {
    if (inView) {
      const c = animate(count, to, { duration: 2, ease: "easeOut" });
      return c.stop;
    }
  }, [inView, to, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export const Results = () => {
  return (
    <section id="results" className="relative py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5F7FA] text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase">
            Why Us
          </span>
          <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
            Why 50+ Brands <span className="text-gradient">Trust Scalio Media</span>
          </h2>
          <p className="mt-6 text-[#6B7280] text-lg leading-relaxed">
            We don't just post content — we build brands. Our team blends creative storytelling with
            data-driven strategy to deliver measurable, sustainable growth for businesses across
            India.
          </p>

          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-[#1A1A2E] font-medium"
              >
                <CheckCircle2 className="text-[#00D48A] flex-shrink-0" size={22} />
                {p}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="grid grid-cols-2 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`tilt-card p-7 rounded-3xl bg-white shadow-card border border-[#F5F7FA] ${
                i % 2 === 1 ? "translate-y-6" : ""
              }`}
            >
              <div className="font-mono-brand text-4xl md:text-5xl font-bold text-gradient">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-[#6B7280] text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

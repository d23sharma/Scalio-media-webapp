import { motion } from "framer-motion";
import { Search, MessageSquare, Video, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Free Audit",
    desc: "We analyse your current social media presence and identify growth opportunities.",
  },
  {
    icon: MessageSquare,
    title: "Strategy Call",
    desc: "We build a custom growth plan tailored to your business goals and target audience.",
  },
  {
    icon: Video,
    title: "Content Creation",
    desc: "Our team creates scroll-stopping content — reels, carousels, ads — designed to convert.",
  },
  {
    icon: Rocket,
    title: "Grow & Scale",
    desc: "We post, monitor, optimise, and report. You focus on business. We handle the growth.",
  },
];

export const Process = () => {
  return (
    <section className="relative py-28 bg-hero overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-[#4A9EFF]/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 rounded-full bg-[#00D48A]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-dark text-white/90 text-xs font-semibold tracking-widest uppercase">
            Our Process
          </span>
          <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-white">
            How We <span className="text-gradient">Make It Happen</span>
          </h2>
          <p className="mt-5 text-white/60 text-lg">
            A proven 4-step process to take your brand from invisible to unmissable.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px origin-left bg-gradient-to-r from-[#4A9EFF] via-[#00D48A] to-[#4A9EFF]"
          />

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className="relative text-center px-2"
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-brand shadow-glow mb-5">
                    <Icon size={32} className="text-white" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white text-[#1B2A4A] font-mono-brand text-xs font-bold flex items-center justify-center">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

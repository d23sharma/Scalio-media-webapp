import { motion } from "framer-motion";
import { Smartphone, Clapperboard, Target, TrendingUp } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    emoji: "📱",
    title: "Instagram & Facebook Growth",
    desc: "Consistent posting, viral reels, community building, and algorithm-optimised content strategy that grows your followers and engagement every month.",
  },
  {
    icon: Clapperboard,
    emoji: "🎬",
    title: "Video Production & Editing",
    desc: "4K quality shoots, professional editing, script writing, and viral hook strategy. 10–12 videos per month that stop the scroll and drive action.",
  },
  {
    icon: Target,
    emoji: "🎯",
    title: "Meta Ads & Lead Generation",
    desc: "High-converting Meta ad campaigns (Facebook + Instagram) designed to generate quality leads, increase sales, and maximise your ad spend ROI.",
  },
  {
    icon: TrendingUp,
    emoji: "📈",
    title: "SEO & YouTube Growth",
    desc: "Search engine optimisation and YouTube channel management to build long-term organic traffic, authority, and inbound leads for your business.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="relative py-28 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase shadow-sm">
            What We Do
          </span>
          <h2 className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E] leading-tight">
            Services Built to <span className="text-gradient">Scale</span> Your Brand
          </h2>
          <p className="mt-5 text-[#6B7280] text-lg">
            Everything you need under one roof — strategy, content, ads, and growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="tilt-card group relative p-8 rounded-3xl bg-white shadow-card overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-brand text-white shadow-glow mb-6">
                    <Icon size={26} />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <h3 className="font-display font-bold text-xl text-[#1A1A2E]">{s.title}</h3>
                  </div>
                  <p className="text-[#6B7280] leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

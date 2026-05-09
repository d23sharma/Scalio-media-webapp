import { motion } from "framer-motion";
import { Phone, MessageCircle, ChevronDown, Instagram, Facebook, Youtube } from "lucide-react";
import { track } from "@/lib/analytics";

export const Hero = () => {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero"
    >
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#4A9EFF]/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#00D48A]/20 blur-3xl animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[#4A9EFF]/10 blur-3xl" />
      </div>

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating social icons — visible on all breakpoints */}
      <motion.div
        className="absolute top-24 left-3 sm:top-28 sm:left-[6%] md:left-[8%] z-10"
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="glass-dark p-2.5 sm:p-3 md:p-4 rounded-2xl">
          <Instagram className="text-[#4A9EFF] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </div>
      </motion.div>
      <motion.div
        className="absolute top-1/4 right-3 sm:top-1/3 sm:right-[6%] md:right-[10%] z-10"
        animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        aria-hidden="true"
      >
        <div className="glass-dark p-2.5 sm:p-3 md:p-4 rounded-2xl">
          <Youtube className="text-[#00D48A] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-28 left-3 sm:bottom-32 sm:left-[8%] md:left-[12%] z-10"
        animate={{ y: [0, -15, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        aria-hidden="true"
      >
        <div className="glass-dark p-2.5 sm:p-3 md:p-4 rounded-2xl">
          <Facebook className="text-[#4A9EFF] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-white/90 text-xs font-medium tracking-wide mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D48A] animate-pulse" />
          INDIA'S PREMIUM SOCIAL MEDIA AGENCY
        </motion.div>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight"
        >
          Grow Your Brand. <br />
          <span className="text-gradient">Dominate</span> Social Media.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          We build scroll-stopping content, run high-ROI ad campaigns, and grow your audience — so
          you can focus on running your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="tel:+918408811234"
            onClick={() =>
              track("cta_click", { location: "hero", label: "Call Now", channel: "phone" })
            }
            aria-label="Call Scalio Media at +91 84088 11234"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow hover:scale-105 transition-transform"
          >
            <Phone size={18} aria-hidden="true" />
            Call Now
          </a>
          <a
            href="https://wa.me/918408811234"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("cta_click", { location: "hero", label: "WhatsApp Us", channel: "whatsapp" })
            }
            aria-label="Chat with Scalio Media on WhatsApp (opens in new tab)"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full glass-dark text-white font-semibold hover:bg-white/15 transition-colors"
          >
            <MessageCircle size={18} className="text-[#00D48A]" aria-hidden="true" />
            WhatsApp Us
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce-slow"
        aria-hidden="true"
      >
        <ChevronDown size={28} />
      </div>
    </section>
  );
};

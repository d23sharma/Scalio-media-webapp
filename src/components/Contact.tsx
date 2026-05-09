import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, Globe } from "lucide-react";
import { track } from "@/lib/analytics";

const items = [
  { icon: Phone, label: "Call", value: "+91 84088 11234", href: "tel:+918408811234" },
  { icon: MessageCircle, label: "WhatsApp", value: "wa.me/918408811234", href: "https://wa.me/918408811234" },
  { icon: Mail, label: "Email", value: "hello@scaliomedia.in", href: "mailto:hello@scaliomedia.in" },
  { icon: MapPin, label: "Location", value: "Bhopal, Madhya Pradesh, India", href: "#" },
  { icon: Globe, label: "Website", value: "scaliomedia.in", href: "#" },
];

export const Contact = () => {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5F7FA] text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase">
            Get in Touch
          </span>
          <h2 id="contact-heading" className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E]">
            Let's Build Something <span className="text-gradient">Great Together</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 md:p-10 bg-[#F5F7FA] shadow-card"
          >
            <h3 className="font-display font-bold text-2xl text-[#1A1A2E] mb-6">
              Contact Details
            </h3>
            <div className="space-y-4">
              {items.map((it) => {
                const Icon = it.icon;
                const isExternal = it.href.startsWith("http");
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={`${it.label}: ${it.value}${isExternal ? " (opens in new tab)" : ""}`}
                    onClick={() =>
                      track("contact_click", { location: "contact_section", channel: it.label.toLowerCase() })
                    }
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white hover:shadow-card transition-all"
                  >
                    <div
                      className="w-11 h-11 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow flex-shrink-0"
                      aria-hidden="true"
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        {it.label}
                      </p>
                      <p className="text-[#1A1A2E] font-medium truncate group-hover:text-[#4A9EFF] transition-colors">
                        {it.value}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 md:p-10 bg-hero overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#4A9EFF]/30 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#00D48A]/30 blur-3xl" aria-hidden="true" />

            <div className="relative glass-dark rounded-2xl p-8">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00D48A]/20 text-[#00D48A] text-xs font-bold tracking-widest uppercase">
                Free Consultation
              </span>
              <h3 className="mt-5 font-display font-bold text-3xl text-white leading-tight">
                Book a Free <br />
                <span className="text-gradient">Strategy Call</span>
              </h3>
              <p className="mt-4 text-white/70">
                Talk directly with our growth team. Zero pressure, all value.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href="https://wa.me/918408811234"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Scalio Media on WhatsApp (opens in new tab)"
                  onClick={() => track("cta_click", { location: "contact_card", channel: "whatsapp" })}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#00D48A] text-white font-semibold shadow-glow-green hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle size={18} aria-hidden="true" /> Message on WhatsApp
                </a>
                <a
                  href="tel:+918408811234"
                  aria-label="Call Scalio Media at +91 84088 11234"
                  onClick={() => track("cta_click", { location: "contact_card", channel: "phone" })}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-white text-[#1B2A4A] font-semibold hover:scale-[1.02] transition-transform"
                >
                  <Phone size={18} aria-hidden="true" /> Call +91 84088 11234
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

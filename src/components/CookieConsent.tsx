import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent, isDoNotTrack, onConsentChange, type Consent } from "@/lib/consent";

/**
 * GDPR-style cookie consent banner.
 *
 * - Hidden when the browser signals Do Not Track / Global Privacy Control
 *   (we treat that as an implicit "denied" and never show the banner).
 * - Hidden once the user has explicitly accepted or declined.
 * - Reacts to consent changes from other tabs/components via custom event.
 */
export const CookieConsent = () => {
  const [consent, setLocal] = useState<Consent>("unknown");
  const [dnt, setDnt] = useState(false);

  useEffect(() => {
    setLocal(getConsent());
    setDnt(isDoNotTrack());
    const off = onConsentChange((v) => setLocal(v));
    return off;
  }, []);

  const visible = consent === "unknown" && !dnt;

  const accept = () => setConsent("granted");
  const decline = () => setConsent("denied");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cc-title"
          aria-describedby="cc-desc"
          className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-[60]"
        >
          <div className="rounded-2xl bg-[#1B2A4A] text-white p-5 md:p-6 shadow-elegant border border-white/10">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <Cookie size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p id="cc-title" className="font-display font-bold text-base">
                  We value your privacy
                </p>
                <p id="cc-desc" className="mt-1.5 text-sm text-white/70 leading-relaxed">
                  We use analytics cookies to understand how visitors use our site and improve our
                  services. Nothing fires until you say yes.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={accept}
                    className="px-4 py-2 rounded-full bg-gradient-brand text-white text-sm font-semibold hover:scale-[1.03] transition-transform"
                  >
                    Accept analytics
                  </button>
                  <button
                    type="button"
                    onClick={decline}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={decline}
                aria-label="Decline analytics and dismiss"
                className="text-white/60 hover:text-white p-1 rounded-md"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

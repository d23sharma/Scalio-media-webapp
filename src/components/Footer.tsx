import { Instagram, Facebook, Youtube, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { track } from "@/lib/analytics";

const links = [
  { label: "Home", hash: "home" },
  { label: "Services", hash: "services" },
  { label: "Packages", hash: "packages" },
  { label: "Contact", hash: "contact" },
];

const socials = [
  { Icon: Instagram, href: "https://instagram.com/scaliomedia", label: "Instagram" },
  { Icon: Facebook, href: "https://facebook.com/scaliomedia", label: "Facebook" },
  { Icon: Youtube, href: "https://youtube.com/@scaliomedia", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[#1B2A4A] text-white overflow-hidden" role="contentinfo">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-px bg-gradient-to-r from-transparent via-[#4A9EFF]/40 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Logo size={42} />
              <span className="font-display font-bold text-xl">
                Scalio<span className="text-gradient"> Media</span>
              </span>
            </div>
            <p className="text-white/70 text-lg font-display">Your Growth. Our Responsibility.</p>
          </div>

          <nav aria-label="Footer">
            <h2
              id="footer-quick-links"
              className="font-display font-bold text-sm uppercase tracking-widest text-white/60 mb-5"
            >
              Quick Links
            </h2>
            <ul className="space-y-3" aria-labelledby="footer-quick-links">
              {links.map((l) => (
                <li key={l.hash}>
                  <Link
                    to="/"
                    hash={l.hash}
                    onClick={() => track("nav_click", { location: "footer", label: l.label })}
                    className="text-white/80 hover:text-[#00D48A] transition-colors rounded-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2
              id="footer-social"
              className="font-display font-bold text-sm uppercase tracking-widest text-white/60 mb-5"
            >
              Follow Us
            </h2>
            <ul className="flex gap-3" aria-labelledby="footer-social">
              {socials.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    onClick={() => track("social_click", { location: "footer", network: label })}
                    className="w-11 h-11 rounded-xl glass-dark flex items-center justify-center hover:bg-gradient-brand hover:scale-110 transition-all"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-white/60">@scaliomedia</p>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Scalio Media. All rights reserved.
          </p>
          <p className="text-sm text-white/60 flex items-center gap-1.5">
            Made with{" "}
            <Heart size={14} aria-label="love" className="text-[#00D48A] fill-[#00D48A]" /> in
            Bhopal, India
          </p>
        </div>
      </div>
    </footer>
  );
};

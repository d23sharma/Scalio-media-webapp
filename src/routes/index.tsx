import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Packages } from "@/components/Packages";
import { Process } from "@/components/Process";
import { Results } from "@/components/Results";
import { ContactForm } from "@/components/ContactForm";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";

const SITE_URL = "https://scaliomedia.in";
const TITLE = "Scalio Media — Premium Social Media Marketing Agency in India";
const DESCRIPTION =
  "Grow your brand with India's premium social media agency. Viral reels, Meta ads, lead generation, and SEO — built to scale your business.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Scalio Media",
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: "+91-84088-11234",
  email: "hello@scaliomedia.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  areaServed: "IN",
  sameAs: [
    "https://instagram.com/scaliomedia",
    "https://facebook.com/scaliomedia",
    "https://youtube.com/@scaliomedia",
  ],
  priceRange: "₹₹",
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "social media marketing India, Instagram growth, Meta ads, reels production, SEO agency Bhopal, digital marketing agency, lead generation, YouTube marketing",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Scalio Media" },

      { property: "og:title", content: "Scalio Media — Grow Your Brand. Dominate Social Media." },
      {
        property: "og:description",
        content:
          "Premium social media marketing for ambitious brands. Reels, ads, growth strategy — done for you.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: "Scalio Media" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Scalio Media — Grow Your Brand. Dominate Social Media." },
      {
        name: "twitter:description",
        content:
          "Premium social media marketing for ambitious brands. Reels, ads, growth strategy — done for you.",
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="bg-white text-[#1A1A2E] overflow-x-hidden">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <Packages />
        <Process />
        <Results />
        <Testimonials />
        <BlogPreview />
        <ContactForm />
        <Contact />
      </main>
      <Footer />
      <CookieConsent />
      <Toaster position="top-center" richColors />
    </div>
  );
}

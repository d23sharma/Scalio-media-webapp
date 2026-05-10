import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

type FormValues = {
  name: string;
  phone: string;
  business: string;
  service: string;
  message: string;
};

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    track("lead_submit", {
      location: "contact_form",
      service: data.service || "unspecified",
    });
    toast.success("🎉 We'll contact you within 24 hours!", {
      description: "Thanks for reaching out to Scalio Media.",
    });
    reset();
  };

  const onError = () => {
    track("lead_submit_error", { location: "contact_form" });
  };

  const fieldClass =
    "w-full px-5 py-3.5 rounded-xl bg-white border border-[#E5E7EB] text-[#1A1A2E] placeholder:text-[#6B7280]/60 focus:outline-none focus:ring-2 focus:ring-[#4A9EFF]/40 focus:border-[#4A9EFF] transition-all";

  return (
    <section
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="relative py-28 bg-[#F5F7FA] overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-[#4A9EFF]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#1B2A4A] text-xs font-semibold tracking-widest uppercase shadow-sm">
            Free Audit
          </span>
          <h2
            id="contact-form-heading"
            className="mt-6 font-display font-bold text-4xl md:text-5xl text-[#1A1A2E]"
          >
            Ready to Grow? <span className="text-gradient">Let's Talk.</span>
          </h2>
          <p className="mt-5 text-[#6B7280] text-lg">
            Get a free social media audit and custom growth strategy for your business.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit, onError)}
          className="glass rounded-3xl p-8 md:p-10 shadow-elegant space-y-5"
          noValidate
          aria-label="Free audit request form"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="cf-name" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                Full Name <span aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="cf-name"
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "cf-name-error" : undefined}
                className={fieldClass}
              />
              {errors.name && (
                <p id="cf-name-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="cf-phone" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
                Phone Number <span aria-hidden="true">*</span>
                <span className="sr-only">required</span>
              </label>
              <input
                id="cf-phone"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^[0-9+\s-]{8,}$/, message: "Invalid phone number" },
                })}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 84088 11234"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "cf-phone-error" : undefined}
                className={fieldClass}
              />
              {errors.phone && (
                <p id="cf-phone-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="cf-business"
              className="block text-sm font-semibold text-[#1A1A2E] mb-2"
            >
              Business Name <span aria-hidden="true">*</span>
              <span className="sr-only">required</span>
            </label>
            <input
              id="cf-business"
              {...register("business", { required: "Business name is required" })}
              type="text"
              autoComplete="organization"
              placeholder="Your Business / Brand"
              aria-invalid={!!errors.business}
              aria-describedby={errors.business ? "cf-business-error" : undefined}
              className={fieldClass}
            />
            {errors.business && (
              <p id="cf-business-error" role="alert" className="mt-1 text-xs text-red-500">
                {errors.business.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cf-service" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
              Service Interested In
            </label>
            <select id="cf-service" {...register("service")} className={fieldClass} defaultValue="">
              <option value="">Select a service</option>
              <option>Instagram Growth</option>
              <option>Video Production</option>
              <option>Meta Ads</option>
              <option>SEO & YouTube</option>
              <option>Full Package</option>
            </select>
          </div>

          <div>
            <label htmlFor="cf-message" className="block text-sm font-semibold text-[#1A1A2E] mb-2">
              Message / Goals
            </label>
            <textarea
              id="cf-message"
              {...register("message")}
              rows={4}
              placeholder="Tell us about your business and goals..."
              className={fieldClass + " resize-none"}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00D48A] text-white font-bold text-base shadow-glow-green hover:scale-[1.02] active:scale-[0.99] transition-transform disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Get My Free Audit"}
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

// export const ContactForm = () => {
//   return (
//     <div className="p-10 max-w-xl mx-auto">
//       <form className="space-y-4">
//         <input type="text" placeholder="Your Name" className="w-full border p-4 rounded-lg" />

//         <input type="email" placeholder="Email" className="w-full border p-4 rounded-lg" />

//         <select className="w-full border p-4 rounded-lg">
//           <option>Select Service</option>
//           <option>Instagram Growth</option>
//           <option>Meta Ads</option>
//         </select>

//         <textarea placeholder="Message" className="w-full border p-4 rounded-lg" rows={5} />

//         <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

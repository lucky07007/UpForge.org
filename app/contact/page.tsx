"use client";

import { useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import {
  Loader2,
  CheckCircle2,
  ArrowRight,
  Mail,
  MessageSquare,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

const WORKING_SERVICE_ID = "service_jwpk5li";
const WORKING_TEMPLATE_ID = "template_ah89eas";
const WORKING_PUBLIC_KEY = "2N6-20rWXZApcyd_K";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border-b-2 border-border bg-transparent px-0 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-all font-serif";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update =
    (f: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((p) => ({ ...p, [f]: e.target.value }));

  const isValid = form.name && form.email && form.message;

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      await emailjs.send(
        WORKING_SERVICE_ID,
        WORKING_TEMPLATE_ID,
        {
          name: form.name,
          title: form.title || "Inquiry",
          email: form.email,
          message: form.message,
        },
        WORKING_PUBLIC_KEY
      );

      setSent(true);
    } catch (err) {
      setError("Transmission failed. Please use direct email.");
    } finally {
      setLoading(false);
    }
  };

  /* SUCCESS STATE */

  if (sent) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full border-4 border-border p-10 text-center shadow-[12px_12px_0px_0px_var(--accent)]">

          <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-6" />

          <h2 className="text-3xl font-serif font-black mb-3">
            Transmission Logged.
          </h2>

          <p className="text-lg text-muted-foreground font-serif italic mb-8">
            Your inquiry has been received. Our editorial desk will reach out to{" "}
            {form.email} shortly.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-foreground text-background px-8 py-4 hover:bg-accent transition-all"
          >
            Return to Registry
          </Link>

        </div>
      </div>
    );
  }

  /* MAIN PAGE */

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-10 pb-24">

        {/* HEADER */}

        <section className="border-b border-border max-w-[1300px] mx-auto w-full mt-5 pb-6 flex flex-col items-center text-center">

          <h1
            className="mast-h1 text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Contact the Registry
          </h1>

          <p className="mast-tagline font-serif italic text-base md:text-[17px] text-muted-foreground max-w-lg mb-5 leading-relaxed">
            For registry disputes, verification updates, or partnership inquiries.
            Our editorial desk operates independently.
          </p>

        </section>

        {/* GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 mt-16">

          {/* FORM SIDE */}

          <div className="space-y-4">

            <div className="grid sm:grid-cols-2 gap-x-8">

              <Field label="Full Name" required>
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Jane Doe"
                  className={inputCls}
                />
              </Field>

              <Field label="Email" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="jane@company.com"
                  className={inputCls}
                />
              </Field>

            </div>


            <Field label="Nature of Inquiry">

              <select
                value={form.title}
                onChange={update("title")}
                className={`${inputCls} appearance-none cursor-pointer`}
              >
                <option value="">Select a topic…</option>
                <option value="Startup Verification">Startup Verification</option>
                <option value="Data Correction">Data Correction</option>
                <option value="Partnership">Partnership</option>
                <option value="Support">General Support</option>
              </select>

            </Field>


            <Field label="Message" required>

              <textarea
                value={form.message}
                onChange={update("message")}
                placeholder="Describe the inquiry in detail..."
                rows={4}
                className={`${inputCls} resize-none`}
              />

            </Field>


            {error && (
              <p className="text-red-600 text-[12px] font-bold mb-4">
                {error}
              </p>
            )}


            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className={`w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${
                isValid && !loading
                  ? "bg-foreground text-background hover:bg-accent"
                  : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send Transmission
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>


          {/* RIGHT PANEL */}

          <aside className="space-y-8">

            <div className="border-2 border-border p-8 bg-muted flex flex-col space-y-10 text-center md:text-left">

              {/* EDITORIAL */}

              <div>

                <h4 className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-accent">
                  <Mail className="w-4 h-4" />
                  Editorial Desk
                </h4>

                <p className="text-[13px] text-muted-foreground font-serif italic mb-4">
                  Registry disputes & profile updates:
                </p>

                <a
                  href="mailto:support@upforge.org"
                  className="text-[16px] font-serif font-bold hover:text-accent transition-colors underline underline-offset-4"
                >
                  support@upforge.org
                </a>

              </div>


              {/* PARTNERSHIPS */}

              <div>

                <h4 className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-accent">
                  <MessageSquare className="w-4 h-4" />
                  Global Partnerships
                </h4>

                <p className="text-[13px] text-muted-foreground font-serif italic mb-4">
                  Sponsorships &amp; media collaborations:
                </p>

                <a
                  href="mailto:partners@upforge.org"
                  className="text-[16px] font-serif font-bold hover:text-accent transition-colors underline underline-offset-4"
                >
                  partners@upforge.org
                </a>

              </div>


              {/* WHATSAPP */}

              <div className="pt-8 border-t border-border">

                <h4 className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-green-600">
                  <MessageCircle className="w-4 h-4" />
                  Instant Connect
                </h4>

                <p className="text-[13px] text-muted-foreground font-serif italic mb-5">
                  Urgent registry inquiries?
                </p>

                <a
                  href="https://wa.link/x6uu80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
                >
                  Start WhatsApp Chat
                </a>

              </div>


              <p className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] opacity-30 mt-8 text-center md:text-left">
                Verified Independent Registry <br />
                Mon—Fri · 10:00—18:00 IST
              </p>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

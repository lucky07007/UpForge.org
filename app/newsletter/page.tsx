"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Zap,
  Globe,
  ArrowLeft,
} from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-10 pb-24">

        {/* HEADER */}
        <section className="border-b border-border max-w-[1300px] mx-auto w-full mt-5 pb-6 flex flex-col items-center text-center">

          <h1
            className="mast-h1 text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            The Weekly Dispatch
          </h1>

          <p className="mast-tagline font-serif italic text-base md:text-[17px] text-muted-foreground max-w-lg mb-5 leading-relaxed">
            The pulse of serious builders. Join 18,600+ founders and investors receiving verified registry intel every Sunday.
          </p>

        </section>


        <main className="py-16">

          {/* SUB CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] border-4 border-border bg-background shadow-[12px_12px_0px_0px_var(--accent)]">

            {/* FORM SIDE */}
            <div className="p-8 sm:p-12 border-b lg:border-b-0 lg:border-r-4 border-border">

              {subscribed ? (
                <div className="h-full flex flex-col justify-center items-center text-center py-10">

                  <CheckCircle2 className="w-16 h-16 text-accent mb-6" />

                  <h2 className="text-3xl font-serif font-black mb-3">
                    Synced to Registry.
                  </h2>

                  <p className="text-lg text-muted-foreground font-serif italic mb-8">
                    You're on the list. Next briefing: Sunday 08:00 IST.
                  </p>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-foreground text-background px-8 py-4 hover:bg-accent transition-all"
                  >
                    Explore Directory
                  </Link>

                </div>
              ) : (
                <div className="h-full flex flex-col justify-center">

                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8 flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-accent" />
                    Subscribe for Intel
                  </h3>

                  <form
                    onSubmit={handleSubscribe}
                    className="space-y-4"
                  >

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@company.com"
                      className="w-full border-b-2 border-border bg-transparent px-0 py-4 text-[18px] font-serif italic focus:outline-none focus:border-accent transition-all"
                    />

                    <button
                      type="submit"
                      disabled={!email || loading}
                      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all group"
                    >
                      {loading ? "Verifying..." : "Join The Dispatch"}

                      {!loading && (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      )}

                    </button>

                  </form>

                  <p className="text-[10px] text-muted-foreground mt-6 italic text-center lg:text-left">
                    Registry updates are transmitted weekly. Unsubscribe at any time.
                  </p>

                </div>
              )}

            </div>


            {/* PERKS SIDE */}
            <div className="bg-muted p-8 sm:p-12 flex flex-col justify-center gap-10">

              <div className="space-y-8">

                <Perk
                  icon={<Zap size={18} />}
                  title="Pre-Seed Intel"
                  desc="Direct registry highlights before the hype cycle begins."
                />

                <Perk
                  icon={<ShieldCheck size={18} />}
                  title="Verified Only"
                  desc="Zero noise. Only manually verified corporate data points."
                />

                <Perk
                  icon={<Globe size={18} />}
                  title="Global Reach"
                  desc="India's ecosystem mapped for institutional evaluation."
                />

              </div>


              {/* STATS BAND */}
              <div className="pt-8 border-t border-border flex justify-between items-center px-2">

                <Stat value="18K+" label="Readers" />
                <Stat value="42%" label="Open Rate" />
                <Stat value="Weekly" label="Freq" />

              </div>

            </div>

          </div>

        </main>


        {/* FOOTER */}
        <footer className="mt-12 text-center">

          <span className="font-sans font-bold text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            UpForge Independent Dispatch © 2026
          </span>

        </footer>

      </div>
    </div>
  );
}


/* PERK COMPONENT */

function Perk({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 items-start">

      <div className="mt-1 w-10 h-10 border-2 border-border flex items-center justify-center shrink-0 bg-background text-accent shadow-[4px_4px_0px_0px_var(--border)]">
        {icon}
      </div>

      <div>

        <h4 className="text-[13px] font-black uppercase tracking-wider mb-1 font-sans">
          {title}
        </h4>

        <p className="text-[14px] text-muted-foreground font-serif italic leading-snug">
          {desc}
        </p>

      </div>

    </div>
  );
}


/* STAT COMPONENT */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">

      <p className="text-[16px] font-black font-sans uppercase">
        {value}
      </p>

      <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
        {label}
      </p>

    </div>
  );
}

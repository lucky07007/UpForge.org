// components/footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Shield,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Startup Registry", href: "/registry" },
      { label: "Creator Community", href: "/creators" },
      { label: "Verify UFRN", href: "/verify" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Founder Stories", href: "/founder-stories" },
      { label: "Startup Research", href: "/research" },
      { label: "Submit Startup", href: "/submit" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return submitted ? (
    <div className="flex items-center gap-2 mt-3">
      <BadgeCheck size={14} className="text-emerald-500" />
      <span className="text-[12px] text-muted-foreground">
        Subscribed to UpForge Intel
      </span>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className="flex mt-3 max-w-[320px]"
      aria-label="Subscribe to UpForge Intel"
    >
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-3 py-2 text-[12px] border border-border border-r-0 bg-background text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="px-4 py-2 text-[11px] font-semibold bg-foreground text-background hover:bg-foreground/90 flex items-center gap-1"
      >
        Subscribe <ArrowRight size={11} />
      </button>
    </form>
  );
}

const TRUST_ITEMS = [
  { icon: Shield, label: "Independent Registry" },
  { icon: BadgeCheck, label: "Verified Startup Data" },
  { icon: Globe, label: "Global Coverage" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-background border-t border-border">
      {/* Optional background image for subtle global texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.18] mix-blend-soft-light" style={{ display: "none" }}>
        <Image
          src="/footer.jpg"
          alt="UpForge global startup map"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative">
        {/* TRUST STRIP */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-wrap gap-6 justify-center lg:justify-between">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={13} className="text-[var(--accent-gold)]" />
                <span className="text-[11px] text-muted-foreground tracking-wider uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          {/* MAIN GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-10 gap-y-12 py-14 border-b border-border bg-background/95">
            {/* BRAND / PITCH */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="relative w-7 h-7 overflow-hidden rounded-sm border border-border bg-muted">
                  <Image
                    src="/logo.jpg"
                    alt="UpForge"
                    fill
                    className="object-cover"
                  />
                </div>
                <span
                  className="text-[22px] font-bold text-foreground"
                  style={{
                    fontFamily: "'Playfair Display','Georgia',serif",
                  }}
                >
                  UpForge
                </span>
              </Link>

              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[340px]">
                Independent startup registry and intelligence platform —
                verified company and founder data, valuation research, and
                ecosystem signals for teams worldwide.
              </p>

              {/* Dual-domain callout */}
              <div className="mt-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    India Hub
                  </span>
                  <span className="text-[10px] text-[var(--accent-gold)] font-mono">
                    upforge.in
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    Global Registry
                  </span>
                  <a
                    href="https://www.upforge.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--accent-gold)] font-mono hover:underline"
                  >
                    upforge.org
                  </a>
                </div>
              </div>

              {/* Primary CTA */}
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 mt-5 text-[11px] font-semibold bg-foreground text-background px-4 py-2 hover:bg-foreground/90"
              >
                List your startup <ArrowRight size={11} />
              </Link>

              {/* NEWSLETTER */}
              <div className="mt-7">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-foreground">
                  UpForge Intel
                </p>
                <p className="text-[12px] text-muted-foreground mt-1 max-w-[280px]">
                  Weekly briefings on startups, funding rounds, and global
                  ecosystem research.
                </p>
                <NewsletterForm />
              </div>
            </div>

            {/* NAV COLUMNS */}
            {FOOTER_COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-foreground mb-4">
                  {heading}
                </h3>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-[13px] text-muted-foreground hover:text-[var(--accent-gold)]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* GLOBAL REGISTRY BANNER */}
          <div className="py-6 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <Globe size={14} className="text-[var(--accent-gold)]" />
              <p className="text-[12px] text-muted-foreground">
                Need the full global startup database?{" "}
                <a
                  href="https://www.upforge.org/registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-gold)] hover:underline font-semibold"
                >
                  Explore the UpForge Global Registry →
                </a>
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
              upforge.org
            </span>
          </div>

          {/* SOCIAL */}
          <div className="py-8 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6 bg-background/95">
            <p className="text-[12px] text-muted-foreground">Follow UpForge</p>
            <div className="flex items-center gap-5">
              <a
                href="https://www.linkedin.com/company/upforge-india"
                className="text-muted-foreground hover:text-[var(--accent-gold)]"
                aria-label="UpForge on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-[var(--accent-gold)]"
                aria-label="UpForge on X"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-[var(--accent-gold)]"
                aria-label="UpForge on Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.youtube.com/@upforge-ind"
                className="text-muted-foreground hover:text-[var(--accent-gold)]"
                aria-label="UpForge on YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* TRUST LINE */}
          <div className="py-6 text-center border-b border-border bg-muted/50">
            <p className="text-[12px] text-muted-foreground max-w-[740px] mx-auto">
              Independent startup intelligence platform · Verified company and
              founder data · Daily updates across India and global markets ·{" "}
              <a
                href="https://www.upforge.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-gold)]"
              >
                Explore the Global Registry at upforge.org
              </a>
            </p>
          </div>

          {/* COPYRIGHT */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-background/95">
            <div>
              <p className="text-[12px] text-muted-foreground">
                © {year} UpForge · Built for founders, investors, and analysts
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                upforge.in (India) · upforge.org (Global Registry)
              </p>
            </div>
            <div className="flex gap-6 text-[12px] text-muted-foreground">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

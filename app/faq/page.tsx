// app/faq/page.tsx — WORLD-CLASS AUTHORITY — Registry Design System Match
// Forbes-editorial: Georgia serif, gold #C59A2E, monospace labels, clean separators
// Global SEO: FAQPage schema, BreadcrumbList, full Open Graph + Twitter, canonical

import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowRight, ArrowUpRight, BadgeCheck, Shield, Globe, Sparkles, Calculator, FileText, Building2, Users } from "lucide-react"

const BASE_URL = "https://www.upforge.org"

// ─── FAQ DATA ───
// (identical shape — reused for both UI + JSON-LD schema)

export const FAQ_CATEGORIES = [
  {
    id: "listing",
    rank: "01",
    label: "Listing & Submission",
    category: "Registry",
    icon: Building2,
    questions: [
      {
        q: "How do I list my startup on UpForge?",
        a: "Go to upforge.in/submit and fill in your startup details — name, founder, industry, description, and founding year are required. The form takes under 5 minutes. Once submitted, our team reviews and verifies your profile within 3–7 business days. Listing is completely free and always will be.",
      },
      {
        q: "Is listing on UpForge really free?",
        a: "Yes — 100% free, forever. There are no hidden fees, no freemium traps, no pay-to-rank mechanics. UpForge is an independent public registry, not a marketplace or media platform. Our mission is to document the world's emerging founders, not monetise their visibility.",
      },
      {
        q: "What information is required to submit a startup?",
        a: "Required: startup name, founder name, founding year, industry/sector, and a one-line description. Optional but recommended: website URL, co-founder names, city, team size, funding stage, logo, and a detailed description. The more you provide, the more complete your public profile.",
      },
      {
        q: "Can I edit my startup profile after it's listed?",
        a: "Yes. Email corrections@upforge.in with your startup name and UFRN and the changes you'd like made. We'll update the profile within 48 hours. For major updates — new funding round, rebranding, new product — we recommend re-requesting full verification.",
      },
      {
        q: "How long does listing approval take?",
        a: "Typically 3–7 business days. Our team manually reviews every submission for accuracy and completeness before publishing. You'll receive a confirmation email when your startup is live.",
      },
      {
        q: "Can a startup be removed from UpForge?",
        a: "Yes. If a startup has shut down, or a founder requests removal with valid verification, we will delist the profile. Email contact@upforge.in. We maintain corrections and removals as part of our editorial standards.",
      },
    ],
  },
  {
    id: "verification",
    rank: "02",
    label: "Verification & UFRN",
    category: "Credibility",
    icon: BadgeCheck,
    questions: [
      {
        q: "What does the UpForge verified badge mean?",
        a: "The verified badge (✓) means our team has manually confirmed: (1) the startup is real and operating, (2) the founder identity matches public records, (3) the information submitted is accurate to the best of our knowledge. Verified profiles rank higher in search and signal institutional credibility.",
      },
      {
        q: "How does UpForge verify a startup?",
        a: "We check MCA/ROC registration, founder LinkedIn and public digital presence, website legitimacy, news and media mentions, and any public funding data. For revenue-stage startups, we may also review App Store listings, LinkedIn company pages, or other public traction signals.",
      },
      {
        q: "Is verification free?",
        a: "Yes — verification is free as part of the standard listing process. We do not charge for the verified badge. Our review is independent and merit-based.",
      },
      {
        q: "What is a UFRN?",
        a: "A UpForge Registry Number (UFRN) is a permanent, globally unique identifier assigned to every approved startup — e.g. UF-2026-IND-00042. It's shareable on LinkedIn, investor decks, press kits, and pitch documents. Think of it as your startup's global ID on the open web.",
      },
      {
        q: "My startup is pre-incorporation. Can I still list?",
        a: "Yes. Pre-incorporation startups can be listed as 'Early Stage' without a verified badge. Once you have an incorporation document or any public registration, you can request verification. We believe in documenting founders from day one.",
      },
      {
        q: "Can a verified badge be revoked?",
        a: "Yes. If information provided was materially false, or if a verified startup shuts down without notification, we may revoke the badge or update the profile. We maintain an ongoing corrections policy as part of our editorial standards.",
      },
    ],
  },

  {
    id: "valuation",
    rank: "04",
    label: "Valuation Tool",
    category: "Finance",
    icon: Calculator,
    questions: [
      {
        q: "How does the UpForge valuation estimator work?",
        a: "The free tool at upforge.in/valuation takes inputs like industry, revenue stage, team size, funding raised, and growth metrics — and applies sector-appropriate multiples benchmarked against real startup deals globally. It gives you a floor, midpoint, and ceiling estimate with methodology explained. No signup required.",
      },
      {
        q: "What valuation methods does UpForge use?",
        a: "ARR multiples (8–25x) for SaaS and subscription businesses, GMV multiples (0.5–3x) for marketplace and commerce platforms, revenue multiples (1–5x) for D2C and product companies, and cost-to-duplicate models for pre-revenue startups.",
      },
      {
        q: "Is the valuation legally binding?",
        a: "No. The UpForge valuation is an indicative estimate for strategic use — not a formal valuation for legal, tax, or fundraising documentation. For statutory valuations (ESOP, FEMA compliance, M&A), you need a SEBI-registered valuer or CA.",
      },
    ],
  },
  {
    id: "platform",
    rank: "05",
    label: "Platform & Data",
    category: "Registry",
    icon: Globe,
    questions: [
      {
        q: "What is UpForge?",
        a: "UpForge is the world's independent, free public startup registry — not a media outlet, not a ranking platform, not an accelerator. We document global startups in a structured, verified, permanently accessible format. Think of us as the public record layer of the startup ecosystem: neutral, open, and built to last.",
      },
      {
        q: "Who owns and operates UpForge?",
        a: "UpForge is independently owned and operated. We are not affiliated with any VC firm, accelerator, media house, or government body. Our editorial independence is central to our value — we do not accept payments to rank, feature, or promote any startup over another.",
      },
      {
        q: "How does UpForge make money?",
        a: "UpForge operates as an independent project. We do not run ads, accept sponsored placements, or charge for listings. We're exploring sustainable models that preserve editorial independence — including premium tools, API access for researchers, and enterprise data products. Listings will always be free.",
      },
      {
        q: "Is UpForge data public and indexable?",
        a: "Yes — all startup profiles on UpForge are publicly accessible and indexed by Google and other search engines. This is intentional: we want founders to have a permanently discoverable presence on the open web, separate from any single platform or social network.",
      },
      {
        q: "Can investors or researchers access UpForge data in bulk?",
        a: "We're building API and bulk data access for verified investors, researchers, and institutions. If you're interested in early access, email data@upforge.in with your use case. Individual profiles are already public and accessible via the registry.",
      },
    ],
  },
  {
    id: "forge",
    rank: "06",
    label: "Forge AI",
    category: "AI",
    icon: Sparkles,
    questions: [
      {
        q: "What is Forge?",
        a: "Forge is UpForge's AI assistant — built specifically for the global startup ecosystem. It can answer questions about listing your startup, funding stages, sector trends, valuation methods, UpForge platform features, and more. Access Forge via the chat widget on any UpForge page.",
      },
      {
        q: "What can Forge help me with?",
        a: "Forge can explain how UpForge works, guide you through the listing process, answer questions about startup funding and sectors, explain valuation concepts, and direct you to the right resources. It's designed to be a sharp, knowledgeable co-founder — not a generic chatbot.",
      },
      {
        q: "Is Forge powered by ChatGPT?",
        a: "No — Forge is built on GROQ's infrastructure running Llama 3.3 (70B), engineered specifically for UpForge with a custom system prompt covering the global startup ecosystem, UpForge platform knowledge, and startup fundamentals.",
      },
    ],
  },
]

const totalQuestions = FAQ_CATEGORIES.reduce((acc, c) => acc + c.questions.length, 0)

// ─── METADATA ───

export const metadata: Metadata = {
  title: `FAQ — UpForge Global Startup Registry | ${totalQuestions} Answers, 5 Topics`,
  description:
    "Answers to every question about listing your startup on UpForge — the free, verified, independent global startup registry. Covers verification, UFRN, valuation, and data access.",
  keywords: [
    "UpForge FAQ",
    "how to list startup globally",
    "startup registry FAQ",
    "free startup listing",
    "startup verification",
    "UFRN identifier",
    "startup valuation tool",
    "global startup database",
    "UpForge how it works",
    "independent startup registry",
    "startup proof of existence",
    "startup verification process",
    "Forge AI startup assistant",
  ],
  alternates: {
    canonical: `${BASE_URL}/faq`,
    languages: {
      "en":    `${BASE_URL}/faq`,
      "en-US": `${BASE_URL}/faq`,
      "en-IN": `${BASE_URL}/faq`,
      "x-default": `${BASE_URL}/faq`,
    },
  },
  openGraph: {
    title: `FAQ — UpForge Global Startup Registry | ${totalQuestions} Answers`,
    description:
      "Everything you need to know about UpForge — the world's free, verified startup registry. Listing, UFRN, verification, valuation, and more.",
    url: `${BASE_URL}/faq`,
    siteName: "UpForge Global Registry",
    images: [{ url: `${BASE_URL}/og/startup-default.png`, width: 1200, height: 630, alt: "UpForge FAQ" }],
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ — UpForge Global Startup Registry`,
    description:
      "Everything you need to know about UpForge — the world's free, verified startup registry.",
    site: "@UpForgeHQ",
    creator: "@UpForgeHQ",
    images: [`${BASE_URL}/og/startup-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

// ─── SCHEMA ───

function generateSchemas() {
  const allQAs = FAQ_CATEGORIES.flatMap(c => c.questions)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/faq#faqpage`,
    name: "UpForge FAQ — Global Startup Registry",
    url: `${BASE_URL}/faq`,
    mainEntity: allQAs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "UpForge",        item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Global Registry", item: `${BASE_URL}/registry` },
      { "@type": "ListItem", position: 3, name: "FAQ",             item: `${BASE_URL}/faq` },
    ],
  }

  const speakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/faq`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".faq-h1", ".faq-tagline", ".faq-q"],
    },
  }

  return [faqSchema, breadcrumb, speakable]
}

// ─── PAGE ───

export default function FAQPage() {
  const schemas = generateSchemas()

  return (
    <>
      <Navbar />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <div className="min-h-[100vh] bg-background text-foreground font-serif flex flex-col relative overflow-hidden">
        <div className="flex-1 relative z-10 w-full flex flex-col">

          {/* ══════════════════════════════════════
              HEADER — mirrors registry masthead
          ══════════════════════════════════════ */}
          <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 w-full mt-5 pb-6 flex flex-col items-center text-center">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground mb-3">
              UpForge · Global Registry · Help
            </p>
            <h1
              className="faq-h1 text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Frequently Asked Questions
            </h1>
            <p className="faq-tagline font-serif italic text-base md:text-[17px] text-muted-foreground max-w-lg mb-5 leading-relaxed">
              {totalQuestions} answers across {FAQ_CATEGORIES.length} topics — listing, verification, UFRN, valuation, and platform.
            </p>

            {/* Stats pill */}
            <div className="flex items-center gap-2 border border-border bg-muted px-4 py-2 w-fit">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {totalQuestions} Questions · {FAQ_CATEGORIES.length} Topics · Updated April 2026
              </span>
            </div>
          </section>

          {/* ── Category strip — mirrors sector tabs ── */}
          <nav
            className="flex overflow-x-auto border-b-[1.5px] border-foreground bg-muted/40 px-6 items-center max-w-[1300px] mx-auto w-full"
            aria-label="FAQ categories"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] py-3 pr-3 shrink-0 font-mono">Jump:</span>
            {FAQ_CATEGORIES.map(cat => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 px-4 py-3 font-mono text-[9px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-2 border-transparent text-muted-foreground hover:text-foreground"
              >
                {cat.label}
              </a>
            ))}
          </nav>

          {/* ── Results bar — mirrors registry ── */}
          <div className="bg-muted/50 px-6 py-3 flex items-center border-b border-border w-full">
            <div className="max-w-[1300px] mx-auto w-full flex items-center gap-3">
              <span className="font-serif text-[14px] font-bold text-foreground italic">All Questions</span>
              <span className="text-xs text-muted-foreground">— {totalQuestions} answers</span>
              <span className="flex-1 h-px bg-border hidden sm:block" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                {FAQ_CATEGORIES.length} Categories
              </span>
            </div>
          </div>

          {/* ── Main ── */}
          <div className="max-w-[1300px] mx-auto px-6 py-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 items-start">

              <div className="space-y-12">

                {FAQ_CATEGORIES.map((cat, ci) => (
                  <section key={cat.id} id={cat.id}>

                    {/* ── Section header — Forbes "The Index" style ── */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">{cat.label}</span>
                      <div className="flex-1 h-px bg-foreground" />
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                        {cat.questions.length} Q
                      </span>
                    </div>

                    {/* ── Cover intro row — mirrors featured cover style ── */}
                    <div className="border-b-[2px] border-foreground pb-6 mb-2 flex flex-col md:flex-row gap-0">
                      {/* Text left */}
                      <div className="flex-1 pr-0 md:pr-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C59A2E]">
                            {cat.category}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                            {cat.rank} of {FAQ_CATEGORIES.length}
                          </span>
                        </div>
                        <h2
                          className="text-2xl md:text-3xl font-bold leading-[1.08] text-foreground mb-2"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {cat.label}
                        </h2>
                        <p className="font-serif italic text-[13px] text-foreground/70 leading-relaxed">
                          {cat.questions.length} questions answered below. Use the jump links above or scroll to browse.
                        </p>
                      </div>
                      {/* Icon box right — mirrors image-right pattern */}
                      <div className="w-full md:w-[120px] shrink-0 flex items-center justify-center bg-muted mt-4 md:mt-0" style={{ minHeight: "72px" }}>
                        <cat.icon size={32} className="text-muted-foreground/30" />
                      </div>
                    </div>

                    {/* ── Q&A rows — mirrors index card style ── */}
                    <div className="divide-y divide-border">
                      {cat.questions.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-row items-start gap-4 py-5 -mx-2 px-2 group"
                          itemScope
                          itemType="https://schema.org/Question"
                        >
                          {/* Rank */}
                          <div className="font-mono text-[11px] font-bold text-[#C59A2E]/50 pt-0.5 w-5 text-right shrink-0 select-none">
                            {idx + 1}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="faq-q font-bold text-[18px] md:text-[20px] leading-tight text-foreground mb-2"
                              style={{ fontFamily: "'Georgia', serif" }}
                              itemProp="name"
                            >
                              {item.q}
                            </h3>
                            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                              <p
                                className="font-serif italic text-[13px] text-foreground/75 leading-relaxed"
                                itemProp="text"
                              >
                                {item.a}
                              </p>
                            </div>
                            {/* Footer meta — mirrors card meta */}
                            <div className="flex items-center gap-3 pt-2 mt-2 border-t border-border/50">
                              <span className="font-mono text-[8px] font-bold text-[#C59A2E] uppercase tracking-widest">
                                {cat.category}
                              </span>
                              <span className="w-px h-2.5 bg-border" />
                              <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                                UpForge Registry
                              </span>
                              <span className="w-px h-2.5 bg-border" />
                              <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                                Updated Apr 2026
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next section link */}
                    {ci < FAQ_CATEGORIES.length - 1 && (
                      <div className="pt-4 flex justify-end">
                        <a
                          href={`#${FAQ_CATEGORIES[ci + 1].id}`}
                          className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#C59A2E] hover:underline flex items-center gap-1"
                        >
                          Next: {FAQ_CATEGORIES[ci + 1].label} <ArrowRight size={9} />
                        </a>
                      </div>
                    )}

                  </section>
                ))}

              </div>

              {/* ══════════════════════════════════════
                  SIDEBAR — mirrors registry sidebar
              ══════════════════════════════════════ */}
              <aside className="sticky top-[90px] flex flex-col gap-8">

                {/* Submit CTA */}
                <div className="border-t-[2px] border-foreground pt-6 text-center">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C59A2E] mb-3">Get Your UFRN</p>
                  <p className="font-bold text-xl text-foreground mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                    List your startup free
                  </p>
                  <p className="text-xs text-muted-foreground font-serif italic mb-4 leading-relaxed">
                    Get independently verified. Receive your global UFRN. Trusted by investors worldwide.
                  </p>
                  <a
                    href="/submit"
                    className="inline-flex items-center justify-center w-full h-11 bg-foreground hover:bg-[#C59A2E] text-background transition-colors font-mono text-[10px] font-bold uppercase tracking-[0.15em] gap-2"
                  >
                    Submit Startup <ArrowRight size={12} />
                  </a>
                </div>

                {/* UFRN explainer */}
                <div className="border-t-[2px] border-foreground border-l-[3px] border-l-[#C59A2E] pl-4 pt-4">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C59A2E] mb-2">What is a UFRN?</p>
                  <p className="font-bold text-[15px] text-foreground mb-2" style={{ fontFamily: "'Georgia', serif" }}>Your startup's global ID</p>
                  <p className="text-xs text-muted-foreground font-serif italic leading-relaxed mb-4">
                    A unique permanent identifier assigned to every approved startup. Shareable on LinkedIn, investor decks, and press kits.
                  </p>
                  <div className="font-mono text-[11px] font-bold text-foreground bg-muted py-2 px-3 text-center">
                    UF-2026-IND-00001
                  </div>
                </div>

                {/* Browse topics — mirrors "Browse by Sector" */}
                <div className="border-t-[2px] border-foreground pt-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground mb-4">Browse Topics</p>
                  <ul className="flex flex-col gap-0 m-0 p-0 list-none divide-y divide-border">
                    {FAQ_CATEGORIES.map(cat => (
                      <li key={cat.id}>
                        <a
                          href={`#${cat.id}`}
                          className="flex items-center justify-between py-2.5 text-sm text-foreground font-serif italic hover:text-[#C59A2E] transition-colors"
                        >
                          <span>{cat.label}</span>
                          <span className="font-mono text-[9px] font-bold text-[#C59A2E]">{cat.questions.length}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact CTA */}
                <div className="border-t-[2px] border-foreground pt-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground mb-3">Still Have Questions?</p>
                  <p className="text-xs text-muted-foreground font-serif italic mb-4 leading-relaxed">
                    Our editorial team reads every message. Responses within 24–48 hours on business days.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full h-10 border-[1.5px] border-foreground hover:border-[#C59A2E] text-foreground hover:text-[#C59A2E] transition-colors font-mono text-[10px] font-bold uppercase tracking-[0.15em] gap-2"
                  >
                    Contact Us <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="border-t-[2px] border-foreground pt-5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground mb-4">Why UpForge</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { Icon: Shield,   text: "Independent registry — no VC, no media group" },
                      { Icon: BadgeCheck, text: "Every listing manually reviewed" },
                      { Icon: Globe,    text: "Free, publicly indexed, forever" },
                    ].map(({ Icon, text }) => (
                      <div key={text} className="flex items-start gap-3">
                        <Icon size={12} className="text-[#C59A2E] mt-0.5 shrink-0" />
                        <p className="font-serif italic text-[11px] text-muted-foreground leading-snug">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </aside>
            </div>

            {/* ── Bottom CTA ── */}
            <div className="mt-12 border-t-[2px] border-foreground pt-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#C59A2E] mb-3">UpForge Global Registry</p>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                  Your founder story starts with a verified profile.
                </h2>
                <p className="font-serif italic text-base text-muted-foreground">
                  Get your UFRN. Free forever. Trusted by investors and press worldwide.
                </p>
              </div>
              <a
                href="/submit"
                className="shrink-0 inline-flex items-center gap-3 border-[1.5px] border-foreground bg-foreground hover:bg-[#C59A2E] text-background py-3.5 px-7 font-bold uppercase tracking-[0.15em] font-mono transition-colors whitespace-nowrap"
              >
                List Free — Get UFRN <ArrowRight size={14} />
              </a>
            </div>

            {/* ── Footer links ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-10 border-t-[1.5px] border-foreground divide-y lg:divide-y-0 lg:divide-x divide-foreground">
              {[
                { label: "Global Registry",        sub: "Full verified database",   href: "/registry" },
                { label: "Indian Startup Founders", sub: "Founder Chronicle 2026", href: "/"         },
                { label: "The Forge Blog",          sub: "Startup intelligence",    href: "/blog"     },
                { label: "Submit Your Startup",     sub: "Get listed + UFRN free",  href: "/submit"   },
              ].map(lnk => (
                <a key={lnk.href} href={lnk.href} className="p-5 hover:bg-muted transition-colors group flex flex-col justify-center h-full">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-foreground mb-1 group-hover:text-[#C59A2E] transition-colors">{lnk.label}</span>
                  <span className="text-[11px] text-muted-foreground font-serif italic">{lnk.sub}</span>
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

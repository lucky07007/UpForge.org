// app/verification/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { fetchAllStartups } from "@/lib/google-sheets";
import {
  BadgeCheck, Shield, Search, FileText, Clock,
  CheckCircle2, XCircle, ArrowRight, Globe,
  Building2, Users, Mail, ChevronRight, Activity,
  AlertCircle, Star, Lock, Zap,
} from "lucide-react";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Verification — UpForge | How We Verify Indian Startups",
  description:
    "Learn how UpForge manually verifies every startup on India's independent registry. Our verification process, what the badge means, and how to get verified — free.",
  keywords: [
    "startup verification India",
    "verified startup registry",
    "how to verify startup India",
    "UpForge verified badge",
    "startup credibility India",
    "startup validation India",
  ],
  openGraph: {
    title: "Verification — UpForge | How We Verify Indian Startups",
    description:
      "UpForge manually verifies every startup in India's independent registry. Learn what verification means, how it works, and how to get your badge.",
    type: "website",
    url: "https://upforge.in/verification",
  },
  alternates: { canonical: "https://upforge.in/verification" },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Startup Verification — UpForge",
  description:
    "How UpForge manually verifies Indian startups and what the verified badge means for founders, investors, and researchers.",
  url: "https://upforge.in/verification",
  publisher: {
    "@type": "Organization",
    name: "UpForge",
    url: "https://upforge.in",
  },
};

// ─── Pulse Dot ────────────────────────────────────────────────────────────────

function PulseDot({ color = "green" }: { color?: "green" | "amber" | "blue" }) {
  const c = {
    green: { ring: "bg-green-400", dot: "bg-green-500" },
    amber: { ring: "bg-amber-400", dot: "bg-amber-500" },
    blue:  { ring: "bg-blue-400",  dot: "bg-blue-500"  },
  }[color];
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.ring} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
    </span>
  );
}

// ─── What we check ────────────────────────────────────────────────────────────

const CHECKS = [
  {
    icon: Building2,
    title: "Company Registration",
    detail:
      "We cross-reference MCA / DPIIT / ROC records to confirm the entity exists and is in good standing. Sole proprietorships and LLPs are also accepted.",
    status: "required",
  },
  {
    icon: Users,
    title: "Founder Identity",
    detail:
      "We verify the submitting founder's identity against their LinkedIn profile, company website, and publicly available records. Co-founders are spot-checked.",
    status: "required",
  },
  {
    icon: Globe,
    title: "Website & Digital Presence",
    detail:
      "We check that the website is live, belongs to the startup, and matches the submitted description. App Store / Play Store listings are verified for product startups.",
    status: "required",
  },
  {
    icon: FileText,
    title: "Business Description Accuracy",
    detail:
      "We review the submitted description against the public website, LinkedIn page, and any news coverage to ensure it is accurate and not misleading.",
    status: "required",
  },
  {
    icon: Search,
    title: "News & Media Mentions",
    detail:
      "We scan public news databases for any coverage that corroborates or contradicts the submitted information. Negative press is noted internally.",
    status: "optional",
  },
  {
    icon: Activity,
    title: "Traction Signals",
    detail:
      "For revenue-stage startups, we look at publicly available traction data — App Store ratings, employee count on LinkedIn, G2/Capterra reviews, and press-reported ARR.",
    status: "optional",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Submit your startup",
    detail: "Fill the form at upforge.in/submit. Takes under 5 minutes. No login required.",
    time: "Instant",
    icon: FileText,
  },
  {
    num: "02",
    title: "Auto-acknowledgement",
    detail: "You receive a confirmation email within minutes. Your submission is logged in our queue.",
    time: "< 5 min",
    icon: Mail,
  },
  {
    num: "03",
    title: "Manual review begins",
    detail: "Our team runs the verification checklist across public data sources. No human bias — structured criteria only.",
    time: "1–3 days",
    icon: Search,
  },
  {
    num: "04",
    title: "Profile published",
    detail: "Your startup goes live on the registry, publicly indexed and permanently accessible.",
    time: "3–7 days",
    icon: Globe,
  },
  {
    num: "05",
    title: "Verified badge awarded",
    detail: "If all checks pass, the ✓ badge appears on your profile. You receive a confirmation email.",
    time: "Same day as publish",
    icon: BadgeCheck,
  },
];

const VERIFIED_MEANS = [
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    title: "The startup is real and operating",
    detail: "Not an idea, not a defunct company — an active, operating entity.",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    title: "The founder identity is confirmed",
    detail: "The person who submitted is who they claim to be.",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-500",
    title: "The information is accurate",
    detail: "Description, industry, founding year, and website match public records.",
  },
  {
    icon: XCircle,
    color: "text-red-400",
    title: "Does NOT mean we endorse the startup",
    detail: "Verification is factual, not evaluative. We don't rate quality or predict success.",
  },
  {
    icon: XCircle,
    color: "text-red-400",
    title: "Does NOT mean the startup is profitable",
    detail: "Pre-revenue startups with confirmed identity and registration are verified.",
  },
  {
    icon: XCircle,
    color: "text-red-400",
    title: "Does NOT mean we verified funding claims",
    detail: "Unless funding is publicly announced, we note it as self-reported.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is verification free?",
    a: "Yes — 100% free. We do not charge for the verified badge. Our review is independent and merit-based.",
  },
  {
    q: "What if my startup is pre-incorporation?",
    a: "You can still be listed without a verified badge. Once you have any registration document, request verification by emailing contact@upforge.in.",
  },
  {
    q: "How long does verification take?",
    a: "Typically 3–7 business days. We aim for 3 days for straightforward cases and up to 7 for startups with limited public digital presence.",
  },
  {
    q: "Can my verification badge be revoked?",
    a: "Yes. If we discover material inaccuracies, or if the startup becomes inactive, we may revoke the badge or update the profile. We run periodic re-checks on verified profiles.",
  },
  {
    q: "What if my startup was rejected?",
    a: "We'll email you with the specific reason. Common issues: no live website, unverifiable founder identity, or description mismatch. You can resubmit after addressing the gaps.",
  },
  {
    q: "Do you verify funding amounts?",
    a: "Only if the round is publicly announced (news, press release, or DPIIT data). Otherwise, funding data is marked as self-reported on your profile.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function VerificationPage() {
  const startups = await fetchAllStartups();
  const totalListings = startups.length;
  const verifiedStartups = startups.filter(s => s.ufrn && s.ufrn !== "PENDING-VERIFICATION");
  const totalVerified = verifiedStartups.length;

  const verifiedPct =
    totalListings && totalVerified
      ? Math.round((totalVerified / totalListings) * 100)
      : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#F7F5F0] min-h-screen" style={{ fontFamily: "system-ui, sans-serif" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .fu-1 { animation: fadeUp 0.5s 0.05s ease both; }
          .fu-2 { animation: fadeUp 0.5s 0.15s ease both; }
          .fu-3 { animation: fadeUp 0.5s 0.25s ease both; }
          .fu-4 { animation: fadeUp 0.5s 0.38s ease both; }
          .card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease; }
          .card-hover:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.07); border-color: #1C1C1C !important; }
          .num-font { font-variant-numeric: tabular-nums; }
        `}</style>

        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">

          {/* ── MASTHEAD ── */}
          <div className="border-b-2 border-[#1C1C1C] pb-6 mb-0 fu-1">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-[9px] tracking-[0.28em] text-[#AAA] uppercase mb-3">
                  UpForge · Registry Standards
                </p>
                <h1
                  className="text-[2.4rem] sm:text-[3.2rem] lg:text-[4rem] tracking-tight leading-[1.0] text-[#1C1C1C]"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  How We Verify<br />
                  <em className="text-[#A89060] not-italic">Every Startup</em>
                </h1>
              </div>
              <div className="pb-1 flex flex-col gap-2 lg:items-end">
                <div className="flex items-center gap-2 border border-[#DDD] bg-white px-3 py-1.5 w-fit">
                  <PulseDot color="green" />
                  <span className="text-[10px] font-semibold text-[#555] tracking-wide uppercase">
                    {totalVerified || 0}+ Verified · {verifiedPct}% Pass Rate
                  </span>
                </div>
                <p className="text-[11px] text-[#888] lg:text-right">
                  Manual review · Structured criteria · Zero bias
                </p>
              </div>
            </div>
          </div>

          {/* ── LIVE STATS STRIP ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#D5D0C8] fu-2">
            {[
              { value: `${totalVerified || 20}+`, label: "Verified Profiles", sub: "and growing" },
              { value: `100%`, label: "Approval Rate", sub: "of all submissions" },
              { value: "1-2", label: "Days Avg Review", sub: "from submission" },
              { value: "Free", label: "Cost to Verify", sub: "always, forever" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`py-6 px-4 border-r border-[#D5D0C8] last:border-r-0 ${i === 1 ? "bg-[#1C1C1C]" : "hover:bg-white"} transition-colors`}
              >
                <p
                  className={`num-font text-3xl sm:text-4xl font-bold leading-none mb-2 ${i === 1 ? "text-[#E8C547]" : "text-[#1C1C1C]"}`}
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {stat.value}
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${i === 1 ? "text-white/40" : "text-[#AAA]"}`}>
                  {stat.label}
                </p>
                <p className={`text-[10px] ${i === 1 ? "text-white/25" : "text-[#BBB]"}`}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* ── WHAT VERIFICATION MEANS ── */}
          <div className="grid lg:grid-cols-2 gap-0 border-b border-[#D5D0C8] fu-3">
            <div className="py-8 pr-0 lg:pr-10 border-r border-[#D5D0C8]">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#EEEAE3]">
                <BadgeCheck className="w-4 h-4 text-[#AAA]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                  What the ✓ Badge Means
                </h2>
              </div>

              {/* Big badge display */}
              <div className="flex items-center gap-4 mb-6 p-5 border border-[#E2DDD5] bg-white">
                <div className="w-14 h-14 bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p
                    className="text-lg font-semibold text-[#1C1C1C] mb-0.5"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    UpForge Verified
                  </p>
                  <p className="text-[11px] text-[#888]">
                    Independently reviewed · Manually confirmed · Permanently recorded
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {VERIFIED_MEANS.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-[#EEEAE3] pb-3 last:border-0 last:pb-0">
                    <item.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.color}`} />
                    <div>
                      <p
                        className="text-[12px] font-semibold text-[#1C1C1C] mb-0.5"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#777]">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-8 lg:pl-10">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#EEEAE3]">
                <Shield className="w-4 h-4 text-[#AAA]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                  Our Verification Principles
                </h2>
              </div>
              <div className="space-y-5">
                {[
                  {
                    icon: Lock,
                    title: "Structured criteria only",
                    detail:
                      "Every startup is reviewed against the same checklist. There is no subjective quality judgment — only factual verification of identity, registration, and accuracy.",
                  },
                  {
                    icon: Shield,
                    title: "No commercial influence",
                    detail:
                      "Verification cannot be purchased, expedited for payment, or influenced by investors or accelerators. Independence is non-negotiable.",
                  },
                  {
                    icon: Star,
                    title: "Permanent public record",
                    detail:
                      "Once verified, your badge and profile remain public and indexed. If we revoke a badge, the reason is noted — we do not silently delete profiles.",
                  },
                  {
                    icon: Zap,
                    title: "Ongoing re-verification",
                    detail:
                      "We periodically re-check verified profiles — especially for startups that have been inactive online for 6+ months — to maintain the integrity of the registry.",
                  },
                  {
                    icon: AlertCircle,
                    title: "Transparent rejection",
                    detail:
                      "If we can't verify, we tell you exactly why. Rejections are not permanent — fix the gap and resubmit.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#EEEAE3] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-[#888]" />
                    </div>
                    <div>
                      <p
                        className="text-[12px] font-semibold text-[#1C1C1C] mb-0.5"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#777] leading-snug">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHAT WE CHECK ── */}
          <div className="py-8 border-b border-[#D5D0C8] fu-3">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-4 h-4 text-[#AAA]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                What We Check
              </h2>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[9px] bg-[#1C1C1C] text-white px-2 py-0.5 font-bold uppercase tracking-wider">Required</span>
                <span className="text-[9px] bg-[#EEEAE3] text-[#888] px-2 py-0.5 font-bold uppercase tracking-wider">Optional</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D5D0C8] border border-[#D5D0C8]">
              {CHECKS.map((check, i) => (
                <div key={i} className="bg-[#F7F5F0] p-5 hover:bg-white transition-colors card-hover border border-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-7 h-7 bg-[#EEEAE3] flex items-center justify-center flex-shrink-0">
                      <check.icon className="w-3.5 h-3.5 text-[#888]" />
                    </div>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                        check.status === "required"
                          ? "bg-[#1C1C1C] text-white"
                          : "bg-[#EEEAE3] text-[#888]"
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <h3
                    className="text-[12px] font-semibold text-[#1C1C1C] mb-2"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {check.title}
                  </h3>
                  <p className="text-[11px] text-[#777] leading-snug">{check.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── PROCESS TIMELINE ── */}
          <div className="py-8 border-b border-[#D5D0C8] fu-4">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-[#AAA]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                The Verification Process
              </h2>
            </div>
            <div className="grid sm:grid-cols-5 gap-px bg-[#D5D0C8] border border-[#D5D0C8]">
              {PROCESS_STEPS.map((s, i) => {
                const isLast = i === PROCESS_STEPS.length - 1;
                return (
                  <div
                    key={i}
                    className={`p-5 flex flex-col ${isLast ? "bg-[#1C1C1C]" : "bg-[#F7F5F0] hover:bg-white"} transition-colors`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`num-font text-xl font-bold ${isLast ? "text-[#E8C547]" : "text-[#DDD]"}`}
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {s.num}
                      </span>
                      <s.icon className={`w-4 h-4 ${isLast ? "text-white/40" : "text-[#CCC]"}`} />
                    </div>
                    <p
                      className={`text-[12px] font-semibold mb-2 leading-snug ${isLast ? "text-white" : "text-[#1C1C1C]"}`}
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {s.title}
                    </p>
                    <p className={`text-[11px] leading-snug flex-1 ${isLast ? "text-white/50" : "text-[#777]"}`}>
                      {s.detail}
                    </p>
                    <div className={`mt-3 pt-3 border-t ${isLast ? "border-white/10" : "border-[#EEEAE3]"}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isLast ? "text-[#E8C547]" : "text-[#AAA]"}`}>
                        {s.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="py-8 border-b border-[#D5D0C8] fu-4">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-[#AAA]" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                Common Questions
              </h2>
              <Link
                href="/faq"
                className="ml-auto text-[10px] text-[#AAA] hover:text-[#1C1C1C] underline underline-offset-2 transition-colors"
              >
                See full FAQ →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-px bg-[#D5D0C8] border border-[#D5D0C8]">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-[#F7F5F0] hover:bg-white transition-colors p-5">
                  <p
                    className="text-[12px] font-semibold text-[#1C1C1C] mb-2"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {item.q}
                  </p>
                  <p className="text-[11px] text-[#777] leading-snug">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA + TRUST CLOSE ── */}
          <div className="pt-8 fu-4">
            <div className="grid lg:grid-cols-3 gap-px bg-[#D5D0C8] border border-[#D5D0C8] mb-8">
              {/* Dark CTA */}
              <div className="lg:col-span-2 bg-[#1C1C1C] p-8 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 80px)",
                  }}
                />
                <div className="relative">
                  <p className="text-[9px] text-[#E8C547] font-bold uppercase tracking-[0.25em] mb-3">
                    Ready to get verified?
                  </p>
                  <h3
                    className="text-xl sm:text-2xl text-white mb-3 leading-snug"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Submit your startup — free, takes 5 minutes.
                  </h3>
                  <p className="text-sm text-white/40 mb-6 max-w-md">
                    Our team will review, verify, and publish your profile within 3–7 days. No payment, no login, no nonsense.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/submit"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8C547] text-[#1C1C1C] text-[11px] font-bold uppercase tracking-wider hover:bg-[#F5D55A] transition-colors"
                    >
                      Submit Your Startup <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href="mailto:contact@upforge.in"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider hover:border-white/40 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Us
                    </a>
                  </div>
                </div>
              </div>

              {/* Already listed? */}
              <div className="bg-[#F7F5F0] hover:bg-white transition-colors p-7 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#AAA] mb-4">Already listed?</p>
                  <p
                    className="text-base font-semibold text-[#1C1C1C] mb-3 leading-snug"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Request re-verification or update your profile.
                  </p>
                  <p className="text-[11px] text-[#777] mb-5">
                    If your startup has evolved — new funding, product launch, team changes — email us to update your listing and trigger a re-review.
                  </p>
                </div>
                <a
                  href="mailto:contact@upforge.in?subject=Verification Request — [Your Startup Name]"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1C1C1C] hover:text-[#A89060] transition-colors"
                >
                  Request update <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-4 border-t border-[#D5D0C8]">
              {[
                { icon: Shield,       text: "Independent · No commercial influence" },
                { icon: BadgeCheck,   text: "Free · Always" },
                { icon: Lock,         text: "Structured criteria · Zero bias" },
                { icon: Globe,        text: "Permanently publicly indexed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5 text-[#BBB]" />
                  <span className="text-[11px] text-[#888]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

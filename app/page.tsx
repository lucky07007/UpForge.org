// app/page.tsx
import { fetchAllStartups } from "@/lib/google-sheets"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { ForbesCover } from "../components/forbes/forbes-cover"
import { ForbesSidebar } from "../components/forbes/forbes-sidebar"
import { StartupIntelligenceJournal } from "../components/forbes/startup-intelligence-journal"
import { ForbesIndex } from "../components/forbes/forbes-index"
import { TrustStrip } from "../components/homepage/TrustStrip"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const revalidate = 300

// ---------------------------------------------------------------------------
// DOMAIN DETECTION
// ---------------------------------------------------------------------------
async function getDomain(): Promise<"org" | "in"> {
  const headersList = await headers()
  const context = headersList.get("x-upforge-domain")
  if (context === "org" || context === "in") return context as "org" | "in"
  const host = headersList.get("host") ?? ""
  return host.includes("upforge.org") ? "org" : "in"
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const domain = await getDomain()
  const isOrg = domain === "org"
  const canonicalUrl = isOrg ? "https://www.upforge.org" : "https://www.upforge.in"

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "UpForge Global Startup Registry",
    "url": canonicalUrl,
    "description": "Global startup registry with verified founder database and UFRN credentials",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }

  if (isOrg) {
    return {
      title: "Global Startup Registry & Verified Founder Database | UpForge 2026",
      description:
        "Discover 47,000+ verified startups across 150+ countries. Get UFRN credentials, track founder intelligence, access real-time startup data.",
      keywords: [
        "startup registry",
        "startup directory",
        "verified startups",
        "founder database",
        "startup intelligence",
        "UFRN verification",
        "global startup database",
        "startup tracking",
      ],
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: "UpForge — Global Startup Registry",
        description: "47,000+ verified startups. Global founder database. Real-time intelligence.",
        url: canonicalUrl,
        siteName: "UpForge",
        locale: "en",
        type: "website",
        images: [
          {
            url: "https://www.upforge.org/og/registry.png",
            width: 1200,
            height: 630,
          },
        ],
      },
      other: {
        "application-ld+json": JSON.stringify(schema),
      },
      robots: { index: true, follow: true },
    }
  }

  return {
    title: "Startup Registry India | Verified Founder Database | UpForge",
    description:
      "India's most comprehensive verified startup directory. Discover 12,000+ Indian startups with UFRN credentials. Real-time founder intelligence and startup tracking.",
    keywords: [
      "Indian startup registry",
      "founder database India",
      "unicorn registry",
      "startup verification India",
      "UFRN India",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: "UpForge India — Startup Registry",
      description: "12,000+ verified Indian startups. Real-time intelligence.",
      url: canonicalUrl,
      siteName: "UpForge India",
      locale: "en_IN",
      type: "website",
    },
    other: {
      "application-ld+json": JSON.stringify(schema),
    },
    robots: { index: true, follow: true },
  }
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function HomePage() {
  // Fetch latest startups from Google Sheets (cached, 5-min TTL)
  const allStartups = await fetchAllStartups()

  // Sort: featured first, then by created_at descending (newest first)
  const sorted = [...allStartups].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1
    if (!a.is_featured && b.is_featured) return 1
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  })

  const startups = sorted.slice(0, 14)

  const coverStartup = startups.length > 0 ? startups[0] : null
  const sidebarStartups = startups.slice(1, 5)
  const indexStartups = startups.slice(5)

  return (
    <div className="bg-background min-h-screen text-foreground pt-6 pb-0">

      <div className="max-w-[1300px] mx-auto px-4 md:px-8">

        {/* 1. MASTHEAD */}
        <section className="border-b-2 border-foreground pb-3 mb-0 pt-0 flex flex-col items-center text-center w-full">
          
          <h1
            className="text-3xl md:text-4xl lg:text-[56px] font-bold leading-[1.04] text-foreground mb-2 max-w-4xl pt-1"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Verified Founder Database
          </h1>
          
        </section>

        {/* TRUST STRIP — Instant credibility, minimal footprint */}
        <TrustStrip />

        {/* 2. LIVE REGISTRY MATRIX */}
        <section className="mt-8 mb-20">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-foreground">
            <h2 className="font-sans font-black text-[13px] uppercase tracking-widest text-[#C59A2E] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C59A2E] animate-pulse" />
              Live Verification Feed
            </h2>

            <div className="flex-1" />

            <Link
              href="/registry"
              className="font-sans font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Explore Registry <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 border-b border-border pb-12 mb-12">

            <main>
              <ForbesCover startup={coverStartup} />
            </main>

            <aside className="relative">
              <div className="sticky top-20">
                <ForbesSidebar startups={sidebarStartups} />
              </div>
            </aside>

          </div>

          <ForbesIndex startups={indexStartups} />

        </section>

        {/* 3. INTELLIGENCE JOURNAL — Startup-focused content only */}
        <section className="mb-24">
          <StartupIntelligenceJournal />
        </section>

      </div>

      {/* 4. CTA — Single clear action */}
      <section className="bg-muted/30 border-t-2 border-foreground py-12">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2
                className="text-2xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Register Your Startup Globally
              </h2>
              <p className="text-muted-foreground text-lg">
                Get verified UFRN credential. Appear in global registry. 
                Attract investors. Takes 5 minutes.
              </p>
            </div>
            
            <Link
              href="/submit"
              className="font-sans font-black text-[10px] text-background bg-[#C59A2E] px-10 py-4 uppercase tracking-[0.2em] hover:bg-[#A8821E] transition-colors shrink-0 whitespace-nowrap shadow-sm"
            >
              List Your Startup →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

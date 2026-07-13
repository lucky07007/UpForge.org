// app/founder-stories/page.tsx
// SERVER COMPONENT - Main index with theme support

import { Suspense } from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { getAllFounders, getFeaturedFounders } from "@/lib/founders/data"
import { FounderHero } from "@/components/founder-stories/founder-hero"
import { FounderGrid } from "@/components/founder-stories/founder-grid"
import { FounderNewsletter } from "@/components/founder-stories/founder-newsletter"
import { JsonLd } from "@/components/seo/json-ld"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const revalidate = 3600

// ---------------------------------------------------------------------------
// DOMAIN DETECTION (same as homepage)
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
  const canonicalUrl = isOrg 
    ? "https://www.upforge.org/founder-stories" 
    : "https://www.upforge.in/founder-stories"

  if (isOrg) {
    return {
      title: "The Founder Chronicle — Global Startup Builder Stories 2026 | UpForge",
      description: "Deep-dive editorial profiles of the founders reshaping the global economy. From unicorn builders to emerging market innovators. Verified data, real stories.",
      keywords: [
        "founder stories", "startup founders", "entrepreneur profiles",
        "global unicorn founders", "founder interviews", "AI founders",
        "tech billionaires", "startup success stories"
      ],
      alternates: { 
        canonical: canonicalUrl,
        languages: {
          'en': 'https://www.upforge.org/founder-stories',
          'x-default': 'https://www.upforge.org/founder-stories'
        }
      },
      openGraph: {
        title: "The Founder Chronicle — Global Startup Builder Stories 2026",
        description: "Editorial deep-dives into the founders building tomorrow's economy.",
        url: canonicalUrl,
        siteName: "UpForge",
        locale: "en",
        type: "website",
        images: [{
          url: "https://www.upforge.org/og/founder-chronicle.png",
          width: 1200,
          height: 630,
          alt: "The Founder Chronicle by UpForge"
        }]
      },
      twitter: {
        card: "summary_large_image",
        site: "@UpForgeHQ",
        creator: "@UpForgeHQ",
        title: "The Founder Chronicle — Global Edition 2026",
        description: "Deep-dive founder profiles. Real stories, verified data.",
        images: ["https://www.upforge.org/og/founder-chronicle.png"]
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1
        }
      }
    }
  }

  return {
    title: "The Founder Chronicle — India's Startup Builders 2026 | UpForge",
    description: "Deep-dive editorial profiles of India's most consequential startup founders. Real stories, verified data.",
    keywords: [
      "Indian founder stories", "India startup founders", "Indian unicorn founders",
      "Indian entrepreneur profiles", "startup success stories India"
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: "The Founder Chronicle — India's Startup Builders 2026",
      description: "Editorial deep-dives into India's top founders.",
      url: canonicalUrl,
      siteName: "UpForge India",
      locale: "en_IN",
      type: "website",
    },
    robots: { index: true, follow: true }
  }
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function FounderStoriesPage() {
  const featuredFounders = getFeaturedFounders(3)
  const { founders: initialFounders, total } = getAllFounders(1, 10)
  const domain = await getDomain()
  const isOrg = domain === "org"
  
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "The Founder Chronicle — UpForge",
    "description": "Editorial profiles of startup founders building the future economy",
    "url": isOrg ? "https://www.upforge.org/founder-stories" : "https://www.upforge.in/founder-stories",
    "numberOfItems": total,
    "itemListElement": initialFounders.map((founder, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": isOrg 
        ? `https://www.upforge.org/founder-stories/${founder.slug}`
        : `https://www.upforge.in/founder-stories/${founder.slug}`,
      "name": founder.name
    }))
  }
  
  return (
    <>
      <JsonLd data={collectionSchema} />
      
      <div className="bg-background min-h-screen text-foreground pt-6 pb-0">
        <div className="max-w-[1300px] mx-auto px-4 md:px-8">
          
          {/* 1. MASTHEAD — Clean like homepage, only title */}
          <section className="border-b-2 border-foreground pb-3 mb-3 pt-0 flex flex-col items-center text-center w-full">
            <h1
              className="text-3xl md:text-4xl lg:text-[56px] font-bold leading-[1.04] text-foreground mb-2 max-w-4xl pt-1"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              The Founder Chronicle
            </h1>
          </section>

          {/* 2. FEATURED STORIES SECTION */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-foreground">
              <h2 className="font-sans font-black text-[13px] uppercase tracking-widest text-[#C59A2E] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C59A2E] animate-pulse" />
                Featured Stories
              </h2>
              <div className="flex-1" />
              <Link
                href="/founder-stories"
                className="font-sans font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
              >
                All Stories <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <FounderHero featuredFounders={featuredFounders} />
          </section>

          {/* 3. THE INDEX — All founders grid */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b-2 border-foreground">
              <h2 className="font-sans font-black text-[13px] uppercase tracking-widest text-foreground">
                The Index
              </h2>
              <div className="flex-1" />
              <span className="font-sans font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                {total} Profiles
              </span>
            </div>

            <Suspense fallback={<FounderGridSkeleton />}>
              <FounderGrid 
                initialFounders={initialFounders}
                totalFounders={total}
              />
            </Suspense>
          </section>

        </div>

        {/* 4. NEWSLETTER CTA */}
        <FounderNewsletter />

        {/* 5. BOTTOM CTA — Submit your story */}
        <section className="bg-muted/30 border-t-2 border-foreground py-8">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#C59A2E] flex items-center justify-center shrink-0">
                <span className="text-background font-serif text-xl font-bold">F</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Georgia', serif" }}>
                  Are you a founder?
                </h2>
                <p className="font-serif italic text-[15px] text-muted-foreground">
                  Get your story featured in The Founder Chronicle. Verified profiles, global reach.
                </p>
              </div>
            </div>
            <Link
              href="/submit"
              className="font-sans font-black text-[10px] text-background bg-[#C59A2E] px-8 py-3.5 uppercase tracking-[0.2em] hover:bg-[#A8821E] transition-colors shrink-0 whitespace-nowrap shadow-sm"
            >
              Submit Your Story
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

// Loading skeleton
function FounderGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted h-64 mb-4 border border-border" />
          <div className="bg-muted h-4 w-3/4 mb-2" />
          <div className="bg-muted h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

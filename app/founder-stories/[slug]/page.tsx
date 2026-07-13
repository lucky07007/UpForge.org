// app/founder-stories/[slug]/page.tsx
// SERVER COMPONENT - Fully SEO optimized with theme support

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { 
  getFounderBySlug, 
  getRelatedFounders, 
  getAdjacentFounders,
  getAllFounders
} from "@/lib/founders/data"
import { FounderNewsletter } from "@/components/founder-stories/founder-newsletter"
import { JsonLd } from "@/components/seo/json-ld"

interface PageProps {
  params: Promise<{ slug: string }>
}

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

// Generate static paths for all founders (build time)
export async function generateStaticParams() {
  const { founders } = getAllFounders(1, 100)
  return founders.map(founder => ({ slug: founder.slug }))
}

// Dynamic metadata for each founder
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const founder = getFounderBySlug(slug)
  const domain = await getDomain()
  const isOrg = domain === "org"
  
  if (!founder) return {}
  
  const baseUrl = isOrg ? "https://www.upforge.org" : "https://www.upforge.in"
  const url = `${baseUrl}/founder-stories/${slug}`
  
  const title = `${founder.name} — ${founder.company} Founder Story | The Founder Chronicle`
  const description = `${founder.deck} ${founder.headline} Read the full editorial profile.`
  
  return {
    title,
    description,
    keywords: [
      `${founder.name} story`,
      `${founder.company} founder`,
      `${founder.company} success story`,
      `how ${founder.name} built ${founder.company}`,
      `${founder.country} startup founders`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: isOrg ? "UpForge" : "UpForge India",
      locale: isOrg ? "en" : "en_IN",
      type: "article",
      publishedTime: founder.publishedAt,
      modifiedTime: founder.updatedAt,
      authors: ["UpForge Editorial"],
      images: [{
        url: founder.imageUrl,
        width: 1200,
        height: 630,
        alt: `${founder.name} - ${founder.company} founder profile`
      }]
    },
    twitter: {
      card: "summary_large_image",
      site: "@UpForgeHQ",
      creator: "@UpForgeHQ",
      title,
      description,
      images: [founder.imageUrl]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  }
}

export default async function FounderPage({ params }: PageProps) {
  const { slug } = await params
  const founder = getFounderBySlug(slug)
  const domain = await getDomain()
  const isOrg = domain === "org"
  const baseUrl = isOrg ? "https://www.upforge.org" : "https://www.upforge.in"
  
  if (!founder) notFound()
  
  const relatedFounders = getRelatedFounders(slug, 3)
  const { prev, next } = getAdjacentFounders(slug)
  
  // Schema.org JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": founder.headline,
    "description": founder.deck,
    "image": founder.imageUrl,
    "datePublished": founder.publishedAt,
    "dateModified": founder.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "UpForge Editorial",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "UpForge",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/founder-stories/${slug}`
    },
    "about": {
      "@type": "Person",
      "name": founder.name,
      "jobTitle": founder.role,
      "worksFor": {
        "@type": "Organization",
        "name": founder.company
      }
    }
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "UpForge",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "The Founder Chronicle",
        "item": `${baseUrl}/founder-stories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": founder.name,
        "item": `${baseUrl}/founder-stories/${slug}`
      }
    ]
  }
  
  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      
      <div className="bg-background min-h-screen text-foreground">
        
        {/* Header — Newspaper style */}
        <header className="border-b-2 border-foreground bg-background">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <Link href="/" className="text-[9px] text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors font-mono">
                {baseUrl.replace("https://www.", "")}
              </Link>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                The Founder Chronicle · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            
            <div className="text-center py-8 border-b border-border">
              <Link href="/founder-stories" className="inline-block">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-foreground hover:text-[#C59A2E] transition-colors">
                  The Founder Chronicle
                </h1>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1300px] mx-auto px-4 md:px-8 pb-16">
          
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 border-b-2 border-foreground pb-12">
            
            {/* Left Column - Story */}
            <div className="py-8">
              
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span 
                  className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 text-white"
                  style={{ background: founder.accent }}
                >
                  {founder.category || "Founder Story"}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-mono">
                  No. {founder.edition} · {founder.country}
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black leading-[1.08] text-foreground mb-5">
                {founder.headline}
              </h2>

              {/* Deck */}
              <p className="font-serif italic text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 pb-6 border-b border-border">
                {founder.deck}
              </p>

              {/* Byline */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-8 font-mono">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">By UpForge Editorial</span>
                <span className="text-border text-[10px]">·</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{founder.city}</span>
                <span className="text-border text-[10px]">·</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Est. {founder.founded}</span>
                <span className="text-border text-[10px]">·</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{founder.context}</span>
              </div>

              {/* Mobile Image */}
              <div className="lg:hidden mb-8">
                <div className="relative w-full aspect-[16/10] bg-muted border border-border overflow-hidden">
                  <Image
                    src={founder.imageUrl}
                    alt={founder.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="px-4 py-3 bg-foreground">
                  <p className="font-serif text-background font-bold text-lg">{founder.name}</p>
                  <p className="text-background/60 text-[10px] uppercase tracking-wide font-mono">
                    {founder.role} · {founder.company}
                  </p>
                </div>
              </div>

              {/* Newspaper Columns */}
              <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
                {founder.columns.map((col, ci) => (
                  <div key={ci} className={`py-4 md:py-0 ${ci > 0 ? 'md:pl-5' : ''} ${ci < 2 ? 'md:pr-5' : ''}`}>
                    <h3 
                      className="font-mono font-black uppercase tracking-[0.1em] text-xs text-foreground mb-3 pb-2 border-b-2"
                      style={{ borderColor: founder.accent }}
                    >
                      {col.heading}
                    </h3>
                    {col.body.split("\n\n").map((para, pi) => (
                      <p 
                        key={pi} 
                        className={`font-serif text-sm leading-[1.9] text-muted-foreground mb-4 ${ci === 0 && pi === 0 ? 'first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-[0.8] first-letter:text-foreground' : ''}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Pull Quote */}
              <div 
                className="mt-10 pt-8 pb-8 text-center border-t-2 border-b border-border"
                style={{ borderTopColor: founder.accent }}
              >
                <span className="block text-border text-xl mb-3">❧</span>
                <blockquote className="font-serif italic text-foreground text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto px-4">
                  "{founder.pullQuote}"
                </blockquote>
                <span className="block text-border text-xl my-3">❧</span>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                  — {founder.pullQuoteBy}, {founder.company}
                </p>
              </div>
            </div>

            {/* Right Sidebar - Desktop */}
            <aside className="hidden lg:block py-8 border-l border-border pl-8">
              <div className="sticky top-8 flex flex-col gap-6 max-h-screen overflow-y-auto">
                
                {/* Founder Image */}
                <div className="relative w-full aspect-[3/4] bg-muted border border-border overflow-hidden">
                  <Image
                    src={founder.imageUrl}
                    alt={founder.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="font-serif text-white font-bold text-lg">{founder.name}</p>
                    <p className="text-white/60 text-[10px] uppercase tracking-wide font-mono">
                      {founder.role}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-2 border-foreground">
                  <div className="px-4 py-2.5 bg-foreground">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-background font-mono">
                      By the Numbers
                    </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-y divide-border">
                    {founder.stats.map((stat, i) => (
                      <div key={i} className="px-4 py-3.5 bg-background">
                        <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-mono mb-1">
                          {stat.label}
                        </p>
                        <p className="font-serif font-black text-foreground text-xl">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lesson */}
                <div 
                  className="px-4 py-4 border"
                  style={{ 
                    background: founder.accentBg || 'var(--background)',
                    borderColor: founder.accent 
                  }}
                >
                  <p 
                    className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 font-mono"
                    style={{ color: founder.accent }}
                  >
                    The Lesson
                  </p>
                  <p className="font-serif italic text-foreground text-sm leading-relaxed">
                    {founder.lesson}
                  </p>
                </div>

                {/* Related Founders */}
                {relatedFounders.length > 0 && (
                  <div className="border-t border-border pt-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 font-mono">
                      More Stories
                    </p>
                    <div className="flex flex-col gap-0 divide-y divide-border">
                      {relatedFounders.map((rf) => (
                        <Link 
                          key={rf.id} 
                          href={`/founder-stories/${rf.slug}`}
                          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 group"
                        >
                          <div className="w-12 h-12 relative overflow-hidden border border-border bg-muted shrink-0">
                            <Image src={rf.imageUrl} alt={rf.nameShort} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-bold text-foreground group-hover:text-[#C59A2E] transition-colors truncate">
                              {rf.nameShort}
                            </p>
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">
                              {rf.company}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between py-6 border-b border-border">
            {prev ? (
              <Link 
                href={`/founder-stories/${prev.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {prev.nameShort}
              </Link>
            ) : <div />}
            
            <Link 
              href="/founder-stories" 
              className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground font-mono"
            >
              All Stories
            </Link>
            
            {next ? (
              <Link 
                href={`/founder-stories/${next.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-mono"
              >
                {next.nameShort}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : <div />}
          </div>

        </main>

        <FounderNewsletter />
      </div>
    </>
  )
}

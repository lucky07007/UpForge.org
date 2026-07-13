"use client"

import React, { useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Startup } from "@/types/startup"
import type { DomainContext } from "@/lib/domain"
import { getStartupUrl } from "@/lib/domain"
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Globe,
  MapPin,
  Calendar,
  Building2,
  Tag,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from "lucide-react"

type RelatedStartup = Pick<
  Startup,
  "name" | "slug" | "description" | "logo_url" | "category"
>

interface StartupDetailProps {
  startup: Startup
  relatedStartups: RelatedStartup[]
  profileUrl: string
  domain?: DomainContext
}

function getCleanUrl(url?: string | null): string | null {
  if (!url) return null
  const formatted = /^https?:\/\//i.test(url.trim()) ? url.trim() : "https://" + url.trim()
  try {
    new URL(formatted)
    return formatted
  } catch {
    return null
  }
}

function getCategorySlug(category?: string | null): string | null {
  if (!category) return null
  return category.toLowerCase().replace(/\s+/g, "-")
}

function getCitySlug(city?: string | null): string | null {
  if (!city) return null
  return city.toLowerCase().replace(/\s+/g, "-")
}

function getVerificationCode(name: string, id: string): string {
  const prefix = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase()
  const suffix = id.replace(/-/g, "").slice(-5).toUpperCase()
  return "UPF-" + prefix + "-" + suffix
}

function StartupLogo({ name, logo_url, size, className = "" }: { name: string; logo_url?: string | null; size: number; className?: string }) {
  if (logo_url) {
    return <img src={logo_url} alt={name + " logo"} width={size} height={size} className={`object-cover w-full h-full ${className}`} />
  }
  return (
    <span className="text-3xl font-serif font-black text-foreground" aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

function RelatedStartupCard({ startup }: { startup: RelatedStartup }) {
  const href = getStartupUrl(startup.slug || "")
  return (
    <Link href={href} className="group flex items-start gap-4 p-4 border border-border hover:bg-muted/30 transition-colors">
      <div className="h-14 w-14 flex items-center justify-center flex-shrink-0 bg-muted border border-border">
        <StartupLogo name={startup.name} logo_url={startup.logo_url} size={56} className="p-0.5" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h4 className="font-serif font-bold text-foreground text-sm group-hover:text-[#B30000] transition-colors truncate">{startup.name}</h4>
        {startup.category && <p className="font-sans font-bold text-[9px] uppercase tracking-widest text-[#B30000] mt-1">{startup.category}</p>}
        {startup.description && <p className="font-serif text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{startup.description}</p>}
      </div>
    </Link>
  )
}

interface BlogLink {
  title: string
  slug: string
  description: string
}

function getRelatedBlogs(category?: string | null): BlogLink[] {
  const normalized = (category || "").toLowerCase()
  
  const allBlogs: Record<string, BlogLink[]> = {
    ai: [
      {
        title: "Proprietary Data Moats: Why VCs Reject Wrapper AI Startups",
        slug: "investors-rejecting-generic-ai-pitches-2026",
        description: "An in-depth analysis of why VCs are rejecting generic AI wrapper pitches and demanding proprietary data architectures."
      },
      {
        title: "From Seed to Acquisition: AI Exit Routes in India's 2026 Ecosystem",
        slug: "ai-startup-funding-exit-route-india-2026",
        description: "Exploring M&A and secondary exit routes for Indian artificial intelligence startups raising early-stage capital."
      },
      {
        title: "Top AI Startups in India Leading the Machine Learning Wave",
        slug: "top-ai-startups-india-2026",
        description: "Profiles of the most promising artificial intelligence and machine learning teams building in India."
      }
    ],
    fintech: [
      {
        title: "Fintech Innovation in India: Key Trends & Rising Challengers",
        slug: "fintech-startups-india-2026",
        description: "Analyzing the regulatory changes, credit expansion, and rising merchant-focused fintech platforms in 2026."
      },
      {
        title: "Startup Valuation Benchmarks: How Valuations are Calculated",
        slug: "startup-valuation-india-2026",
        description: "Understanding DCF and market multiple valuation frameworks used by top-tier Indian angel networks."
      }
    ],
    saas: [
      {
        title: "Proprietary Data Moats: Why VCs Reject Wrapper AI Startups",
        slug: "investors-rejecting-generic-ai-pitches-2026",
        description: "An in-depth analysis of why VCs are rejecting generic AI wrapper pitches and demanding proprietary data architectures."
      },
      {
        title: "Bootstrapped to Success: Inspiring Indian Bootstrapped Startups",
        slug: "bootstrapped-startups-india-success-stories",
        description: "How Indian SaaS and D2C startups reached profitability without raising external institutional funding."
      }
    ],
    deeptech: [
      {
        title: "Government Contracts and Privatization: Space & Defence Tech in H1 2026",
        slug: "defense-tech-startups-india-2026",
        description: "How defense-tech and space-tech startups are securing non-dilutive government contracts and capital."
      },
      {
        title: "From Seed to Acquisition: AI Exit Routes in India's 2026 Ecosystem",
        slug: "ai-startup-funding-exit-route-india-2026",
        description: "Exploring M&A and secondary exit routes for Indian artificial intelligence startups raising early-stage capital."
      }
    ],
    compliance: [
      {
        title: "The Founder's Guide to UFRN Credentials and Startup Vetting",
        slug: "startup-verification-ufrn-credentials-guide",
        description: "Learn how the UpForge Registry Number system works, how to get verified, and how it accelerates investor relations."
      },
      {
        title: "Startup Legal & Compliance Guide: Essential Filings for Indian Founders",
        slug: "startup-legal-guide-india-2026",
        description: "A comprehensive guide on ROC, MCA, and DPIIT compliance filings required for operating startups in India."
      }
    ]
  }

  // Fallback defaults if no direct category match
  const defaultBlogs: BlogLink[] = [
    {
      title: "The Founder's Guide to UFRN Credentials and Startup Vetting",
      slug: "startup-verification-ufrn-credentials-guide",
      description: "Learn how the UpForge Registry Number system works, how to get verified, and how it accelerates investor relations."
    },
    {
      title: "Decentralized Growth: How Tier-2 & Tier-3 Cities are Powering Startups",
      slug: "tier-2-tier-3-indian-cities-producing-startups-2026",
      description: "A deep dive into why non-metropolitan hubs are generating over half of all new startup registrations in India."
    },
    {
      title: "Navigating the VC Winter: How to Secure Startup Funding in 2026",
      slug: "how-to-get-startup-funding-india-2026",
      description: "Strategies for founders pitching Seed and Series A rounds in an era of intensive due diligence."
    }
  ]

  if (normalized.includes("artificial") || normalized.includes("ai") || normalized.includes("machine")) {
    return allBlogs.ai
  }
  if (normalized.includes("fintech") || normalized.includes("finance") || normalized.includes("insurance") || normalized.includes("payment")) {
    return allBlogs.fintech
  }
  if (normalized.includes("saas") || normalized.includes("software") || normalized.includes("enterprise")) {
    return allBlogs.saas
  }
  if (normalized.includes("deep") || normalized.includes("space") || normalized.includes("defense") || normalized.includes("hardware") || normalized.includes("tech")) {
    return allBlogs.deeptech
  }
  if (normalized.includes("legal") || normalized.includes("regulatory") || normalized.includes("compliance") || normalized.includes("verification")) {
    return allBlogs.compliance
  }
  return defaultBlogs
}

export function StartupDetail({ startup, relatedStartups }: StartupDetailProps) {
  const posterRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const websiteUrl = getCleanUrl(startup.website)
  const categorySlug = getCategorySlug(startup.category)
  const citySlug = getCitySlug(startup.city)
  const verificationCode = startup.ufrn ?? getVerificationCode(startup.name, startup.id)
  const isPending = startup.ufrn === "PENDING-VERIFICATION" || !startup.ufrn

  const handleDownload = useCallback(async function () {
    if (!posterRef.current || isGenerating) return
    setIsGenerating(true)
    try {
      const [{ toBlob }, { saveAs }] = await Promise.all([import("html-to-image"), import("file-saver")])
      const blob = await toBlob(posterRef.current, { cacheBust: true, backgroundColor: "#ffffff", pixelRatio: 3 })
      if (!blob) throw new Error("toBlob returned null")
      saveAs(blob, startup.name + "-UpForge-Record.png")
    } catch (err) {
      console.error("[StartupDetail] Poster generation failed:", err)
    } finally {
      setIsGenerating(false)
    }
  }, [isGenerating, startup.name])

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hidden Poster element for downloads */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}>
        <div ref={posterRef} style={{ width: 1080, height: 1350, backgroundColor: "#ffffff", padding: 80, display: "flex", flexDirection: "column", color: "#000000", fontFamily: "'Georgia', serif", position: 'relative', border: '20px solid #f8f8f8' }}>
          
          {/* Header */}
          <div style={{ borderBottom: "3px solid #000000", paddingBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "sans-serif" }}>
            <span style={{ fontSize: 28, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>UPFORGE <span style={{ color: "#B30000" }}>REGISTRY</span></span>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", display: 'block' }}>Official Public Record</span>
                <span style={{ fontSize: 10, fontWeight: 500, color: "#999" }}>Ref: {verificationCode}</span>
            </div>
          </div>

          {/* Main Body */}
          <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
            <p style={{ fontSize: 14, fontFamily: "sans-serif", color: "#B30000", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20, fontWeight: 800 }}>Certified Global Entity</p>
            <h1 style={{ fontSize: 72, fontWeight: 800, marginBottom: 15, lineHeight: 1.1, fontFamily: "'Georgia', serif" }}>{startup.name}</h1>
            <div style={{ width: 60, height: 4, backgroundColor: '#000', margin: '20px auto 40px' }}></div>
            
            {/* Description Block */}
            {startup.description && (
                <p style={{ fontSize: 18, lineHeight: 1.6, color: '#333', marginBottom: 40, padding: '0 40px', fontStyle: 'italic' }}>
                    "{startup.description.length > 280 ? startup.description.substring(0, 280) + '...' : startup.description}"
                </p>
            )}

            {/* Structured Info Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', background: '#fcfcfc', padding: '30px', border: '1px solid #eee' }}>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#B30000', marginBottom: 5, fontFamily: 'sans-serif' }}>Founders</p>
                    <p style={{ fontSize: 18, fontWeight: 700 }}>{startup.founders || "Not Disclosed"}</p>
                </div>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#B30000', marginBottom: 5, fontFamily: 'sans-serif' }}>Incorporation Year</p>
                    <p style={{ fontSize: 18, fontWeight: 700 }}>{startup.founded_year || "N/A"}</p>
                </div>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#B30000', marginBottom: 5, fontFamily: 'sans-serif' }}>Primary Sector</p>
                    <p style={{ fontSize: 18, fontWeight: 700 }}>{startup.category || "General Technology"}</p>
                </div>
                <div>
                    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#B30000', marginBottom: 5, fontFamily: 'sans-serif' }}>Verification ID</p>
                    <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>{startup.ufrn || "PENDING"}</p>
                </div>
            </div>
          </div>

          {/* Footer & Seal */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: "2px solid #000000", paddingTop: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", textTransform: "uppercase", lineHeight: 1.8 }}>
              <span style={{ color: "#B30000", display: 'block' }}>Verified Digital Certificate</span>
              <span style={{ color: '#000' }}>upforge.org/startup/{startup.slug}</span>
            </div>
            
            {/* Seal Image */}
            <div style={{ position: 'relative' }}>
                <img 
                    src="/seal.jpg" 
                    alt="Official Seal" 
                    style={{ width: 140, height: 140, objectFit: 'contain', opacity: 0.9 }} 
                />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 md:px-8">
        {/* Breadcrumb / Top Bar */}
        <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b-[1.5px] border-foreground">
          <div className="h-12 flex items-center justify-between">
            <Link href="/registry" className="flex items-center gap-2 font-sans font-bold text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Global Index</span>
            </Link>
            <button onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2 font-sans font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 border border-foreground hover:bg-muted transition-colors">
              <Download className="h-3 w-3" />
              {isGenerating ? "Exporting..." : "Export Official Record"}
            </button>
          </div>
        </div>

        <main className="py-8 md:py-12">
          {/* UI CONTENT CONTINUES SAME AS BEFORE */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8 pb-8 border-b-2 border-foreground">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
              <StartupLogo name={startup.name} logo_url={startup.logo_url} size={128} />
            </div>
            
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border text-[9px] font-sans font-bold uppercase tracking-widest mb-4 ${isPending ? "text-amber-600" : "text-foreground"}`}>
                <ShieldCheck className={`w-3 h-3 ${isPending ? "text-amber-500" : "text-[#B30000]"}`} /> 
                {isPending ? "Verification Pending" : "Entity Verified"}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-tight text-foreground leading-[1]" style={{ fontFamily: "'Georgia', serif" }}>
                {startup.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
                {startup.category && (
                  <div className="flex items-center gap-2 font-sans font-bold text-[10px] uppercase tracking-widest text-[#B30000]">
                    <Tag className="h-3 w-3" />
                    {categorySlug ? <Link href={"/startups/" + categorySlug} className="hover:underline underline-offset-2">{startup.category}</Link> : <span>{startup.category}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2 font-sans font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {citySlug && startup.city ? <Link href={"/startups/" + citySlug} className="hover:underline underline-offset-2">{startup.city + ", " + (startup.country_name ?? "Global")}</Link> : <span>{startup.country_name ?? "Global"}</span>}
                </div>
                {startup.founded_year && (
                  <div className="flex items-center gap-2 font-sans font-bold text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Est. {startup.founded_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8">
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-5 border-b border-border pb-2">
                  <h2 className="font-sans font-black text-[11px] uppercase tracking-widest text-foreground">
                    Executive Summary
                  </h2>
                </div>
                <p className="text-lg md:text-xl font-serif text-foreground/90 leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:font-serif first-letter:text-foreground first-letter:mr-2 first-letter:float-left">
                  {startup.name} is a{isPending ? "n unverified" : " verified"} entity operating within the global {startup.category || "startup"} sector. 
                  {startup.founded_year && ` Established in ${startup.founded_year}, `}
                  {startup.city && ` it is headquartered in ${startup.city}`}
                  {startup.country_name && `, ${startup.country_name}`}. 
                  {startup.founders && ` The organization was founded by ${startup.founders}, driving innovation and scalable solutions.`}
                </p>
              </section>

              {/* Registry CTA */}
              <div className="w-full border-l-4 border-[#B30000] bg-muted/20 my-8 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-sans font-black text-[9px] uppercase tracking-[0.2em] text-[#B30000] mb-1">Global Registry</p>
                  <p className="font-serif font-bold text-[15px] sm:text-[17px] text-foreground leading-snug">
                    Is your startup listed in the global registry?
                  </p>
                  <p className="font-serif text-sm text-muted-foreground mt-1">
                    Get your UFRN credential and appear in front of 2,200+ active investors. Free basic listing.
                  </p>
                </div>
                <Link
                  href="/submit"
                  className="shrink-0 font-sans font-black text-[9px] uppercase tracking-[0.15em] bg-foreground text-background px-6 py-3 hover:bg-[#B30000] transition-colors whitespace-nowrap"
                >
                  List Your Startup →
                </Link>
              </div>

              {startup.description && (
                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-5 border-b border-border pb-2">
                    <h2 className="font-sans font-black text-[11px] uppercase tracking-widest text-[#B30000]">
                      Corporate Overview
                    </h2>
                  </div>
                  <p className="text-base md:text-[17px] font-serif text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {startup.description}
                  </p>
                </section>
              )}

              <section className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border">
                <div>
                  <h3 className="font-sans font-black text-[9px] uppercase tracking-widest text-muted-foreground mb-4">Market Data</h3>
                  <ul className="space-y-3 font-serif text-[15px] text-foreground/90">
                    <li className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Sector</span>
                      <span className="font-bold">{startup.category || "Unlisted"}</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Base</span>
                      <span className="font-bold text-right">{[startup.city, startup.country_name].filter(Boolean).join(", ") || "Global"}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-sans font-black text-[9px] uppercase tracking-widest text-muted-foreground mb-4">Corporate Struct</h3>
                  <ul className="space-y-3 font-serif text-[15px] text-foreground/90">
                    <li className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Established</span>
                      <span className="font-bold">{startup.founded_year || "Unknown"}</span>
                    </li>
                    {startup.founders && (
                      <li className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Executive(s)</span>
                        <span className="font-bold text-right line-clamp-1 truncate ml-2 max-w-[150px]">{startup.founders}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </section>

              {relatedStartups && relatedStartups.length > 0 && (
                <section className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#B30000] text-[8px]">✦</span>
                    <h2 className="font-sans font-black text-[11px] uppercase tracking-widest text-foreground">
                      Related Registry Listings
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedStartups.map((s, i) => (
                      <RelatedStartupCard key={i} startup={s} />
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[#B30000] text-[8px]">✦</span>
                  <h2 className="font-sans font-black text-[11px] uppercase tracking-widest text-foreground">
                    Related Editorial Insights
                  </h2>
                </div>
                <div className="space-y-4">
                  {getRelatedBlogs(startup.category).map((blog, i) => (
                    <Link
                      key={i}
                      href={"/blog/" + blog.slug}
                      className="group block p-4 border border-border hover:bg-muted/30 transition-colors"
                    >
                      <h4 className="font-serif font-bold text-foreground text-sm group-hover:text-[#B30000] transition-colors">
                        {blog.title}
                      </h4>
                      <p className="font-serif text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {blog.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <aside className="sticky top-32">
                <div className="border border-foreground bg-muted/10 p-6 flex flex-col items-center">
                  <div className="text-center w-full mb-6 pb-6 border-b border-border">
                    <h3 className="font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Registry Status</h3>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className={`h-12 w-12 rounded-full border-[1.5px] flex items-center justify-center ${isPending ? 'border-amber-500 bg-amber-50' : 'border-[#B30000] bg-red-50'}`}>
                        <CheckCircle2 className={`h-6 w-6 ${isPending ? 'text-amber-500' : 'text-[#B30000]'}`} />
                      </div>
                      <p className={`font-serif font-bold text-3xl ${isPending ? 'text-amber-600' : 'text-foreground'}`}>
                        {isPending ? 'Unverified' : 'Verified'}
                      </p>
                    </div>
                  </div>

                  <div className="w-full mb-6 border-b border-border pb-6">
                    <p className="font-sans font-bold text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-3 text-center">Global Registry Number</p>
                    <div className="bg-background border border-border p-4 text-center">
                      <p className="font-serif font-bold text-lg text-foreground break-all">
                        {isPending ? 'PENDING' : startup.ufrn}
                      </p>
                    </div>
                  </div>

                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-[#B30000] text-background font-sans font-black text-[10px] uppercase tracking-[0.15em] text-center">
                      Visit Official Site
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

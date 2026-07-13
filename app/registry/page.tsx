// app/registry/page.tsx — Google Sheets powered (no Supabase)
import { queryStartups, getSheetFilters } from "@/lib/google-sheets"
import type { Startup } from "@/types/startup"
import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react"

export const revalidate = 300

const PAGE_SIZE = 10
const BASE_URL = "https://www.upforge.org"

type StartupRow = Startup

interface PageProps {
  searchParams: Promise<{
    page?: string; q?: string; year?: string; sort?: string
    sector?: string; country?: string
  }>
}

// ─── DATA FETCHERS (Google Sheets) ───

async function getData(
  q: string, year: string, sort: string,
  cat: string, country: string, page: number
) {
  return queryStartups({ q, year, sort, category: cat, country, page, pageSize: PAGE_SIZE })
}

async function getFilters() {
  return getSheetFilters()
}


// ─── TRENDING SECTORS ───
const TRENDING_SECTORS = [
  "AI & Technology",
  "FinTech",
  "SaaS",
  "Health",
  "E-commerce & D2C",
  "Deeptech & Climate",
  "Mobility & EV",
  "Agri-tech",
  "Logistics / Quick Commerce",
  "Consumer & Hardware",
  "Streaming Platform",
]

// ─── HELPERS ───

function buildPageUrl(page: number, extra?: Record<string, string>): string {
  const p = new URLSearchParams()
  if (extra?.q)       p.set("q", extra.q)
  if (extra?.year)    p.set("year", extra.year)
  if (extra?.sort && extra.sort !== "name") p.set("sort", extra.sort)
  if (extra?.sector)  p.set("sector", extra.sector)
  if (extra?.country) p.set("country", extra.country)
  if (page > 1)       p.set("page", String(page))
  const s = p.toString()
  return `${BASE_URL}/registry${s ? `?${s}` : ""}`
}

function buildDynamicTitle(sp: {
  q?: string; year?: string; sort?: string; sector?: string; country?: string; page?: string
}, total: number): string {
  const n = total > 0 ? total.toLocaleString() : "1,000+"
  const pg = Number(sp?.page ?? 1)
  const pgSuffix = pg > 1 ? ` — Page ${pg}` : ""
  if (sp?.q)      return `"${sp.q}" Startup Search — Global Registry${pgSuffix} | UpForge`
  if (sp?.sector) return `${sp.sector} Startups — Global Registry${pgSuffix} | UpForge`
  if (sp?.country) return `${sp.country} Startups — Global Registry${pgSuffix} | UpForge`
  if (sp?.year)   return `Startups Founded ${sp.year} — Global Registry${pgSuffix} | UpForge`
  if (pg > 1)     return `Global Startup Registry — Page ${pg} | UpForge`
  return `Global Startup Registry 2026 — ${n}+ Verified Startups | UpForge`
}

function buildDynamicDescription(sp: {
  q?: string; year?: string; sort?: string; sector?: string; country?: string
}, total: number): string {
  const n = total > 0 ? total.toLocaleString() : "1,000+"
  if (sp?.sector) return `Browse ${n}+ verified ${sp.sector} startups on UpForge Global Registry. Every listing manually reviewed and assigned a unique UFRN. Free to access forever.`
  if (sp?.country) return `Explore verified startups from ${sp.country} on UpForge Global Registry. ${n}+ listings, each with a unique UFRN identifier. Free to access.`
  if (sp?.year)   return `Discover ${n}+ startups founded in ${sp.year} on UpForge Global Registry. Every listing independently verified and assigned a UFRN.`
  if (sp?.q)      return `Search results for "${sp.q}" across ${n}+ verified global startups on UpForge Registry. Find founders, sectors, cities and more.`
  return `The open, independent, verified global registry of ${n}+ startups. Every listing is manually reviewed and assigned a unique UpForge Registry Number (UFRN). Search by founder, sector, city, country, year. Free to access, forever.`
}

// ─── METADATA ───

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const { total } = await getData("", "", "name", "", "", 1)
  const page = Math.max(1, Number(sp?.page ?? 1))
  const isFiltered = !!(sp?.q || sp?.year || sp?.sector || sp?.country)
  const sort = sp?.sort ?? "name"

  const title       = buildDynamicTitle(sp ?? {}, total)
  const description = buildDynamicDescription(sp ?? {}, total)

  const canonicalParams: Record<string, string> = {}
  if (sp?.q)           canonicalParams.q       = sp.q
  if (sp?.year)        canonicalParams.year    = sp.year
  if (sort !== "name") canonicalParams.sort    = sort
  if (sp?.sector)      canonicalParams.sector  = sp.sector
  if (sp?.country)     canonicalParams.country = sp.country
  const canonicalUrl = buildPageUrl(page, canonicalParams)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const prevUrl = page > 1          ? buildPageUrl(page - 1, canonicalParams) : undefined
  const nextUrl = page < totalPages ? buildPageUrl(page + 1, canonicalParams) : undefined
  const shouldIndex = !isFiltered || page > 1

  return {
    title,
    description,
    keywords: [
      "global startup registry", "verified startup database", "UFRN startup registry number",
      "open startup data", "startup proof of existence", "independent startup registry",
      "Indian startup founders 2026", "India unicorn founders", "upforge registry",
      "startup verification", "startup database", "global startup database 2026",
      "startup directory", "startup search", "founder registry",
    ],
    alternates: {
      canonical: canonicalUrl,
      ...(prevUrl || nextUrl ? {
        types: {
          ...(prevUrl ? { prev: prevUrl } : {}),
          ...(nextUrl ? { next: nextUrl } : {}),
        },
      } : {}),
      languages: {
        "en":    canonicalUrl,
        "en-US": canonicalUrl,
        "en-IN": canonicalUrl,
        "x-default": `${BASE_URL}/registry`,
      },
    },
    openGraph: {
      title, description,
      url: canonicalUrl,
      siteName: "UpForge Global Registry",
      images: [{ url: `${BASE_URL}/og/startup-default.png`, width: 1200, height: 630, alt: title }],
      locale: "en",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      site: "@UpForgeHQ",
      creator: "@UpForgeHQ",
      images: [`${BASE_URL}/og/startup-default.png`],
    },
    robots: {
      index: shouldIndex, follow: true,
      googleBot: {
        index: shouldIndex, follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    other: { "speakable-css-selector": ".mast-h1,.mast-tagline,.results-q" },
  }
}

// ─── PAGE ───

export default async function RegistryPage({ searchParams }: PageProps) {


  const sp      = await searchParams
  const q       = sp?.q?.trim()       ?? ""
  const year    = sp?.year?.trim()    ?? ""
  const sort    = sp?.sort?.trim()    ?? "name"
  const cat     = sp?.sector?.trim()  ?? ""
  const country = sp?.country?.trim() ?? ""
  const page    = Math.max(1, Number(sp?.page ?? 1))

  const [{ startups, total }, { years, cats, countries }] = await Promise.all([
    getData(q, year, sort, cat, country, page),
    getFilters(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const isFiltered = !!(q || year || cat || country || (sort && sort !== "name"))

  const qs = (ov: Record<string, string | undefined>) => {
    const base: Record<string, string | undefined> = {
      q:       q       || undefined,
      year:    year    || undefined,
      sort:    sort !== "name" ? sort : undefined,
      sector:  cat     || undefined,
      country: country || undefined,
      page:    page > 1 ? String(page) : undefined,
    }
    const m = { ...base, ...ov }
    const p = new URLSearchParams()
    Object.entries(m).forEach(([k, v]) => { if (v) p.set(k, v) })
    const s = p.toString()
    return `/registry${s ? `?${s}` : ""}`
  }

  const pgHref = (p: number) => qs({ page: p === 1 ? undefined : String(p) })

  const winSize  = Math.min(5, totalPages)
  const winStart =
    page <= 3 || totalPages <= 5
      ? 1
      : page >= totalPages - 2
      ? totalPages - 4
      : page - 2
  const pgNums = Array.from({ length: winSize }, (_, i) => winStart + i)

  const featured =
    page === 1 && !isFiltered
      ? startups.filter(s => s.is_featured).slice(0, 3)
      : []

  const featIds = new Set(featured.map(s => s.id))
  const grid =
    page === 1 && !isFiltered
      ? startups.filter(s => !featIds.has(s.id))
      : startups

  const baseNum = (page - 1) * PAGE_SIZE
  const activeFilterCount = [year, cat, country, sort !== "name" ? sort : ""].filter(Boolean).length

  const canonicalParams: Record<string, string> = {}
  if (q)             canonicalParams.q       = q
  if (year)          canonicalParams.year    = year
  if (sort !== "name") canonicalParams.sort  = sort
  if (cat)           canonicalParams.sector  = cat
  if (country)       canonicalParams.country = country
  const canonicalUrl = buildPageUrl(page, canonicalParams)
  const prevUrl = page > 1          ? buildPageUrl(page - 1, canonicalParams) : undefined
  const nextUrl = page < totalPages ? buildPageUrl(page + 1, canonicalParams) : undefined

  const allPageStartups = [...featured, ...grid]


  // ─── SCHEMA BLOCKS ───
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${BASE_URL}/registry#dataset`,
    name: "UpForge Global Startup Registry",
    alternateName: ["UpForge Registry", "Global Startup Database", "UFRN Registry"],
    description: `Open, verified, independent database of ${total.toLocaleString()}+ startups worldwide.`,
    url: `${BASE_URL}/registry`,
    keywords: ["startups", "founders", "startup database", "UFRN", "startup registry"],
    temporalCoverage: "2010/..",
    creator: { "@type": "Organization", "@id": `${BASE_URL}/#organization`, name: "UpForge", url: BASE_URL },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonicalUrl}#itemlist`,
    name: `Verified Startups — Page ${page}`,
    numberOfItems: allPageStartups.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: allPageStartups.map((s, idx) => ({
      "@type": "ListItem",
      position: baseNum + idx + 1,
      name: s.name,
      url: `https://www.upforge.in/startup/${s.slug}`,
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "UpForge", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Global Registry", item: `${BASE_URL}/registry` },
      ...(cat ? [{ "@type": "ListItem", position: 3, name: cat, item: `${BASE_URL}/registry?sector=${encodeURIComponent(cat)}` }] : []),
      ...(page > 1 ? [{ "@type": "ListItem", position: cat ? 4 : 3, name: `Page ${page}`, item: canonicalUrl }] : []),
    ],
  }

  const allSchemas = [datasetSchema, itemListSchema, breadcrumbSchema]

  return (
    <>
      <Navbar />
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {prevUrl && <link rel="prev" href={prevUrl} />}
      {nextUrl && <link rel="next" href={nextUrl} />}

      <div className="min-h-[100vh] bg-background text-foreground font-serif flex flex-col relative overflow-hidden">
        <div className="flex-1 relative z-10 w-full flex flex-col">

          {/* ══════════════════════════════════════
              HEADER
          ══════════════════════════════════════ */}
          <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 w-full mt-5 pb-6 flex flex-col items-center text-center">
            <h1
              className="mast-h1 text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Global Startup Registry
            </h1>
          </section>

          {/* ── Trending Sectors Tabs ── */}
          <nav
            className="flex overflow-x-auto border-b-[1.5px] border-foreground bg-muted/40 px-6 items-center max-w-[1300px] mx-auto w-full"
            aria-label="Trending sectors"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="flex items-center gap-1 text-[9px] text-[#C59A2E] uppercase tracking-[0.2em] py-3 pr-3 shrink-0 font-mono">
              <TrendingUp size={10} />
              Trending
            </span>
            <Link
              href="/registry"
              className={`shrink-0 px-4 py-3 font-mono text-[9px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-2 ${
                (!cat && !q && !country)
                  ? "border-[#C59A2E] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </Link>
            {TRENDING_SECTORS.slice(0, 10).map(c => (
              <Link
                key={c}
                href={`/registry?sector=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ""}${country ? `&country=${encodeURIComponent(country)}` : ""}`}
                className={`shrink-0 px-4 py-3 font-mono text-[9px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-2 ${
                  cat === c
                    ? "border-[#C59A2E] text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </Link>
            ))}
          </nav>

          {/* ── Toolbar ── */}
          <div className="sticky top-0 z-30 bg-background border-b-[1.5px] border-foreground shadow-sm w-full" id="rg-toolbar">
            <div className="max-w-[1300px] mx-auto px-6 py-3">
              {/* Search row WITH AUTOCOMPLETE */}
              <div className="relative mb-3" id="search-wrapper">
                <form
                  action="/registry"
                  method="GET"
                  className="relative flex items-center h-11 bg-background border-[1.5px] border-foreground focus-within:ring-2 focus-within:ring-[#C59A2E] focus-within:border-[#C59A2E] transition-all"
                  id="search-form"
                >
                  {year    && <input type="hidden" name="year"    value={year} />}
                  {cat     && <input type="hidden" name="sector"  value={cat} />}
                  {country && <input type="hidden" name="country" value={country} />}
                  {sort && sort !== "name" && <input type="hidden" name="sort" value={sort} />}
                  <span className="px-4 text-foreground flex items-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </span>
                  <input
                    type="search" name="q" defaultValue={q}
                    id="search-input"
                    className="flex-1 bg-transparent border-none text-sm text-foreground font-serif italic focus:outline-none min-w-0"
                    placeholder="Search startups, founders, sectors, cities…"
                    aria-label="Search global registry"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="h-full px-5 bg-foreground hover:bg-[#C59A2E] text-background font-mono text-[10px] font-bold uppercase tracking-[0.15em] shrink-0 transition-colors"
                  >
                    Search
                  </button>
                </form>

              </div>

              {/* Filter + Sort row */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 h-8 px-4 bg-muted border border-border font-mono text-[9px] font-bold uppercase tracking-[0.15em] transition-all shrink-0 ${
                    activeFilterCount > 0
                      ? "border-[#C59A2E] text-[#C59A2E]"
                      : "text-foreground hover:border-foreground"
                  }`}
                  id="filter-toggle-btn"
                  aria-expanded="false"
                  aria-controls="filter-panel"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/>
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-[#C59A2E] text-background rounded-full px-2 py-0.5 text-[9px]">{activeFilterCount}</span>
                  )}
                  <span className="shrink-0 transition-transform duration-200" id="filter-chevron">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,3 5,7 8,3"/>
                    </svg>
                  </span>
                </button>

                {/* Sort */}
                <div className="flex items-center gap-4 ml-auto overflow-x-auto py-1 shrink-0" style={{ scrollbarWidth: "none" }}>
                  <span className="w-px h-4 bg-border shrink-0 hidden sm:block" />
                  {[
                    { label: "A–Z",     val: "name"   },
                    { label: "Newest",  val: "newest" },
                    { label: "Founded", val: "year"   },
                  ].map(s => (
                    <Link
                      key={s.val}
                      href={qs({ sort: s.val, page: undefined })}
                      className={`font-mono text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-colors shrink-0 ${
                        sort === s.val ? "text-[#C59A2E]" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                  {isFiltered && (
                    <Link href="/registry" className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#C59A2E] ml-2 shrink-0 hover:underline">
                      ✕ Clear
                    </Link>
                  )}
                </div>
              </div>

              {/* Filter panel */}
              <div
                className="filter-panel-wrap overflow-hidden max-h-0 opacity-0 transition-all duration-300 pointer-events-none mt-0"
                id="filter-panel"
                role="region"
                aria-label="Filters"
              >
                <div className="bg-muted border border-border p-4 flex flex-wrap gap-4 items-end mt-3">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                    <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground" htmlFor="rg-year-sel">Year</label>
                    <select className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E] appearance-none" id="rg-year-sel">
                      <option value="">Any Year</option>
                      {years.map(yr => (
                        <option key={yr} value={String(yr)} selected={year === String(yr)}>{yr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                    <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground" htmlFor="rg-cat-sel">Sector</label>
                    <select className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E] appearance-none" id="rg-cat-sel">
                      <option value="">All Sectors</option>
                      {cats.map(c => (
                        <option key={c} value={c} selected={cat === c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
                    <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground" htmlFor="rg-country-sel">Country</label>
                    <select className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E] appearance-none" id="rg-country-sel">
                      <option value="">All Countries</option>
                      {countries.map(ct => (
                        <option key={ct.code} value={ct.code} selected={country === ct.code}>
                          {ct.name} ({ct.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {isFiltered && (
                    <Link href="/registry" className="h-9 bg-[#C59A2E] text-background flex items-center px-4 font-mono text-[9px] font-bold uppercase tracking-[0.15em] shrink-0 hover:bg-[#A8821E]">
                      ✕ Clear All
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Results bar ── */}
          <div className="bg-muted/50 px-6 py-3 flex items-center border-b border-border w-full">
            <div className="max-w-[1300px] mx-auto w-full flex items-center gap-3">
              <span className="font-serif text-[14px] font-bold text-foreground italic">
                {q ? `"${q}"` : cat ? cat : country ? (countries.find(c => c.code === country)?.name ?? country) : year ? `Est. ${year}` : "All Startups"}
              </span>
              <span className="text-xs text-muted-foreground">— {total.toLocaleString()} profiles</span>
              <span className="flex-1 h-px bg-border hidden sm:block" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                Page {page} of {totalPages || 1}
              </span>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="max-w-[1300px] mx-auto px-6 py-8 w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 items-start">

              <div className="space-y-10">

                {/* ══════════════════════════════════════
                    FEATURED — Forbes Cover style
                ══════════════════════════════════════ */}
                {featured.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">Featured</span>
                      <div className="flex-1 h-px bg-foreground" />
                    </div>

                    {/* Cover story — first featured, large horizontal layout */}
                    {featured[0] && (
                      <Link
                        href={`/startup/${featured[0].slug}`}
                        className="group flex flex-col md:flex-row gap-0 border-b-[2px] border-foreground pb-8 mb-8"
                      >
                        {/* Text left */}
                        <div className="flex-1 flex flex-col justify-between pr-0 md:pr-8 order-2 md:order-1 pt-5 md:pt-0">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C59A2E]">
                                {featured[0].category || "Cover Story"}
                              </span>
                              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                                Featured Profile
                              </span>
                            </div>
                            <h2
                              className="text-3xl md:text-4xl font-bold leading-[1.08] text-foreground mb-4 group-hover:text-[#C59A2E] transition-colors"
                              style={{ fontFamily: "'Georgia', serif" }}
                            >
                              {featured[0].name}: An Inside Look At Their Trajectory.
                            </h2>
                            <p className="font-serif italic text-base md:text-lg text-foreground/80 leading-relaxed mb-5">
                              {featured[0].description
                                ? featured[0].description.split('.')[0] + '.'
                                : "A comprehensive analysis of verified market positioning and strategic execution."}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-foreground">
                              {featured[0].country_code} · Est. {featured[0].founded_year}
                            </span>
                            {featured[0].ufrn && (
                              <>
                                <span className="w-px h-3 bg-border" />
                                <span className="font-mono text-[9px] text-[#C59A2E] uppercase tracking-widest">
                                  UFRN Verified
                                </span>
                              </>
                            )}
                            <span className="ml-auto font-mono text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1 text-[#C59A2E] group-hover:gap-2 transition-all">
                              Read Profile <ArrowUpRight size={10} />
                            </span>
                          </div>
                        </div>

                        {/* Image right */}
                        <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 order-1 md:order-2">
                          <div className="w-full aspect-[4/3] bg-muted overflow-hidden relative">
                            {featured[0].logo_url ? (
                              <img
                                src={featured[0].logo_url}
                                alt={featured[0].name}
                                loading="eager"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center font-serif text-6xl font-bold text-muted-foreground/20">
                                {featured[0].name.charAt(0)}
                              </div>
                            )}
                            <div className="absolute top-3 left-3 bg-red-700 px-3 py-1 font-mono font-black text-[8px] tracking-[0.2em] text-white uppercase">
                              {featured[0].category || "Featured"}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Secondary featured — smaller horizontal cards */}
                    {featured.slice(1).length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-foreground border-b-[2px] border-foreground pb-8 mb-2">
                        {featured.slice(1, 3).map((s, fi) => (
                          <Link
                            key={s.id}
                            href={`/startup/${s.slug}`}
                            className="group flex flex-row items-start gap-4 py-4 md:py-0 md:px-6 first:md:pl-0 last:md:pr-0 hover:opacity-80 transition-opacity"
                          >
                            {/* Text left */}
                            <div className="flex-1 flex flex-col gap-1.5">
                              <span className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#C59A2E]">
                                {s.category || "Startup"}
                              </span>
                              <h3
                                className="font-bold text-[18px] leading-tight text-foreground group-hover:text-[#C59A2E] transition-colors"
                                style={{ fontFamily: "'Georgia', serif" }}
                              >
                                {s.name}
                              </h3>
                              <p className="font-serif italic text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                                {s.description?.slice(0, 80) ?? "Verified entity on the global registry."}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                                  {s.country_code} · {s.founded_year}
                                </span>
                                {s.ufrn && (
                                  <span className="font-mono text-[9px] text-[#C59A2E] uppercase">· UFRN ✓</span>
                                )}
                              </div>
                            </div>

                            {/* Image right */}
                            {s.logo_url && (
                              <div className="w-16 h-16 shrink-0 bg-muted overflow-hidden">
                                <img
                                  src={s.logo_url}
                                  alt={s.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                />
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* ══════════════════════════════════════
                    THE INDEX — Forbes sidebar-list style
                ══════════════════════════════════════ */}
                {grid.length > 0 ? (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">The Index</span>
                      <div className="flex-1 h-px bg-foreground" />
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                        {baseNum + 1}–{Math.min(baseNum + grid.length, total)} of {total.toLocaleString()}
                      </span>
                    </div>

                    <div className="divide-y divide-border">
                      {grid.map((s, idx) => {
                        const rank = baseNum + idx + 1
                        const verifiedDate = s.created_at
                          ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
                          : "EST. 2026"

                        return (
                          <Link
                            key={s.id}
                            href={`/startup/${s.slug}`}
                            className="group flex flex-row items-start gap-4 py-5 hover:bg-muted/30 transition-colors -mx-2 px-2"
                          >
                            {/* Rank number */}
                            <div className="font-mono text-[11px] font-bold text-[#C59A2E]/50 pt-0.5 w-5 text-right shrink-0 select-none">
                              {rank}
                            </div>

                            {/* Text — left */}
                            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#C59A2E]">
                                  {s.category || "Startup"}
                                </span>
                                {s.ufrn && (
                                  <span className="font-mono text-[8px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-1.5 py-0.5">
                                    UFRN Assured
                                  </span>
                                )}
                              </div>

                              <h3
                                className="font-bold text-[20px] md:text-[22px] leading-tight text-foreground group-hover:text-[#C59A2E] transition-colors"
                                style={{ fontFamily: "'Georgia', serif" }}
                              >
                                {s.name}
                              </h3>

                              <p className="font-serif italic text-[13px] text-foreground/75 leading-relaxed line-clamp-2">
                                {s.description || "Verified entity on the UpForge Global Registry."}
                              </p>

                              <div className="flex items-center gap-3 pt-2 border-t border-border/50 mt-1">
                                <span className="font-mono text-[8px] font-bold text-foreground uppercase tracking-widest">
                                  HQ: {s.city || "Global"}
                                </span>
                                <span className="w-px h-2.5 bg-border" />
                                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                                  {s.country_code}
                                </span>
                                <span className="w-px h-2.5 bg-border" />
                                <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                                  VERIFIED {verifiedDate}
                                </span>
                                {s.founded_year && (
                                  <>
                                    <span className="w-px h-2.5 bg-border" />
                                    <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">
                                      Est. {s.founded_year}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Image — right */}
                            <div className="shrink-0 w-[72px] h-[72px] md:w-[88px] md:h-[88px] bg-muted overflow-hidden flex items-center justify-center">
                              {s.logo_url ? (
                                <img
                                  src={s.logo_url}
                                  alt={s.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                />
                              ) : (
                                <span className="font-serif font-bold text-2xl text-muted-foreground/40 select-none">
                                  {s.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                ) : (
                  <div className="text-center py-16 px-8 border-t-[2px] border-foreground">
                    <p className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "'Georgia', serif" }}>No startups found</p>
                    <p className="text-sm text-muted-foreground font-serif italic mb-5">
                      {q ? `Nothing matched "${q}".` : "Try adjusting your filters."}
                    </p>
                    <Link href="/registry" className="inline-block bg-foreground text-background px-6 py-2.5 text-[10px] font-mono font-bold tracking-[0.15em] uppercase hover:bg-[#C59A2E] transition-colors">
                      Clear filters
                    </Link>
                  </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <nav
                    className="flex items-center justify-center gap-2 mt-8 border-t-[1.5px] border-foreground pt-6"
                    aria-label="Registry pagination"
                  >
                    <Link
                      href={pgHref(page - 1)}
                      className={`py-2 px-4 text-[10px] font-bold tracking-[0.1em] uppercase border transition-colors font-mono ${
                        page === 1
                          ? "opacity-35 pointer-events-none border-border text-muted-foreground bg-background"
                          : "border-border text-foreground hover:border-[#C59A2E] hover:text-[#C59A2E] bg-background"
                      }`}
                      aria-disabled={page === 1}
                      rel={page > 1 ? "prev" : undefined}
                    >
                      Prev
                    </Link>
                    {pgNums.map(p => (
                      <Link
                        key={p}
                        href={pgHref(p)}
                        className={`w-9 h-9 flex items-center justify-center text-[11px] font-bold border transition-colors font-mono ${
                          p === page
                            ? "bg-foreground text-background border-foreground"
                            : "border-border text-foreground hover:border-[#C59A2E] hover:text-[#C59A2E] bg-background"
                        }`}
                        aria-current={p === page ? "page" : undefined}
                      >
                        {p}
                      </Link>
                    ))}
                    <Link
                      href={pgHref(page + 1)}
                      className={`py-2 px-4 text-[10px] font-bold tracking-[0.1em] uppercase border transition-colors font-mono ${
                        page === totalPages
                          ? "opacity-35 pointer-events-none border-border text-muted-foreground bg-background"
                          : "border-border text-foreground hover:border-[#C59A2E] hover:text-[#C59A2E] bg-background"
                      }`}
                      aria-disabled={page === totalPages}
                      rel={page < totalPages ? "next" : undefined}
                    >
                      Next
                    </Link>
                  </nav>
                )}
              </div>

              {/* ══════════════════════════════════════
                  SIDEBAR — Forbes sidebar style
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

                {/* Editor's Picks — Forbes sidebar style */}
                {grid.length > 0 && (
                  <div className="border-t-[2px] border-foreground pt-5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-[#C59A2E]">
                        Editor's Picks
                      </h3>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase">Live Index</span>
                    </div>
                    <div className="flex flex-col divide-y divide-border">
                      {grid.slice(0, 5).map((s, i) => (
                        <Link
                          key={s.id}
                          href={`/startup/${s.slug}`}
                          className="group flex flex-row items-start justify-between gap-3 py-4 last:pb-0"
                        >
                          <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[8px] font-bold text-foreground bg-muted px-1.5 py-0.5 uppercase tracking-widest shrink-0">
                                {s.category || "Verified"}
                              </span>
                              <span className="font-serif italic text-muted-foreground/50 text-[10px] ml-auto shrink-0">
                                No. {i + 1}
                              </span>
                            </div>
                            <h4
                              className="font-bold text-[16px] leading-tight text-foreground group-hover:text-[#C59A2E] transition-colors"
                              style={{ fontFamily: "'Georgia', serif" }}
                            >
                              {s.name}
                            </h4>
                            <p className="font-serif text-[11px] text-foreground/70 leading-snug line-clamp-2">
                              {s.description || "A verified entry in the global registry."}
                            </p>
                          </div>
                          {s.logo_url && (
                            <div className="w-12 h-12 shrink-0 bg-muted overflow-hidden mt-0.5">
                              <img
                                src={s.logo_url}
                                alt=""
                                className="w-full h-full object-cover transition-transform group-hover:scale-[1.05]"
                              />
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Sectors (Sidebar) */}
                <div className="border-t-[2px] border-foreground pt-5">
                  <div className="flex items-center gap-1.5 mb-4">
                    <TrendingUp size={12} className="text-[#C59A2E]" />
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground">Trending Sectors</p>
                  </div>
                  <ul className="flex flex-col gap-0 m-0 p-0 list-none divide-y divide-border">
                    {TRENDING_SECTORS.slice(0, 8).map(c => (
                      <li key={c}>
                        <Link
                          href={`/registry?sector=${encodeURIComponent(c)}`}
                          className="flex items-center justify-between py-2.5 text-sm text-foreground font-serif italic hover:text-[#C59A2E] transition-colors"
                        >
                          <span>{c}</span>
                          <ArrowRight size={11} className="opacity-40 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Browse by Country */}
                {countries.length > 0 && (
                  <div className="border-t-[2px] border-foreground pt-5">
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-foreground mb-4">Browse by Country</p>
                    <ul className="flex flex-col gap-0 m-0 p-0 list-none divide-y divide-border">
                      {countries.slice(0, 8).map(ct => (
                        <li key={ct.code}>
                          <Link
                            href={`/registry?country=${encodeURIComponent(ct.code)}`}
                            className="flex items-center justify-between py-2.5 text-sm text-foreground font-serif italic hover:text-[#C59A2E] transition-colors"
                          >
                            <span>{ct.name}</span>
                            <span className="font-mono text-[9px] font-bold text-[#C59A2E]">{ct.code}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                { label: "Global Registry",         sub: "Full verified database",   href: "/registry" },
                { label: "Indian Startup Founders",  sub: "Founder Chronicle 2026",  href: "/"         },
                { label: "The Forge Blog",           sub: "Startup intelligence",     href: "/blog"     },
                { label: "Submit Your Startup",      sub: "Get listed + UFRN free",  href: "/submit"   },
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

      {/* ── Client-side JS (with autocomplete) ── */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function () {
          // Filter toggle
          var btn     = document.getElementById('filter-toggle-btn');
          var panel   = document.getElementById('filter-panel');
          var chevron = document.getElementById('filter-chevron');

          if (btn && panel) {
            var hasActive = ${activeFilterCount > 0 ? "true" : "false"};

            function openPanel() {
              panel.classList.remove('max-h-0','opacity-0','pointer-events-none','mt-0');
              panel.classList.add('max-h-[400px]','opacity-100','pointer-events-auto');
              btn.setAttribute('aria-expanded','true');
              if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
            function closePanel() {
              panel.classList.add('max-h-0','opacity-0','pointer-events-none','mt-0');
              panel.classList.remove('max-h-[400px]','opacity-100','pointer-events-auto');
              btn.setAttribute('aria-expanded','false');
              if (chevron && !hasActive) chevron.style.transform = '';
            }

            if (hasActive) openPanel();
            btn.addEventListener('click', function () {
              panel.classList.contains('max-h-0') ? openPanel() : closePanel();
            });
          }

          function buildUrl(params) {
            var p = new URLSearchParams();
            if (params.q)       p.set('q',       params.q);
            if (params.year)    p.set('year',    params.year);
            if (params.sector)  p.set('sector',  params.sector);
            if (params.country) p.set('country', params.country);
            if (params.sort && params.sort !== 'name') p.set('sort', params.sort);
            var s = p.toString();
            return '/registry' + (s ? '?' + s : '');
          }

          function getCurrentParams() {
            var u = new URLSearchParams(window.location.search);
            return {
              q:       u.get('q')       || '',
              year:    u.get('year')    || '',
              sector:  u.get('sector')  || '',
              country: u.get('country') || '',
              sort:    u.get('sort')    || 'name',
            };
          }

          var yearSel    = document.getElementById('rg-year-sel');
          var catSel     = document.getElementById('rg-cat-sel');
          var countrySel = document.getElementById('rg-country-sel');

          if (yearSel)    yearSel.addEventListener('change',    function () { var c = getCurrentParams(); c.year    = this.value; window.location.href = buildUrl(c); });
          if (catSel)     catSel.addEventListener('change',     function () { var c = getCurrentParams(); c.sector  = this.value; window.location.href = buildUrl(c); });
          if (countrySel) countrySel.addEventListener('change', function () { var c = getCurrentParams(); c.country = this.value; window.location.href = buildUrl(c); });

          var searchForm = document.getElementById('search-form');
          if (searchForm) searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var c = getCurrentParams();
            c.q = this.querySelector('input[name="q"]').value;
            window.location.href = buildUrl(c);
          });

          // ─── AUTOCOMPLETE FROM GOOGLE SHEETS ───
          var searchInput = document.getElementById('search-input');
          var dropdown = document.getElementById('autocomplete-dropdown');
          var debounceTimer;

          if (searchInput && dropdown) {
            searchInput.addEventListener('input', function() {
              clearTimeout(debounceTimer);
              var query = this.value.trim();
              
              if (query.length < 2) {
                dropdown.classList.add('hidden');
                return;
              }

              debounceTimer = setTimeout(function() {
                fetch('/api/registry/suggestions?q=' + encodeURIComponent(query))
                  .then(res => res.json())
                  .then(data => {
                    if (data.suggestions && data.suggestions.length > 0) {
                      dropdown.innerHTML = '<div class="p-2">' + 
                        data.suggestions.map(s => 
                          '<button type="button" class="w-full text-left px-3 py-2 hover:bg-muted text-sm font-serif italic transition-colors border-b border-border last:border-0" data-suggestion="' + s.replace(/"/g, '&quot;') + '">' + s + '</button>'
                        ).join('') + 
                        '</div>';
                      dropdown.classList.remove('hidden');
                      
                      dropdown.querySelectorAll('button').forEach(btn => {
                        btn.addEventListener('click', function() {
                          searchInput.value = this.dataset.suggestion;
                          dropdown.classList.add('hidden');
                          searchForm.dispatchEvent(new Event('submit'));
                        });
                      });
                    } else {
                      dropdown.classList.add('hidden');
                    }
                  })
                  .catch(() => dropdown.classList.add('hidden'));
              }, 300);
            });

            document.addEventListener('click', function(e) {
              if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
              }
            });

            searchInput.addEventListener('focus', function() {
              if (this.value.trim().length >= 2) {
                dropdown.classList.remove('hidden');
              }
            });

            searchInput.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                dropdown.classList.add('hidden');
              }
            });
          }
        })();
      `}} />
    </>
  )
}

// app/compare/compare-client.tsx
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Search, X, ChevronDown, Sparkles, SlidersHorizontal, Scale, Flame } from "lucide-react"

interface Comparison {
  name: string
  slug: string
  category: string
  description: string
  item1: string
  item2: string
  image: string
  color: string
  readTime: string
  verdict: string
  featured?: boolean
  trending?: boolean
}

interface CompareClientProps {
  comparisons: Comparison[]
  categories: string[]
}

const ITEMS_PER_PAGE = 12

// Image component with error fallback
function CardImage({ src, alt, color, item1, item2 }: { src: string; alt: string; color: string; item1: string; item2: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden"
        style={{ backgroundColor: color + "12" }}
      >
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow-sm"
          style={{ backgroundColor: color + "25", color: color }}
        >
          VS
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      onError={() => setError(true)}
    />
  )
}

export function CompareClient({ comparisons, categories }: CompareClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("trending")
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  const filteredComparisons = useMemo(() => {
    let results = comparisons

    if (selectedCategory !== "All") {
      results = results.filter(comp => comp.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(
        comp =>
          comp.name.toLowerCase().includes(query) ||
          comp.item1.toLowerCase().includes(query) ||
          comp.item2.toLowerCase().includes(query) ||
          comp.category.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.verdict.toLowerCase().includes(query)
      )
    }

    if (sortBy === "trending") {
      results = [...results].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    } else if (sortBy === "readTime") {
      results = [...results].sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime))
    }

    return results
  }, [comparisons, selectedCategory, searchQuery, sortBy])

  const totalPages = Math.ceil(filteredComparisons.length / ITEMS_PER_PAGE)
  const paginatedComparisons = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredComparisons.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredComparisons, currentPage])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const allCategories = ["All", ...categories]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground font-serif flex flex-col selection:bg-[#C59A2E]/20">
        <div className="flex-1 w-full flex flex-col">

          {/* HEADER */}
          <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 w-full pt-8 pb-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-muted border border-[#C59A2E]/40 mb-4">
              <Scale className="w-3.5 h-3.5 text-[#C59A2E]" />
              <span className="text-[10px] font-mono font-bold text-[#C59A2E] uppercase tracking-[0.2em]">
                INDEPENDENT TOOL ANALYSIS
              </span>
            </div>
            <h1
              className="text-3xl md:text-[46px] lg:text-[56px] font-bold leading-[1.05] text-foreground mb-3 max-w-4xl tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Global Tool & Framework Comparisons
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-serif italic leading-relaxed">
              Side-by-side analysis of developer tools, AI models, cloud platforms, and SaaS products benchmarked for performance and cost.
            </p>
          </section>

          {/* STICKY TOOLBAR */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b-[1.5px] border-foreground shadow-sm w-full">
            <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-3">
              
              {/* Search bar */}
              <div className="relative flex items-center h-13 bg-background border-[2px] border-foreground mb-3 focus-within:ring-2 focus-within:ring-[#C59A2E] focus-within:border-[#C59A2E] transition-all">
                <span className="pl-4 pr-3 text-muted-foreground flex items-center shrink-0">
                  <Search size={18} strokeWidth={2.2} />
                </span>
                <input
                  className="flex-1 bg-transparent border-none text-sm md:text-base text-foreground font-serif italic focus:outline-none min-w-0 placeholder:text-muted-foreground/60"
                  type="search"
                  placeholder="Search tool, category, or verdict (e.g. Claude, Cursor, Notion)..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button onClick={() => handleSearch("")} className="px-3 text-muted-foreground hover:text-foreground">
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
                <button className="h-full px-5 md:px-8 bg-foreground hover:bg-[#C59A2E] text-background font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] shrink-0 transition-colors">
                  Search
                </button>
              </div>

              {/* Category tabs + Sort + Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto flex-1 pb-1 sm:pb-0" style={{ scrollbarWidth: "none" }}>
                  {allCategories.map((cat) => {
                    const count = cat === "All" ? comparisons.length : comparisons.filter(c => c.category === cat).length
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`shrink-0 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-2 ${
                          selectedCategory === cat
                            ? "border-[#C59A2E] text-foreground font-extrabold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 bg-muted border border-border font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-foreground hover:border-foreground transition-all shrink-0"
                  >
                    <SlidersHorizontal size={11} />
                    <span className="hidden sm:inline">Filters</span>
                    <ChevronDown size={10} strokeWidth={2} className={`transition-transform ${showFilterPanel ? "rotate-180" : ""}`} />
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 px-2 bg-muted border border-border font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-foreground focus:outline-none appearance-none cursor-pointer shrink-0"
                  >
                    <option value="trending">Trending</option>
                    <option value="readTime">Quick Read</option>
                  </select>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilterPanel && (
                <div className="bg-muted border border-border p-4 flex flex-wrap gap-4 items-end mt-3 rounded-sm">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                    <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                    <select
                      className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E]"
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                    <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Sort By</label>
                    <select
                      className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E]"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="trending">Trending First</option>
                      <option value="readTime">Shortest Read Time</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results bar */}
          <div className="bg-muted/40 px-4 md:px-6 py-2.5 flex items-center border-b border-border w-full">
            <div className="max-w-[1300px] mx-auto w-full flex items-center gap-3">
              <span className="font-serif text-[14px] font-bold text-foreground italic">
                {selectedCategory === "All" ? "All Product Comparisons" : selectedCategory}
              </span>
              <span className="text-xs text-muted-foreground">— {filteredComparisons.length} analyses</span>
              <span className="flex-1 h-px bg-border hidden sm:block" />
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">UpForge · 2026</span>
            </div>
          </div>

          {/* CARDS LIST */}
          <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-8 w-full flex-1">
            {paginatedComparisons.length > 0 ? (
              <div className="divide-y divide-border border-b border-border">
                {paginatedComparisons.map((comp, idx) => (
                  <Link
                    key={comp.slug}
                    href={comp.slug}
                    className="group flex items-start gap-4 md:gap-6 py-6 hover:bg-muted/40 transition-colors px-3 -mx-3 rounded-sm"
                  >
                    {/* Number */}
                    <span className="font-mono text-[11px] font-bold text-[#C59A2E]/60 pt-1 w-6 text-right shrink-0 select-none">
                      {String(((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1).padStart(2, '0')}
                    </span>

                    {/* Image with fallback */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-muted border border-border overflow-hidden flex items-center justify-center relative shadow-sm">
                      <CardImage 
                        src={comp.image} 
                        alt={`${comp.item1} vs ${comp.item2}`} 
                        color={comp.color}
                        item1={comp.item1}
                        item2={comp.item2}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#C59A2E] bg-[#C59A2E]/10 px-2 py-0.5 border border-[#C59A2E]/20">
                          {comp.category}
                        </span>
                        {comp.trending && (
                          <span className="font-mono text-[8px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 border border-red-500/20">
                            <Flame className="w-2.5 h-2.5 fill-red-600" /> Trending
                          </span>
                        )}
                      </div>

                      <h3
                        className="font-bold text-[18px] sm:text-[21px] leading-tight text-foreground group-hover:text-[#C59A2E] transition-colors"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {comp.item1} vs {comp.item2}
                      </h3>

                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 font-serif">
                        {comp.description}
                      </p>

                      <div className="flex items-center gap-3 pt-2 mt-1 border-t border-border/50">
                        <span className="font-mono text-[9px] font-bold text-foreground uppercase tracking-wider">{comp.readTime} read</span>
                        <span className="w-px h-2.5 bg-border" />
                        <span className="font-mono text-[9px] text-[#C59A2E] uppercase font-bold tracking-wider">
                          Verdict: {comp.verdict}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center self-center text-[#C59A2E]/30 group-hover:text-[#C59A2E] group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border bg-muted/20">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Georgia', serif" }}>No comparisons found</h3>
                <p className="text-muted-foreground mb-6 text-sm">Try adjusting your search terms or selecting a different category.</p>
                <button
                  onClick={() => { handleCategoryChange("All"); handleSearch("") }}
                  className="px-6 py-2.5 bg-foreground hover:bg-[#C59A2E] text-background font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] bg-background border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1
                    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[36px] h-9 font-mono text-xs font-bold transition-all ${
                            page === currentPage
                              ? "bg-foreground text-background"
                              : "bg-background border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    }
                    if (page === 2 && currentPage > 4) return <span key="d1" className="px-1 text-muted-foreground font-mono text-xs">...</span>
                    if (page === totalPages - 1 && currentPage < totalPages - 3) return <span key="d2" className="px-1 text-muted-foreground font-mono text-xs">...</span>
                    return null
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] bg-background border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Footer links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-12 border-t-[1.5px] border-foreground divide-y lg:divide-y-0 lg:divide-x divide-foreground">
              {[
                { label: "Global Registry", sub: "Full verified database", href: "/registry" },
                { label: "The Forge Blog", sub: "Startup intelligence", href: "/blog" },
                { label: "Tool Comparisons", sub: "Side-by-side analysis", href: "/compare" },
                { label: "Submit Your Startup", sub: "Get listed + UFRN free", href: "/submit" },
              ].map(lnk => (
                <Link key={lnk.href} href={lnk.href} className="p-5 hover:bg-muted transition-colors group flex flex-col justify-center h-full">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-foreground mb-1 group-hover:text-[#C59A2E] transition-colors">{lnk.label}</span>
                  <span className="text-[11px] text-muted-foreground font-serif italic">{lnk.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


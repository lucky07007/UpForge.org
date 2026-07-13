// app/compare/compare-client.tsx
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, Search, X, ChevronDown } from "lucide-react"
import { useState as useImageState } from "react"

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
function CardImage({ src, alt, color }: { src: string; alt: string; color: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: color + "15" }}
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: color + "30", color: color }}
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
    <div className="min-h-[100vh] bg-background text-foreground font-serif flex flex-col">
      <div className="flex-1 w-full flex flex-col">

        {/* HEADER */}
        <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 w-full mt-5 pb-6 flex flex-col items-center text-center">
          <h1
            className="text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Global Tools Comparison
          </h1>
        </section>

        {/* STICKY TOOLBAR */}
        <div className="sticky top-0 z-30 bg-background border-b-[1.5px] border-foreground shadow-sm w-full">
          <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-3">
            
            {/* Search bar */}
            <div className="relative flex items-center h-14 bg-background border-[2px] border-foreground mb-3 focus-within:ring-2 focus-within:ring-[#C59A2E] focus-within:border-[#C59A2E] transition-all">
              <span className="pl-5 pr-3 text-foreground flex items-center shrink-0">
                <Search size={18} strokeWidth={2.5} />
              </span>
              <input
                className="flex-1 bg-transparent border-none text-base text-foreground font-serif italic focus:outline-none min-w-0 placeholder:text-muted-foreground/60"
                type="search"
                placeholder="Search tool, category, or verdict..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button onClick={() => handleSearch("")} className="px-4 text-muted-foreground hover:text-foreground">
                  <X size={18} strokeWidth={2} />
                </button>
              )}
              <button className="h-full px-6 md:px-8 bg-foreground hover:bg-[#C59A2E] text-background font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] shrink-0 transition-colors">
                Search
              </button>
            </div>

            {/* Category tabs + Sort + Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
                {allCategories.map((cat) => {
                  const count = cat === "All" ? comparisons.length : comparisons.filter(c => c.category === cat).length
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`shrink-0 px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.15em] uppercase transition-colors whitespace-nowrap border-b-2 ${
                        selectedCategory === cat
                          ? "border-[#C59A2E] text-foreground"
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
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2" y1="4" x2="14" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/></svg>
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown size={10} strokeWidth={2} className={`transition-transform ${showFilterPanel ? "rotate-180" : ""}`} />
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 px-2 bg-muted border border-border font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-foreground focus:outline-none appearance-none cursor-pointer shrink-0"
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="readTime">Quick Read</option>
                </select>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="bg-muted border border-border p-4 flex flex-wrap gap-4 items-end mt-3">
                <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                  <label className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Category</label>
                  <select
                    className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E] appearance-none"
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
                    className="h-9 bg-background border border-border text-xs text-foreground px-3 focus:outline-none focus:border-[#C59A2E] appearance-none"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="trending">Trending</option>
                    <option value="newest">Newest</option>
                    <option value="readTime">Quick Read</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results bar */}
        <div className="bg-muted/50 px-4 md:px-6 py-2.5 flex items-center border-b border-border w-full">
          <div className="max-w-[1300px] mx-auto w-full flex items-center gap-3">
            <span className="font-serif text-[14px] font-bold text-foreground italic">
              {selectedCategory === "All" ? "All Comparisons" : selectedCategory}
            </span>
            <span className="text-xs text-muted-foreground">— {filteredComparisons.length} analyses</span>
            <span className="flex-1 h-px bg-border hidden sm:block" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">UpForge · 2026</span>
          </div>
        </div>

        {/* CARDS */}
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 w-full">
          {paginatedComparisons.length > 0 ? (
            <div className="divide-y divide-border">
              {paginatedComparisons.map((comp, idx) => (
                <Link
                  key={comp.slug}
                  href={comp.slug}
                  className="group flex items-start gap-4 py-5 hover:bg-muted/30 transition-colors -mx-2 px-2"
                >
                  {/* Number */}
                  <span className="font-mono text-[11px] font-bold text-[#C59A2E]/50 pt-1 w-5 text-right shrink-0 select-none">
                    {((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}
                  </span>

                  {/* Image with fallback */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-muted overflow-hidden flex items-center justify-center relative">
                    <CardImage 
                      src={comp.image} 
                      alt={`${comp.item1} vs ${comp.item2}`} 
                      color={comp.color} 
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#C59A2E]">
                        {comp.category}
                      </span>
                      {comp.trending && (
                        <span className="font-mono text-[8px] font-bold text-red-700 uppercase tracking-widest">Trending</span>
                      )}
                    </div>

                    <h3
                      className="font-bold text-[17px] sm:text-[19px] leading-tight text-foreground group-hover:text-[#C59A2E] transition-colors"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {comp.item1} vs {comp.item2}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1.5 mt-0.5 border-t border-border/40">
                      <span className="font-mono text-[8px] font-bold text-foreground uppercase tracking-widest">{comp.readTime}</span>
                      <span className="w-px h-2.5 bg-border" />
                      <span className="font-mono text-[8px] text-[#C59A2E] uppercase font-bold">{comp.verdict}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center self-center">
                    <span className="font-mono text-[18px] font-black text-[#C59A2E]/30 group-hover:text-[#C59A2E] transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Georgia', serif" }}>No comparisons found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { handleCategoryChange("All"); handleSearch("") }}
                className="px-6 py-2.5 bg-foreground hover:bg-[#C59A2E] text-background font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
              >
                Clear all filters
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-10 border-t-[1.5px] border-foreground divide-y lg:divide-y-0 lg:divide-x divide-foreground">
            {[
              { label: "Global Registry", sub: "Full verified database", href: "/registry" },
              { label: "The Forge Blog", sub: "Startup intelligence", href: "/blog" },
              { label: "Tool Comparisons", sub: "Side-by-side analysis", href: "/compare" },
              { label: "Submit Your Startup", sub: "Get listed + UFRN free", href: "/submit" },
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
  )
}

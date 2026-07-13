// app/creators/creators-client.tsx
"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import {
  ChevronDown, X, Search, MessageCircle, Filter,
  Users, TrendingUp, SortAsc, Loader2, RefreshCw,
  Instagram, Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { CreatorCardDesktop } from "@/components/creators/creator-card-desktop"
import { CreatorCardMobile } from "@/components/creators/creator-card-mobile"
import { PromotedSection } from "@/components/creators/promoted-section"
import { ApplyModal } from "@/components/creators/apply-modal"
import { CreatorProfileModal } from "@/components/creators/creator-profile-modal"
import {
  fetchCreatorsFromSheet,
  SheetCreator,
  getFollowerBucket,
} from "@/lib/sheets"

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfkkbdjrw11tStpTFpEaDKodYQmxUJZbpVlu8iaQJg-1HNaoQ/viewform?embedded=true"
const WHATSAPP_LINK = "https://wa.link/635wed"
const DESKTOP_INITIAL = 16
const MOBILE_INITIAL = 10
const LOAD_MORE = 8
const PROMOTED_KEY = "vcc_promoted_ids"
const PROMOTED_TS_KEY = "vcc_promoted_ts"
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

type SortKey = "recent" | "motivation" | "followers" | "alpha"
type FollowerFilter = "all" | "under1k" | "1k-10k" | "10k-100k" | "100k+"

// Get or compute the 5 promoted creators (persisted 24hrs in localStorage)
function getPromotedCreators(all: SheetCreator[]): SheetCreator[] {
  if (typeof window === "undefined" || all.length === 0) return []

  const now = Date.now()
  const storedTs = localStorage.getItem(PROMOTED_TS_KEY)
  const storedIds = localStorage.getItem(PROMOTED_KEY)

  if (storedTs && storedIds) {
    const ts = parseInt(storedTs, 10)
    if (now - ts < TWENTY_FOUR_HOURS) {
      const ids = JSON.parse(storedIds) as string[]
      const found = ids.map((id) => all.find((c) => c.id === id)).filter(Boolean) as SheetCreator[]
      if (found.length === 5) return found
    }
  }

  // Pick 5 random creators
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, Math.min(5, shuffled.length))
  localStorage.setItem(PROMOTED_KEY, JSON.stringify(selected.map((c) => c.id)))
  localStorage.setItem(PROMOTED_TS_KEY, now.toString())
  return selected
}

export function CreatorsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [creators, setCreators] = useState<SheetCreator[]>([])
  const [promotedCreators, setPromotedCreators] = useState<SheetCreator[]>([])
  const [selectedCreator, setSelectedCreator] = useState<SheetCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(DESKTOP_INITIAL)
  const [isMobile, setIsMobile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Auto-suggest state
  const [suggestions, setSuggestions] = useState<SheetCreator[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filters
  const [selectedNiche, setSelectedNiche] = useState("all")
  const [followerFilter, setFollowerFilter] = useState<FollowerFilter>("all")
  const [sortBy, setSortBy] = useState<SortKey>("recent")

  // Load creators from Google Sheets
  const loadCreators = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCreatorsFromSheet()
      setCreators(data)
      const promoted = getPromotedCreators(data)
      setPromotedCreators(promoted)
    } catch {
      setError("Could not load creators. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCreators()
  }, [loadCreators])

  // Profile modal action triggers & URL query string synchronization
  const handleOpenProfile = useCallback((creator: SheetCreator) => {
    setSelectedCreator(creator)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("creator", creator.instagramHandle)
      window.history.replaceState(null, "", url.toString())
    }
  }, [])

  const handleCloseProfile = useCallback(() => {
    setSelectedCreator(null)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("creator")
      window.history.replaceState(null, "", url.pathname)
    }
  }, [])

  // Check URL query parameters for creator deep link
  useEffect(() => {
    if (creators.length > 0 && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const creatorHandle = params.get("creator")
      if (creatorHandle) {
        const found = creators.find(
          (c) => c.instagramHandle.toLowerCase() === creatorHandle.toLowerCase()
        )
        if (found) {
          setSelectedCreator(found)
        }
      }
    }
  }, [creators])

  // Generate dynamic JSON-LD Structured Data Schema for Google indexing SEO
  const jsonLdData = useMemo(() => {
    if (creators.length === 0) return null
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "UpForge Verified Creator Community Registry",
      "description": "Directory of verified digital content creators, influencers, and brand collaborators listed in the official UpForge Registry.",
      "numberOfItems": creators.length,
      "itemListElement": creators.slice(0, 40).map((creator, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Person",
          "name": creator.fullName,
          "alternateName": creator.instagramHandle,
          "jobTitle": `${creator.niche} Creator`,
          "description": `${creator.fullName} (@${creator.instagramHandle}) is a verified content creator in the ${creator.niche} category on the UpForge Creator Registry.`,
          "image": creator.profilePicture || "",
          "sameAs": `https://instagram.com/${creator.instagramHandle}`
        }
      }))
    }
  }, [creators])

  // Responsive detection
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setVisibleCount(mobile ? MOBILE_INITIAL : DESKTOP_INITIAL)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Handle search input change — update suggestions
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setHighlightedIndex(-1)
    setVisibleCount(isMobile ? MOBILE_INITIAL : DESKTOP_INITIAL)
    if (value.trim().length < 1) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const q = value.toLowerCase()
    const matched = creators
      .filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.instagramHandle.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q)
      )
      .slice(0, 6)
    setSuggestions(matched)
    setShowSuggestions(matched.length > 0)
  }

  const handleSelectSuggestion = (creator: SheetCreator) => {
    setSearchQuery(creator.fullName)
    setSuggestions([])
    setShowSuggestions(false)
    setIsSearchOpen(false)
    handleOpenProfile(creator)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[highlightedIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  function highlightText(text: string, query: string) {
    if (!query.trim()) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-[#f09433]/30 text-foreground font-bold">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  // Unique niches from data
  const niches = useMemo(() => {
    const set = new Set(creators.map((c) => c.niche).filter(Boolean))
    return ["all", ...Array.from(set).sort()]
  }, [creators])

  // Promoted IDs set for quick lookup
  const promotedIds = useMemo(
    () => new Set(promotedCreators.map((c) => c.id)),
    [promotedCreators]
  )

  // Filtered + sorted creators (excluding promoted from main grid)
  const filteredCreators = useMemo(() => {
    let list = creators.filter((c) => !promotedIds.has(c.id))

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.instagramHandle.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q)
      )
    }

    // Niche filter
    if (selectedNiche !== "all") {
      list = list.filter((c) => c.niche === selectedNiche)
    }

    // Follower filter
    if (followerFilter !== "all") {
      list = list.filter((c) => getFollowerBucket(c.followerCount) === followerFilter)
    }

    // Sort
    switch (sortBy) {
      case "recent":
        list = [...list].sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime())
        break
      case "motivation":
        list = [...list].sort((a, b) => b.motivationScore - a.motivationScore)
        break
      case "followers":
        list = [...list].sort((a, b) => b.followerCount - a.followerCount)
        break
      case "alpha":
        list = [...list].sort((a, b) => a.fullName.localeCompare(b.fullName))
        break
    }

    return list
  }, [creators, searchQuery, selectedNiche, followerFilter, sortBy, promotedIds])

  const displayedCreators = filteredCreators.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCreators.length

  return (
    <div className="bg-background min-h-screen">
      {/* Inject SEO Schema */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      {/* HERO */}
      <section className="border-b border-border relative overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-pink-50/10 dark:from-slate-900 dark:to-slate-950 pointer-events-none" />
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10 md:py-16 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#e6683c] animate-pulse" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350 uppercase tracking-widest">
              Verified Creator Registry
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black leading-[1.08] mb-4 text-slate-900 dark:text-white"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            UpForge Creator{" "}
            <span className="bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] bg-clip-text text-transparent">
              Registry Community
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            The official trust index of verified digital creators. Showcasing audience reach, professional niches, and verified identity badges issued by UpForge.
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mb-8 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3.5 px-6 rounded-2xl shadow-sm">
            <div className="text-center">
              <div className="font-serif font-black text-xl md:text-2xl text-slate-850 dark:text-white">{creators.length}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total Members</div>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <div className="font-serif font-black text-xl md:text-2xl text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Verified Credentials</div>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-center">
              <div className="font-serif font-black text-xl md:text-2xl text-slate-850 dark:text-white">Daily</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Spotlight rotation</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-foreground text-background rounded-full hover:opacity-95 transition shadow"
            >
              Apply for Verification
            </button>
            <Link
              href="/contact"
              className="px-6 py-2.5 text-xs font-bold border border-border bg-background hover:bg-muted text-foreground rounded-full transition shadow-sm"
            >
              Contact Registry Board
            </Link>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Request Profile Update
            </a>
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (!isSearchOpen) setTimeout(() => inputRef.current?.focus(), 100)
              }}
              className="md:hidden p-2.5 border border-border bg-background rounded-full shadow-sm"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* PROMOTED SECTION */}
      {!isLoading && promotedCreators.length > 0 && (
        <PromotedSection 
          creators={promotedCreators} 
          onViewProfile={handleOpenProfile}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8">

        {/* SEARCH + FILTER BAR */}
        <div className="py-4 border-b border-border space-y-3">
          {/* Search with auto-suggest */}
          {(isSearchOpen || !isMobile) && (
            <div ref={searchRef} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search verified registry records by name, handle, category..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.trim() && suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800/30"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus() }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full transition"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}

              {/* Auto-suggest dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((creator, idx) => (
                    <button
                      key={creator.id}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(creator) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition border-b border-border/50 last:border-0 ${
                        idx === highlightedIndex ? "bg-muted" : "hover:bg-muted/60"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100 ring-offset-1 ring-offset-background bg-slate-50">
                        {creator.profilePicture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={creator.profilePicture}
                            alt={creator.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement
                              t.style.display = "none"
                              if (t.parentElement) t.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-[10px] font-bold">${creator.fullName.slice(0,2).toUpperCase()}</div>`
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 text-[10px] font-bold">
                            {creator.fullName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold truncate text-slate-800 dark:text-white">
                            {highlightText(creator.fullName, searchQuery)}
                          </span>
                          <svg className="w-3 h-3 text-[#0095F6] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate">
                          @{highlightText(creator.instagramHandle, searchQuery)}
                        </p>
                      </div>

                      {/* Niche */}
                      <span className="text-[9px] font-bold uppercase text-amber-700 shrink-0 hidden sm:block">
                        {creator.niche}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filter toggle */}
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition"
              >
                <Filter className="w-3 h-3" />
                Filter Category
                {(selectedNiche !== "all" || followerFilter !== "all") && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold">
                    {(selectedNiche !== "all" ? 1 : 0) + (followerFilter !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-1.5 ml-2">
                <SortAsc className="w-3 h-3 text-muted-foreground" />
                {(["recent", "motivation", "followers", "alpha"] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-full border transition ${
                      sortBy === key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white"
                        : "border-border hover:bg-muted bg-background text-slate-500"
                    }`}
                  >
                    {key === "recent" ? "Recent" : key === "motivation" ? "Score" : key === "followers" ? "Followers" : "A–Z"}
                  </button>
                ))}
              </div>
            </div>

            {/* Refresh button */}
            <button
              onClick={loadCreators}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] border border-border rounded-full hover:bg-muted transition"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-muted/20 rounded-2xl space-y-4 border border-border">
                  {/* Niche */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                      Niche / Category
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {niches.map((niche) => (
                        <button
                          key={niche}
                          onClick={() => setSelectedNiche(niche)}
                          className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition ${
                            selectedNiche === niche
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white"
                              : "border-border hover:bg-muted bg-background text-slate-500"
                          }`}
                        >
                          {niche === "all" ? "All Niches" : niche}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Followers */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3" /> Follower Reach
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["all", "under1k", "1k-10k", "10k-100k", "100k+"] as FollowerFilter[]).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFollowerFilter(f)}
                          className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition ${
                            followerFilter === f
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white"
                              : "border-border hover:bg-muted bg-background text-slate-500"
                          }`}
                        >
                          {f === "all" ? "All" : f === "under1k" ? "< 1K" : f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset */}
                  {(selectedNiche !== "all" || followerFilter !== "all") && (
                    <button
                      onClick={() => { setSelectedNiche("all"); setFollowerFilter("all") }}
                      className="text-[10px] text-[#e6683c] font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              {searchQuery || selectedNiche !== "all" || followerFilter !== "all"
                ? `${filteredCreators.length} creator${filteredCreators.length !== 1 ? "s" : ""} found`
                : `${creators.length} verified creators in the index`}
            </span>
            {promotedCreators.length > 0 && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Spotlight registry members active
              </span>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
            <p className="text-xs text-muted-foreground">Retrieving verified credentials...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={loadCreators}
              className="px-4 py-2 text-sm border border-border rounded-full hover:bg-muted transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && filteredCreators.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Search className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-xs">No matching verified creator credentials found.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedNiche("all"); setFollowerFilter("all") }}
              className="px-4 py-2 text-xs border border-border rounded-full hover:bg-muted transition font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* MOBILE VIEW (2-column card deck grid) */}
        {!isLoading && !error && isMobile && (
          <div className="grid grid-cols-2 gap-3 py-6">
            {displayedCreators.map((creator) => (
              <CreatorCardMobile
                key={creator.id}
                creator={creator}
                isPromoted={promotedIds.has(creator.id)}
                onViewProfile={handleOpenProfile}
              />
            ))}
          </div>
        )}

        {/* DESKTOP VIEW */}
        {!isLoading && !error && !isMobile && (
          <div className="grid grid-cols-4 gap-4 py-8">
            {displayedCreators.map((creator) => (
              <CreatorCardDesktop
                key={creator.id}
                creator={creator}
                isPromoted={promotedIds.has(creator.id)}
                onViewProfile={handleOpenProfile}
              />
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {!isLoading && hasMore && (
          <div className="text-center py-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + LOAD_MORE)}
              className="group inline-flex items-center gap-2 px-8 py-3 text-xs font-bold border border-slate-300 dark:border-slate-800 bg-background hover:bg-muted text-foreground rounded-full transition-all shadow-sm"
            >
              Load More Registry Records
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">
              Showing {displayedCreators.length} of {filteredCreators.length} registry entries
            </p>
          </div>
        )}

        {/* FOOTER NOTE */}
        <div className="text-center py-8 mt-8 border-t border-border/40 bg-muted/20 rounded-xl mb-4">
          <p className="text-[10px] text-muted-foreground mb-2">
            The UpForge Creator Registry is an independent database. Identity verification is conducted based on submission compliance, audience footprint, and trust rating scores.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold font-mono">
            © 2026 UpForge Global Registry · Secure ISO Credential Format
          </p>
        </div>
      </div>

      {/* APPLY MODAL */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formUrl={GOOGLE_FORM_URL}
      />

      {/* DYNAMIC PROFILE MODAL */}
      <CreatorProfileModal
        creator={selectedCreator}
        isOpen={selectedCreator !== null}
        onClose={handleCloseProfile}
      />
    </div>
  )
}

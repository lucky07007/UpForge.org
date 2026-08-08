// app/blog/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/data/blog-posts"
import { Filter, ArrowRight, BookOpen, Clock, Sparkles, ShieldCheck } from "lucide-react"
import { SITE_STATS } from "@/lib/site-stats"

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredPosts = selectedCategory === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.categorySlug === selectedCategory)

  const featuredPosts = filteredPosts.filter(p => p.featured)
  const regularPosts = filteredPosts

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground font-serif selection:bg-[#C59A2E]/20">

        {/* HERO MASTHEAD */}
        <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 pt-8 pb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-muted border border-[#C59A2E]/40 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59A2E] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-[#C59A2E] uppercase tracking-[0.2em]">
              GLOBAL ECOSYSTEM RESEARCH
            </span>
          </div>

          <h1
            className="text-3xl md:text-[48px] lg:text-[56px] font-bold leading-[1.05] mb-4 text-foreground max-w-4xl tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Startup Intelligence Journal
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-6 font-serif italic leading-relaxed">
            Data-driven analysis of the global startup ecosystem — funding trends, unicorn profiles, founder strategies, and actionable guides updated monthly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground font-mono bg-muted/60 px-5 py-2 border border-border">
            <span className="font-bold text-[#C59A2E]">{BLOG_POSTS.length} In-Depth Reports</span>
            <span className="text-border">|</span>
            <span>Updated July 2026</span>
            <span className="text-border">|</span>
            <span className="text-foreground font-semibold">100% Free Access</span>
          </div>
        </section>

        {/* CATEGORY TOOLBAR */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border shadow-sm">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold transition-all border whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground"
                }`}
              >
                All Articles ({BLOG_POSTS.length})
              </button>
              {BLOG_CATEGORIES.map(category => {
                const count = BLOG_POSTS.filter(p => p.categorySlug === category.slug).length
                return (
                  <button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold transition-all border whitespace-nowrap ${
                      selectedCategory === category.slug
                        ? "bg-foreground text-background border-foreground shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground"
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-border px-3 py-1.5 text-xs font-mono uppercase text-foreground focus:outline-none focus:border-[#C59A2E] cursor-pointer"
              >
                <option value="all">Filter: All Categories</option>
                {BLOG_CATEGORIES.map(cat => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedCategory !== "all" && (
            <div className="bg-muted/40 border-t border-border px-4 md:px-8 py-2">
              <p className="text-xs text-muted-foreground italic font-serif max-w-[1300px] mx-auto">
                Showing {filteredPosts.length} reports in &ldquo;{
                  BLOG_CATEGORIES.find(c => c.slug === selectedCategory)?.name
                }&rdquo;: {
                  BLOG_CATEGORIES.find(c => c.slug === selectedCategory)?.description
                }
              </p>
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-10 space-y-14">

          {/* FEATURED POSTS GRID */}
          {featuredPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#C59A2E]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
                  Featured Intelligence Reports
                </span>
                <div className="flex-1 h-px bg-foreground/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group border border-border bg-card hover:border-[#C59A2E] transition-all duration-300 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-md"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C59A2E]/10 to-transparent pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#C59A2E] bg-[#C59A2E]/10 px-2.5 py-1 border border-[#C59A2E]/20">
                          {post.category}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C59A2E]" /> {post.readTime}
                        </span>
                      </div>

                      <h2
                        className="text-xl md:text-2xl font-bold leading-snug mb-3 group-hover:text-[#C59A2E] transition-colors"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground font-mono">
                      <span className="uppercase text-[10px]">{post.updated ? `Updated ${post.updated}` : post.date}</span>
                      <span className="font-mono text-xs font-bold text-[#C59A2E] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Read Report <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ALL ARTICLES LIST */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-3.5 h-3.5 text-[#C59A2E]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
                {selectedCategory === "all" ? "All Ecosystem Reports" : "Category Articles"}
              </span>
              <div className="flex-1 h-px bg-foreground/20" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase">{regularPosts.length} articles</span>
            </div>

            {regularPosts.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center bg-muted/20">
                <p className="text-muted-foreground text-base font-serif italic">No articles found in this category yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {regularPosts.map((post, idx) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex items-start gap-4 md:gap-6 py-6 hover:bg-muted/40 transition-colors px-3 -mx-3 rounded-sm"
                  >
                    <span className="font-mono text-xs font-bold text-[#C59A2E]/60 pt-1 w-6 text-right shrink-0 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#C59A2E]">
                          {post.category}
                        </span>
                        <span className="text-border">•</span>
                        <span className="font-mono text-[9px] text-muted-foreground uppercase">{post.readTime} read</span>
                      </div>

                      <h2
                        className="font-bold text-lg md:text-xl leading-snug text-foreground group-hover:text-[#C59A2E] transition-colors"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {post.title}
                      </h2>

                      <p className="text-xs md:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-serif">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground font-mono uppercase">
                        <span>{post.updated ? `Updated ${post.updated}` : post.date}</span>
                        <span className="w-px h-2.5 bg-border" />
                        <span className="text-[#C59A2E] font-semibold">Verified Intelligence</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 text-[#C59A2E]/30 group-hover:text-[#C59A2E] group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* WEEKLY DISPATCH BANNER */}
          <div className="border-2 border-foreground bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between relative z-10">
              <div>
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-[#C59A2E] block mb-2">
                  Weekly Dispatch
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
                  Stay ahead of global startup moves
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                  Join founders and VCs receiving verified funding rounds, unicorn breakdowns, and tactical playbooks every Sunday. Free forever.
                </p>
              </div>
              <Link
                href="/newsletter"
                className="shrink-0 inline-flex items-center gap-2 bg-foreground hover:bg-[#C59A2E] text-background px-7 py-3.5 font-mono font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Subscribe Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* GET VERIFIED CTA */}
          <div className="border-t-2 border-foreground pt-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C59A2E]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                UFRN Credential System
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
              Get your startup independently verified
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm leading-relaxed">
              Join {SITE_STATS.trackedStartupsText} verified startups. Receive your official UFRN credential and permanent public record.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-foreground hover:bg-[#C59A2E] text-background px-8 py-3.5 font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              List Your Startup Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}


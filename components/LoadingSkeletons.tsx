// components/LoadingSkeletons.tsx
// UpForge Design System — Forbes-grade loading skeletons
// Ultra-smooth shimmer, editorial feel, zero jank

import React from "react"
import { cn } from "@/lib/utils"

// ─── Core Shimmer Primitive ───────────────────────────────────────────────────
// Single source of truth for the shimmer animation.
// All skeletons compose from this.
function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-muted/60",
        "after:absolute after:inset-0",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        "after:translate-x-[-100%] after:animate-[shimmer_1.8s_ease-in-out_infinite]",
        className
      )}
      style={style}
    />
  )
}

// ─── Global Keyframe (inject once) ───────────────────────────────────────────
// Add this to your global CSS or tailwind config:
//
// @keyframes shimmer {
//   0%   { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
//
// tailwind.config.ts → extend.keyframes & extend.animation:
//   shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } }
//   "shimmer": "shimmer 1.8s ease-in-out infinite"

// ─── Form Skeleton ────────────────────────────────────────────────────────────
export function FormSkeleton() {
  return (
    <div className="space-y-7" aria-busy="true" aria-label="Loading form…">
      {/* Label + Input */}
      {[20, 28, 16].map((labelW, i) => (
        <div key={i} className="space-y-2.5">
          <Shimmer className={`h-3 w-${labelW}`} />
          <Shimmer className="h-11 w-full rounded-md border border-border/50" />
        </div>
      ))}

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-4">
        {[16, 14].map((w, i) => (
          <div key={i} className="space-y-2.5">
            <Shimmer className={`h-3 w-${w}`} />
            <Shimmer className="h-11 w-full rounded-md border border-border/50" />
          </div>
        ))}
      </div>

      {/* Textarea */}
      <div className="space-y-2.5">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-32 w-full rounded-md border border-border/50" />
      </div>

      {/* Helper text row */}
      <div className="flex items-center gap-3">
        <Shimmer className="h-3 w-3 rounded-full" />
        <Shimmer className="h-3 w-48" />
      </div>

      {/* CTA Button */}
      <Shimmer className="h-12 w-full rounded-md" />
    </div>
  )
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────
export function CardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "group relative border-2 border-border/70 p-5 transition-colors",
        featured && "border-foreground/20"
      )}
      aria-hidden="true"
    >
      {/* Top badge row */}
      <div className="flex items-center gap-2 mb-4">
        <Shimmer className="h-5 w-16 rounded-full" />
        {featured && <Shimmer className="h-5 w-20 rounded-full" />}
      </div>

      {/* Title — two lines, second shorter */}
      <div className="space-y-2 mb-3">
        <Shimmer className="h-5 w-[82%]" />
        <Shimmer className="h-5 w-[55%]" />
      </div>

      {/* Description */}
      <div className="space-y-1.5 mb-5">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-[90%]" />
        <Shimmer className="h-3 w-[73%]" />
      </div>

      {/* Divider + meta */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <Shimmer className="h-6 w-6 rounded-full shrink-0" />
          <Shimmer className="h-3 w-20" />
        </div>
        <Shimmer className="h-3 w-14" />
      </div>
    </div>
  )
}

// ─── Registry Grid Skeleton ───────────────────────────────────────────────────
export function RegistryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading registry…"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} featured={i === 0} />
      ))}
    </div>
  )
}

// ─── Blog Card Skeleton ───────────────────────────────────────────────────────
export function BlogCardSkeleton() {
  return (
    <div className="border-2 border-border/70 p-6" aria-hidden="true">
      {/* Category chip + date */}
      <div className="flex items-center gap-3 mb-4">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-3 w-24" />
      </div>

      {/* Title */}
      <div className="space-y-2 mb-3">
        <Shimmer className="h-6 w-full" />
        <Shimmer className="h-6 w-[68%]" />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5 mb-5">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-[88%]" />
        <Shimmer className="h-3 w-[62%]" />
      </div>

      {/* Author + read time */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <Shimmer className="h-7 w-7 rounded-full shrink-0" />
        <Shimmer className="h-3 w-28" />
        <div className="ml-auto">
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

// ─── Blog Grid Skeleton ───────────────────────────────────────────────────────
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading articles…"
    >
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Featured Hero Blog Skeleton ──────────────────────────────────────────────
// For the hero / lead article slot — wider, taller, editorial layout
export function BlogHeroSkeleton() {
  return (
    <div
      className="border-2 border-border/70 p-8 md:grid md:grid-cols-5 md:gap-8"
      aria-hidden="true"
    >
      {/* Text column */}
      <div className="md:col-span-3 flex flex-col justify-between space-y-5">
        <div className="flex items-center gap-3">
          <Shimmer className="h-5 w-20 rounded-full" />
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
        <div className="space-y-3">
          <Shimmer className="h-9 w-full" />
          <Shimmer className="h-9 w-[85%]" />
          <Shimmer className="h-9 w-[60%]" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-[90%]" />
          <Shimmer className="h-4 w-[75%]" />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <Shimmer className="h-8 w-8 rounded-full shrink-0" />
          <Shimmer className="h-3 w-32" />
          <div className="ml-auto">
            <Shimmer className="h-3 w-20" />
          </div>
        </div>
      </div>
      {/* Image placeholder column */}
      <div className="hidden md:block md:col-span-2 mt-4 md:mt-0">
        <Shimmer className="h-full min-h-[220px] w-full rounded-sm" />
      </div>
    </div>
  )
}

// ─── Table Row Skeleton ──────────────────────────────────────────────────────
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  const colWidths = ["w-8", "flex-1", "w-28", "w-20", "w-16"]
  return (
    <div className="flex items-center gap-5 py-4 border-b border-border/50" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Shimmer
          key={i}
          className={cn(
            "h-4 shrink-0",
            i === 1 ? "flex-1" : colWidths[i] ?? "w-20"
          )}
        />
      ))}
    </div>
  )
}

// ─── Table Skeleton ──────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 10, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading table…">
      {/* Header */}
      <div className="flex items-center gap-5 py-3 mb-1 border-b-2 border-foreground/80">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer
            key={i}
            className={cn("h-3 shrink-0", i === 1 ? "flex-1" : "w-20")}
          />
        ))}
      </div>
      {/* Rows — staggered opacity for depth */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{ opacity: 1 - i * (0.45 / rows) }}
        >
          <TableRowSkeleton cols={cols} />
        </div>
      ))}
    </div>
  )
}

// ─── Startup Profile Skeleton ─────────────────────────────────────────────────
export function StartupProfileSkeleton() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 py-12 space-y-10"
      aria-busy="true"
      aria-label="Loading profile…"
    >
      {/* Hero header */}
      <div className="flex items-start gap-6">
        {/* Logo */}
        <Shimmer className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3">
          <Shimmer className="h-8 w-[70%]" />
          <Shimmer className="h-4 w-[50%]" />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Shimmer className="h-6 w-24 rounded-full" />
            <Shimmer className="h-6 w-20 rounded-full" />
            <Shimmer className="h-6 w-28 rounded-full" />
          </div>
        </div>
        {/* Action button */}
        <Shimmer className="hidden sm:block h-10 w-32 rounded-md shrink-0" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border/60">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 text-center">
            <Shimmer className="h-7 w-20 mx-auto" />
            <Shimmer className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* About section */}
      <div className="space-y-3">
        <Shimmer className="h-6 w-36" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-[95%]" />
        <Shimmer className="h-4 w-[88%]" />
        <Shimmer className="h-4 w-[72%]" />
      </div>

      {/* Two-column detail blocks */}
      <div className="grid sm:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Shimmer className="h-5 w-32" />
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-[85%]" />
            <Shimmer className="h-3 w-[65%]" />
          </div>
        ))}
      </div>

      {/* Team / people strip */}
      <div className="space-y-3">
        <Shimmer className="h-5 w-24" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <Shimmer className="h-12 w-12 rounded-full" />
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Blog Post Skeleton ──────────────────────────────────────────────────────
export function BlogPostSkeleton() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 py-12"
      aria-busy="true"
      aria-label="Loading article…"
    >
      {/* Category chip */}
      <Shimmer className="h-5 w-24 rounded-full mb-5" />

      {/* Title */}
      <div className="space-y-3 mb-6">
        <Shimmer className="h-10 w-full" />
        <Shimmer className="h-10 w-[88%]" />
        <Shimmer className="h-10 w-[62%]" />
      </div>

      {/* Byline */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/60">
        <Shimmer className="h-9 w-9 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Shimmer className="h-3.5 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>

      {/* Body content — paragraphs with natural variation */}
      <div className="space-y-3">
        {[100, 100, 92, 100, 78, 100, 85, 68].map((w, i) => (
          <Shimmer key={i} className={`h-4 w-[${w}%]`} />
        ))}

        {/* Subheading break */}
        <div className="pt-6 pb-2">
          <Shimmer className="h-7 w-[55%]" />
        </div>

        {[100, 95, 100, 82, 100, 70].map((w, i) => (
          <Shimmer key={`b-${i}`} className={`h-4 w-[${w}%]`} />
        ))}

        {/* Pull-quote block */}
        <div className="my-6 pl-5 border-l-4 border-border space-y-2">
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-5 w-[85%]" />
        </div>

        {[100, 90, 100, 76, 60].map((w, i) => (
          <Shimmer key={`c-${i}`} className={`h-4 w-[${w}%]`} />
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/60">
        {[16, 20, 14, 18].map((w, i) => (
          <Shimmer key={i} className={`h-7 w-${w} rounded-full`} />
        ))}
      </div>
    </div>
  )
}

// ─── Page Header Skeleton ────────────────────────────────────────────────────
export function PageHeaderSkeleton() {
  return (
    <div className="text-center py-14 space-y-4" aria-hidden="true">
      <Shimmer className="h-4 w-24 rounded-full mx-auto" />
      <div className="space-y-3">
        <Shimmer className="h-11 w-[72%] mx-auto" />
        <Shimmer className="h-11 w-[52%] mx-auto" />
      </div>
      <div className="space-y-2 pt-1">
        <Shimmer className="h-5 w-[55%] mx-auto" />
        <Shimmer className="h-5 w-[40%] mx-auto" />
      </div>
      {/* Search / filter bar */}
      <div className="flex items-center gap-3 max-w-xl mx-auto pt-6">
        <Shimmer className="h-11 flex-1 rounded-md" />
        <Shimmer className="h-11 w-28 rounded-md shrink-0" />
      </div>
    </div>
  )
}

// ─── Sidebar Skeleton ────────────────────────────────────────────────────────
export function SidebarSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Featured card */}
      <div className="border-2 border-border/70 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-4 rounded-full" />
          <Shimmer className="h-4 w-28" />
        </div>
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-[88%]" />
        <Shimmer className="h-3 w-[70%]" />
        <Shimmer className="h-9 w-full rounded-md mt-1" />
      </div>

      {/* Stats card */}
      <div className="border-2 border-border/70 p-5 space-y-4">
        <Shimmer className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>

      {/* Newsletter card */}
      <div className="border-2 border-border/70 p-5 space-y-3">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-[78%]" />
        <Shimmer className="h-11 w-full rounded-md mt-1" />
        <Shimmer className="h-10 w-full rounded-md" />
      </div>

      {/* Related list */}
      <div className="border-2 border-border/70 p-5 space-y-4">
        <Shimmer className="h-4 w-28" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Shimmer className="h-10 w-10 shrink-0 rounded-sm" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-[75%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Full Page Skeleton ──────────────────────────────────────────────────────
export function FullPageSkeleton({ variant = "registry" }: { variant?: "registry" | "blog" }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <PageHeaderSkeleton />
      <div className="mt-10">
        {variant === "blog" ? (
          <div className="space-y-6">
            <BlogHeroSkeleton />
            <BlogGridSkeleton count={6} />
          </div>
        ) : (
          <RegistryGridSkeleton count={12} />
        )}
      </div>
    </div>
  )
}

// ─── Dashboard / Analytics Skeleton ─────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard…">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-2 border-border/70 p-5 space-y-3">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-8 w-28" />
            <Shimmer className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="border-2 border-border/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-5 w-32" />
          <div className="flex gap-2">
            {[10, 12, 10].map((w, i) => (
              <Shimmer key={i} className={`h-7 w-${w} rounded-md`} />
            ))}
          </div>
        </div>
        {/* Fake bar chart */}
        <div className="flex items-end gap-2 h-40 pt-4">
          {[60, 80, 45, 95, 70, 55, 85, 40, 75, 90, 65, 50].map((h, i) => (
            <Shimmer
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ height: `${h}%` } as React.CSSProperties}
            />
          ))}
        </div>
        {/* X-axis labels */}
        <div className="flex gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Shimmer key={i} className="flex-1 h-3" />
          ))}
        </div>
      </div>

      {/* Split: table + sidebar */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TableSkeleton rows={6} cols={4} />
        </div>
        <div className="space-y-4">
          <div className="border-2 border-border/70 p-5 space-y-3">
            <Shimmer className="h-4 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Shimmer className="h-6 w-6 rounded-full shrink-0" />
                <Shimmer className="h-3 flex-1" />
                <Shimmer className="h-3 w-10 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Notification / Activity Feed Skeleton ────────────────────────────────────
export function ActivityFeedSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-px" aria-busy="true" aria-label="Loading activity…">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 border border-border/40 bg-background"
          style={{ opacity: 1 - i * (0.5 / count) }}
        >
          <Shimmer className="h-9 w-9 rounded-full shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Shimmer className="h-3.5 w-28" />
              <Shimmer className="h-3 w-20" />
            </div>
            <Shimmer className="h-3 w-[88%]" />
            {i % 3 === 0 && <Shimmer className="h-3 w-[65%]" />}
          </div>
          {i % 4 === 0 && (
            <Shimmer className="h-7 w-16 rounded-md shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Search Results Skeleton ─────────────────────────────────────────────────
export function SearchResultsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-1" aria-busy="true" aria-label="Searching…">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 py-5 border-b border-border/50"
          style={{ opacity: 1 - i * (0.4 / count) }}
        >
          {/* Icon / Favicon */}
          <Shimmer className="h-8 w-8 rounded-sm shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            {/* URL breadcrumb */}
            <Shimmer className="h-3 w-36" />
            {/* Title */}
            <Shimmer className={`h-5 ${i % 2 === 0 ? "w-[75%]" : "w-[60%]"}`} />
            {/* Snippet */}
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-[85%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

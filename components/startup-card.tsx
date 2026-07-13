"use client"

import Link from "next/link"
import { ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react"
import type { Startup } from "@/types/startup"
import { getStartupUrl } from "@/lib/domain"

interface StartupCardProps {
  startup: Startup
  featured?: boolean
}

export function StartupCard({ startup, featured = false }: StartupCardProps) {
  const getDisplayFounder = () => {
    if (!startup.founders || startup.founders.trim() === "") {
      return { name: "Institutional Lead", hasMore: false }
    }
    const parts = startup.founders.split(",")
    return {
      name: parts[0].trim(),
      hasMore: parts.length > 1,
    }
  }

  const founderInfo = getDisplayFounder()
  const hasRealUFRN = !!startup.ufrn
  const ufrnDisplay = startup.ufrn ?? `UPF-${startup.slug?.substring(0, 6).toUpperCase()}`
  const ufrnShort = startup.ufrn
    ? startup.ufrn.split("-").slice(-2).join("-")
    : ufrnDisplay

  // Global-standard relative URL (Automatically uses .org logic from lib/domain)
  const startupHref = getStartupUrl(startup.slug || "")

  return (
    <Link href={startupHref} className="group block h-full">
      <article
        className={`relative flex h-full flex-col rounded-2xl border transition-all duration-500 bg-white ${
          featured
            ? "border-slate-200 p-7 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1"
            : "border-slate-100 p-6 hover:border-blue-200 shadow-sm hover:shadow-md"
        }`}
      >
        {featured && (
          <div className="absolute -top-3 left-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1 shadow-lg shadow-slate-200">
              <Sparkles className="h-3 w-3 text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                Elite Member
              </span>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-start justify-between">
          <div
            className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border bg-white transition-colors ${
              featured ? "border-slate-100 shadow-sm" : "border-slate-50 shadow-none"
            }`}
          >
            {startup.logo_url ? (
              <img
                src={startup.logo_url}
                alt={`${startup.name} logo`}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <span className="text-2xl font-black text-slate-900">
                {startup.name?.charAt(0) || "?"}
              </span>
            )}
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {startup.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
              {startup.category}
            </span>
            {startup.founded_year && (
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                • EST. {startup.founded_year}
              </span>
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed font-medium text-slate-500">
            {startup.description}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-white">
              {founderInfo.name.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                Founder
              </p>
              <p className="text-xs font-bold text-slate-900">
                {founderInfo.name}
                {founderInfo.hasMore && <span className="text-blue-600 ml-1">+ Team</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1 text-green-600">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Verified</span>
            </div>

            {hasRealUFRN ? (
              <span 
                className="text-[9px] font-mono text-[#A89060]"
                title={`Registry ID: ${startup.ufrn}`}
              >
                {ufrnShort}
              </span>
            ) : (
              <p className="text-[9px] font-mono text-slate-300">{ufrnDisplay}</p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-6 right-6 h-0.5 scale-x-0 bg-slate-900 transition-transform duration-500 group-hover:scale-x-100" />
      </article>
    </Link>
  )
}

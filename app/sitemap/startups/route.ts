// app/sitemap/startups/route.ts — Google Sheets powered

import { fetchAllStartups } from "@/lib/google-sheets"
import { NextResponse } from "next/server"

const BASE_URL = "https://www.upforge.org"

export const revalidate = 300

export async function GET() {
  const all = await fetchAllStartups()

  const urls = all
    .filter((s) => s.slug)
    .map((s) => {
      const date = s.updated_at ?? s.created_at ?? "2026-01-01"
      const isoDate = new Date(date).toISOString().split("T")[0]
      return `
  <url>
    <loc>${BASE_URL}/startup/${s.slug}</loc>
    <lastmod>${isoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${s.is_featured ? "0.9" : "0.8"}</priority>
  </url>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  })
}

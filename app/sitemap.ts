import { MetadataRoute } from "next"
import { fetchAllStartups } from "@/lib/google-sheets"

const BASE = "https://www.upforge.org"
const STATIC_DATE = new Date("2026-04-28")

// All published blog slugs — updated June 2026
const STARTUP_BLOG_SLUGS = [
  // Core India startup content (March 2026, updated June 2026)
  "india-startup-ecosystem-2026",
  "how-to-get-startup-funding-india-2026",
  "top-indian-unicorns-2026",
  "best-indian-startup-founders-to-follow-2026",
  "top-ai-startups-india-2026",
  "how-to-start-startup-india-2026",

  // New high-value content (June 2026)
  "best-vc-firms-india-2026",
  "startup-valuation-india-2026",
  "startup-failure-reasons-india",
  "fintech-startups-india-2026",
  "women-founders-india-2026",
  "bootstrapped-startups-india-success-stories",
  "startup-legal-guide-india-2026",
  "india-vs-silicon-valley-startups",

  // Trend articles (July 2026)
  "ai-startup-funding-exit-route-india-2026",
  "investors-rejecting-generic-ai-pitches-2026",
  "defense-tech-startups-india-2026",
  "tier-2-tier-3-indian-cities-producing-startups-2026",
  "startup-verification-ufrn-credentials-guide",
]

const JUNE_2026_DATE = new Date("2026-06-26")

// Global founder pages - high priority
const FEATURED_FOUNDER_SLUGS = [
  "openai",
  "perplexity-ai",
  "revolut",
  "canva",
  "character-ai",
  "anthropic",
  "ramp",
  "stripe",
  "airbnb",
  "notion",
]

// Static routes with proper priority weighting
const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/registry", priority: 0.95, changeFrequency: "daily" as const },
  { path: "/startup", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/startups", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/submit", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/verify", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/founders", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/ufrn", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/indian-unicorns", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/methodology", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/editorial-standards", priority: 0.7, changeFrequency: "monthly" as const },
]

// Startup categories for global SEO
const STARTUP_CATEGORIES = [
  "artificial-intelligence",
  "fintech",
  "saas",
  "healthtech",
  "edtech",
  "ecommerce",
  "enterprise",
  "climate-tech",
  "blockchain",
  "cybersecurity",
]

// Major cities for local SEO
const STARTUP_CITIES = [
  "san-francisco",
  "new-york",
  "london",
  "berlin",
  "singapore",
  "dubai",
  "bangalore",
  "mumbai",
  "delhi",
  "hyderabad",
]

type StartupRow = {
  slug: string
  category?: string | null
  updated_at?: string | null
  created_at?: string | null
  is_featured?: boolean | null
  ufrn?: string | null
}

type BlogRow = {
  slug: string
  updated_at?: string | null
  created_at?: string | null
  is_featured?: boolean | null
}

function safeDate(value?: string | null): Date {
  if (!value) return STATIC_DATE
  const d = new Date(value)
  return isNaN(d.getTime()) ? STATIC_DATE : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let startups: StartupRow[] = []
  let blogs: BlogRow[] = []

  try {
    const all = await fetchAllStartups()
    startups = all.map(s => ({
      slug: s.slug,
      category: s.category ?? null,
      updated_at: s.updated_at ?? null,
      created_at: s.created_at ?? null,
      is_featured: s.is_featured ?? null,
      ufrn: s.ufrn ?? null,
    }))
  } catch (error) {
    console.error("Sitemap generation error:", error)
    startups = []
    blogs = []
  }

  // 1. Static pages (highest priority first)
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
    url: `${BASE}${route.path}`,
    lastModified: STATIC_DATE,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // 2. Featured founder pages
  const founderEntries: MetadataRoute.Sitemap = FEATURED_FOUNDER_SLUGS.map(slug => ({
    url: `${BASE}/startup/${slug}`,
    lastModified: STATIC_DATE,
    changeFrequency: "daily" as const,
    priority: 0.95,
  }))

  // 3. Category pages
  const categoryEntries: MetadataRoute.Sitemap = STARTUP_CATEGORIES.map(cat => ({
    url: `${BASE}/startups/${cat}`,
    lastModified: STATIC_DATE,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }))

  // 4. City-based pages
  const cityEntries: MetadataRoute.Sitemap = STARTUP_CITIES.map(city => ({
    url: `${BASE}/startups/${city}`,
    lastModified: STATIC_DATE,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }))

  // 5. Individual startup pages
  const startupEntries: MetadataRoute.Sitemap = startups.map(s => ({
    url: `${BASE}/startup/${s.slug}`,
    lastModified: safeDate(s.updated_at || s.created_at),
    changeFrequency: "weekly" as const,
    priority: s.is_featured ? 0.9 : 0.75,
  }))

  // 6. UFRN verification pages
  const ufrnEntries: MetadataRoute.Sitemap = startups
    .filter(s => s.ufrn)
    .map(s => ({
      url: `${BASE}/ufrn/${s.ufrn}`,
      lastModified: safeDate(s.updated_at || s.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

  // 7. Blog entries from database (startup-related only)
  const blogEntries: MetadataRoute.Sitemap = blogs.map(b => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: safeDate(b.updated_at || b.created_at),
    changeFrequency: "monthly" as const,
    priority: b.is_featured ? 0.8 : 0.65,
  }))

  const JULY_2026_DATE = new Date("2026-07-06")
  const JULY_BLOG_SLUGS = [
    "ai-startup-funding-exit-route-india-2026",
    "investors-rejecting-generic-ai-pitches-2026",
    "defense-tech-startups-india-2026",
    "tier-2-tier-3-indian-cities-producing-startups-2026",
    "startup-verification-ufrn-credentials-guide",
  ]
  // 8. Curated blog slugs — use June/July dates for new posts
  const NEW_BLOG_SLUGS = [
    "best-vc-firms-india-2026",
    "startup-valuation-india-2026",
    "startup-failure-reasons-india",
    "fintech-startups-india-2026",
    "women-founders-india-2026",
    "bootstrapped-startups-india-success-stories",
    "startup-legal-guide-india-2026",
    "india-vs-silicon-valley-startups",
  ]
  const curatedBlogEntries: MetadataRoute.Sitemap = STARTUP_BLOG_SLUGS.map(slug => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: JULY_BLOG_SLUGS.includes(slug)
      ? JULY_2026_DATE
      : NEW_BLOG_SLUGS.includes(slug)
      ? JUNE_2026_DATE
      : STATIC_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }))

  // Combine all entries - static pages first for priority
  return [
    ...staticEntries,
    ...founderEntries,
    ...categoryEntries,
    ...cityEntries,
    ...startupEntries,
    ...ufrnEntries,
    ...blogEntries,
    ...curatedBlogEntries,
  ]
}

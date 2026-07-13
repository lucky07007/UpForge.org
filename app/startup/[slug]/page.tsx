// app/startup/[slug]/page.tsx — Google Sheets powered

import type { Metadata } from "next"
import type { Startup } from "@/types/startup"
import { StartupDetail } from "@/components/startup-detail"
import { generateStartupKeywords } from "@/lib/seo-keywords"
import { findStartupBySlug, findRelatedStartups } from "@/lib/google-sheets"

export const revalidate = 300

const BASE_URL = "https://www.upforge.org"
const MARKETING_BASE = "https://www.upforge.in"
const DEFAULT_OG = `${MARKETING_BASE}/og/startup-default.png`

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── SLUG → HUMAN NAME (% safe, space safe) ───
function slugToName(slug: string): string {
  try {
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  } catch {
    return slug
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
}

// ─── SAFE DECODE ───
function safeDecode(val: string | undefined): string {
  if (!val) return ""
  try {
    return decodeURIComponent(val).trim()
  } catch {
    return val.trim()
  }
}

// ─── SHEET FETCHER — now uses shared lib ───

// ─── FIND STARTUP BY SLUG (uses shared lib) ───
async function getStartup(slug: string): Promise<Startup | null> {
  return findStartupBySlug(slug)
}

// ─── RELATED STARTUPS ───
async function getRelatedStartups(
  category: string,
  currentSlug: string
): Promise<Pick<Startup, "name" | "slug" | "description" | "logo_url" | "category">[]> {
  return findRelatedStartups(category, currentSlug, 4)
}

// ─── HELPERS ───
function buildTitle(startup: Startup): string {
  const sector = startup.category ?? "Startup"
  const location = startup.city
    ? `, ${startup.city}`
    : startup.country_name
    ? `, ${startup.country_name}`
    : ""
  const ufrn = startup.ufrn ? ` · ${startup.ufrn}` : ""
  return `${startup.name} — ${sector}${location}${ufrn} | UpForge Registry`
}

function buildDescription(startup: Startup): string {
  if (startup.description && startup.description.length > 60) {
    const base = startup.description.slice(0, 200).trimEnd()
    const suffix = startup.ufrn ? ` Registry ID: ${startup.ufrn}.` : ""
    return `${base}${base.endsWith(".") ? "" : "."}${suffix}`
  }
  const parts: string[] = []
  parts.push(`${startup.name} is a verified startup`)
  if (startup.category) parts[0] += ` in the ${startup.category} sector`
  if (startup.city) parts[0] += `, based in ${startup.city}`
  if (startup.country_name && startup.country_name !== startup.city)
    parts[0] += `, ${startup.country_name}`
  parts[0] += "."
  if (startup.founders) parts.push(`Founded by ${startup.founders}.`)
  if (startup.founded_year) parts.push(`Established ${startup.founded_year}.`)
  if (startup.ufrn) parts.push(`UpForge Registry Number: ${startup.ufrn}.`)
  parts.push("Listed on the UpForge Global Startup Registry.")
  return parts.join(" ")
}

// ─── METADATA ───
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  let startup = await getStartup(slug)

  if (!startup) {
    const fallbackName = slugToName(slug)
    startup = {
      id: "index-" + slug,
      name: fallbackName,
      slug,
      description: `${fallbackName} is currently being indexed by the UpForge Global Registry.`,
      category: "Pending Review",
      city: "Global",
      country_name: "Unlisted",
      ufrn: "PENDING-VERIFICATION",
    } as Startup
  }

  const canonicalUrl = `${BASE_URL}/startup/${slug}`
  const title = buildTitle(startup)
  const description = buildDescription(startup)
  const keywords = generateStartupKeywords({
    name: startup.name,
    category: startup.category,
    city: startup.city,
    country: startup.country_name,
    founders: startup.founders,
    year: startup.founded_year,
  })
  const ogImage =
    startup.logo_url && startup.logo_url.startsWith("http")
      ? startup.logo_url
      : DEFAULT_OG

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        "en-US": canonicalUrl,
        "en-IN": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: `${MARKETING_BASE}/startup/${slug}`,
      siteName: "UpForge Global Registry",
      type: "profile",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${startup.name} — UpForge Registry` },
        { url: DEFAULT_OG, width: 1200, height: 630, alt: "UpForge Global Startup Registry" },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@UpForgeHQ",
      creator: "@UpForgeHQ",
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    other: {
      lastModified: new Date().toISOString(),
      ...(startup.ufrn && {
        "upforge:registry-id": startup.ufrn,
        "upforge:ufrn-url": `${BASE_URL}/verify/${startup.ufrn}`,
      }),
    },
  }
}

// ─── SCHEMA BUILDERS ───
function buildOrganizationSchema(startup: Startup, canonicalUrl: string) {
  const sameAs = [
    startup.linkedin_url,
    startup.twitter_url,
    startup.instagram_url,
    startup.website,
    startup.ufrn ? `${BASE_URL}/verify/${startup.ufrn}` : null,
    `${MARKETING_BASE}/startup/${startup.slug}`,
  ].filter(Boolean)

  const founderPersons = startup.founders
    ? startup.founders
        .split(/[,;&]/)
        .map((f) => {
          const name = f.trim()
          return name
            ? {
                "@type": "Person",
                name,
                jobTitle: "Founder",
                worksFor: { "@id": `${canonicalUrl}#organization` },
              }
            : null
        })
        .filter(Boolean)
    : undefined

  const identifiers: object[] = []
  if (startup.ufrn) {
    identifiers.push(
      {
        "@type": "PropertyValue",
        propertyID: "UFRN",
        name: "UpForge Registry Number",
        value: startup.ufrn,
        url: `${BASE_URL}/verify/${startup.ufrn}`,
      },
      { "@type": "PropertyValue", propertyID: "serialNumber", value: startup.ufrn }
    )
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${canonicalUrl}#organization`,
    name: startup.name,
    url: startup.website ?? canonicalUrl,
    description: buildDescription(startup),
    ...(startup.logo_url
      ? {
          logo: {
            "@type": "ImageObject",
            url: startup.logo_url,
            contentUrl: startup.logo_url,
          },
          image: startup.logo_url,
        }
      : {}),
    foundingDate: startup.founded_year?.toString(),
    industry: startup.category,
    knowsAbout: startup.category,
    ...(founderPersons && founderPersons.length > 0 ? { founder: founderPersons } : {}),
    areaServed: startup.country_name ?? "Worldwide",
    ...(startup.city || startup.country_code
      ? {
          address: {
            "@type": "PostalAddress",
            ...(startup.city ? { addressLocality: startup.city } : {}),
            ...(startup.country_name ? { addressRegion: startup.country_name } : {}),
            ...(startup.country_code ? { addressCountry: startup.country_code } : {}),
          },
        }
      : {}),
    sameAs,
    ...(identifiers.length > 0 ? { identifier: identifiers } : {}),
    isPartOf: {
      "@type": "DataCatalog",
      "@id": `${BASE_URL}/registry#catalog`,
      name: "UpForge Global Startup Registry",
      url: `${BASE_URL}/registry`,
    },
    mainEntityOfPage: { "@id": `${canonicalUrl}#webpage` },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "UpForge",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${MARKETING_BASE}/logo.jpg` },
    },
  }
}

function buildFounderPersonSchemas(startup: Startup, canonicalUrl: string): object[] {
  if (!startup.founders) return []
  return startup.founders
    .split(/[,;&]/)
    .map((f) => f.trim())
    .filter(Boolean)
    .map((name, idx) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${canonicalUrl}#founder-${idx + 1}`,
      name,
      jobTitle: "Founder",
      worksFor: {
        "@type": "Organization",
        "@id": `${canonicalUrl}#organization`,
        name: startup.name,
      },
      ...(startup.founded_year ? { startDate: String(startup.founded_year) } : {}),
      ...(startup.city || startup.country_name
        ? {
            homeLocation: {
              "@type": "Place",
              name: [startup.city, startup.country_name].filter(Boolean).join(", "),
            },
          }
        : {}),
    }))
}

function buildWebPageSchema(startup: Startup, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: buildTitle(startup),
    description: buildDescription(startup),
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "UpForge Global Registry",
      url: BASE_URL,
    },
    about: { "@id": `${canonicalUrl}#organization` },
    dateModified: new Date().toISOString(),
    mainEntity: { "@id": `${canonicalUrl}#organization` },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "UpForge",
      url: BASE_URL,
    },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  }
}

function buildBreadcrumbSchema(startup: Startup, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "UpForge", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Global Registry", item: `${BASE_URL}/registry` },
      ...(startup.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: startup.category,
              item: `${BASE_URL}/registry?sector=${encodeURIComponent(startup.category)}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: startup.category ? 4 : 3,
        name: startup.name,
        item: canonicalUrl,
      },
    ],
  }
}

function buildFAQSchema(startup: Startup, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${startup.name}'s UFRN?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: startup.ufrn
            ? `${startup.name}'s UpForge Registry Number (UFRN) is ${startup.ufrn}. Verify at ${BASE_URL}/verify/${startup.ufrn}.`
            : `${startup.name} is listed on the UpForge Global Startup Registry. Visit ${BASE_URL}/registry to learn more.`,
        },
      },
      {
        "@type": "Question",
        name: "What is a UFRN (UpForge Registry Number)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A UFRN is a unique, permanent identifier assigned to every approved startup on UpForge. Format: UF-YYYY-CC-NNNNN.",
        },
      },
      {
        "@type": "Question",
        name: `How can I claim the ${startup.name} profile?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Visit ${MARKETING_BASE}/contact or email registry@upforge.in to claim or update this profile.`,
        },
      },
      {
        "@type": "Question",
        name: "Is the UpForge Registry free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, completely free — always. Submit your startup at ${MARKETING_BASE}/submit.`,
        },
      },
    ],
  }
}

function buildPublisherOrgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "UpForge",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${MARKETING_BASE}/logo.jpg`,
      width: 400,
      height: 400,
    },
    sameAs: [
      MARKETING_BASE,
      BASE_URL,
      "https://twitter.com/UpForgeHQ",
      "https://www.linkedin.com/company/upforge",
    ],
    description: "UpForge is the world's open, independent, verified global startup registry.",
    foundingDate: "2024",
    areaServed: "Worldwide",
  }
}

// ─────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────

function VerifiedBadge({ ufrn }: { ufrn?: string | null }) {
  if (!ufrn || ufrn === "PENDING-VERIFICATION") return null
  return (
    <span
      title={`Verified · UFRN: ${ufrn}`}
      aria-label="Verified startup on UpForge Global Registry"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "9999px",
        padding: "3px 10px 3px 6px",
        fontSize: "11px",
        fontWeight: 700,
        color: "#15803d",
        letterSpacing: "0.02em",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="#16a34a"
        width="14"
        height="14"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  )
}

function UFRNBadge({ ufrn, slug }: { ufrn?: string | null; slug: string }) {
  if (!ufrn || ufrn === "PENDING-VERIFICATION") {
    return (
      <span
        title="Verification pending — being reviewed"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "6px",
          padding: "3px 10px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#92400e",
          fontFamily: "monospace",
        }}
      >
        <svg viewBox="0 0 16 16" fill="#d97706" width="11" height="11" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 4.5v4h-1.5v-4h1.5zm0 5.25v1.5h-1.5v-1.5h1.5z" />
        </svg>
        PENDING-VERIFICATION
      </span>
    )
  }
  return (
    <a
      href={`${BASE_URL}/verify/${ufrn}`}
      title={`Verify UFRN: ${ufrn}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "6px",
        padding: "3px 10px",
        fontSize: "11px",
        fontWeight: 700,
        color: "#166534",
        fontFamily: "monospace",
        textDecoration: "none",
      }}
    >
      <svg viewBox="0 0 16 16" fill="#16a34a" width="11" height="11" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.28 5.28a.75.75 0 0 0-1.06-1.06L7 8.44 5.78 7.22a.75.75 0 0 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.75-3.75z"
          clipRule="evenodd"
        />
      </svg>
      {ufrn}
    </a>
  )
}

function TrustBar({ startup }: { startup: Startup }) {
  const isPending = !startup.ufrn || startup.ufrn === "PENDING-VERIFICATION"

  const pills = [
    {
      label: "100% Free · Always",
      color: "#166534",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 9.5h-1.5v-5h1.5v5zm0-6.25h-1.5v-1.5h1.5v1.5z" />
        </svg>
      ),
    },
    {
      label: isPending ? "Indexing in Progress" : "Registry Verified",
      color: isPending ? "#92400e" : "#1e40af",
      bg: isPending ? "#fffbeb" : "#eff6ff",
      border: isPending ? "#fde68a" : "#bfdbfe",
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M8 0l1.8 3.6 4 .6-2.9 2.8.7 4L8 10l-3.6 1.9.7-4L2.2 5.2l4-.6z" />
        </svg>
      ),
    },
    {
      label: "Global Startup Index",
      color: "#6b21a8",
      bg: "#faf5ff",
      border: "#e9d5ff",
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM7 11.5L3.5 8l1.06-1.06L7 9.38l4.44-4.44L12.5 6 7 11.5z" />
        </svg>
      ),
    },
    {
      label: "Open to All Founders",
      color: "#0f766e",
      bg: "#f0fdfa",
      border: "#99f6e4",
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.5 4h-1v5h1V5zm0 6h-1v1h1v-1z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 16px",
      }}
      aria-label="UpForge trust indicators"
    >
      {pills.map((p, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: p.bg,
            border: `1px solid ${p.border}`,
            borderRadius: "9999px",
            padding: "3px 10px 3px 7px",
            fontSize: "11px",
            fontWeight: 600,
            color: p.color,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: p.color, display: "flex", alignItems: "center" }}>
            {p.icon}
          </span>
          {p.label}
        </span>
      ))}
    </div>
  )
}

function ClaimBanner({ startup }: { startup: Startup }) {
  const isLikelyClaimed = startup.linkedin_url || startup.website
  if (isLikelyClaimed) return null
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#fefce8",
        border: "1px solid #fde047",
        borderRadius: "10px",
        padding: "14px 16px",
        maxWidth: "560px",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "center",
      }}
      role="complementary"
      aria-label="Claim this startup profile"
    >
      <div>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#713f12" }}>
          Is this your startup?
        </p>
        <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#92400e" }}>
          Claim this profile to add your logo, website, social links &amp; founder details —
          completely free.
        </p>
      </div>
      <a
        href={`${MARKETING_BASE}/contact`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#ca8a04",
          color: "#fff",
          borderRadius: "7px",
          padding: "8px 18px",
          fontSize: "12px",
          fontWeight: 700,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Claim Free Profile →
      </a>
    </div>
  )
}

// ─── PAGE ───
export default async function StartupPage({ params }: PageProps) {
  const { slug } = await params

  let startup = await getStartup(slug)

  if (!startup) {
    const fallbackName = slugToName(slug)
    startup = {
      id: "index-" + slug,
      name: fallbackName,
      slug,
      description: `${fallbackName} is currently being indexed by the UpForge Global Registry. Full corporate details, verifiable UFRN, and founder metadata will be populated shortly.`,
      category: "Pending Review",
      city: "Global",
      country_name: "Unlisted",
      ufrn: "PENDING-VERIFICATION",
      is_sponsored: false,
      is_featured: false,
    } as Startup
  }

  const canonicalUrl = `${BASE_URL}/startup/${slug}`
  const relatedStartups = startup.category
    ? await getRelatedStartups(startup.category, slug)
    : []

  const founderSchemas = buildFounderPersonSchemas(startup, canonicalUrl)
  const allSchemas: object[] = [
    buildPublisherOrgSchema(),
    buildOrganizationSchema(startup, canonicalUrl),
    buildWebPageSchema(startup, canonicalUrl),
    buildBreadcrumbSchema(startup, canonicalUrl),
    buildFAQSchema(startup, canonicalUrl),
    ...founderSchemas,
  ]

  const isVerified = !!(startup.ufrn && startup.ufrn !== "PENDING-VERIFICATION")

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Structured Data */}
      {allSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      {/* hreflang */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-US" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Screen-reader nav */}
      <nav className="sr-only" aria-label="Site navigation">
        <a href={`${BASE_URL}/registry`}>Global Startup Registry</a>
        {startup.category && (
          <a href={`${BASE_URL}/registry?sector=${encodeURIComponent(startup.category)}`}>
            {startup.category} Startups
          </a>
        )}
        {startup.country_code && (
          <a href={`${BASE_URL}/registry?country=${encodeURIComponent(startup.country_code)}`}>
            Startups in {startup.country_name ?? startup.country_code}
          </a>
        )}
        <a href={`${MARKETING_BASE}/submit`}>Submit Your Startup</a>
      </nav>

      {/* Sponsored banner */}
      {startup.is_sponsored && (
        <div
          style={{
            backgroundColor: "#C59A2E",
            color: "#fff",
            textAlign: "center",
            padding: "8px 16px",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Sponsored Profile · Featured Entity
        </div>
      )}

      {/* Claim Banner — centered, full width */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px 16px 0",
          width: "100%",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <ClaimBanner startup={startup} />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, width: "100%" }}>
        <StartupDetail
          startup={startup}
          relatedStartups={relatedStartups}
          profileUrl={canonicalUrl}
        />
      </main>

      {/* Footer trust strip */}
      <footer
        aria-label="UpForge footer"
        style={{
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: "11px",
          color: "#6b7280",
        }}
      >
        <p style={{ margin: 0, lineHeight: 1.8 }}>
          Listed on the{" "}
          <a
            href={`${BASE_URL}/registry`}
            style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none" }}
          >
            UpForge Global Startup Registry
          </a>{" "}
          · 100% Free · Open to All Founders ·{" "}
          <a
            href={`${MARKETING_BASE}/submit`}
            style={{ color: "#16a34a", fontWeight: 600, textDecoration: "none" }}
          >
            Submit Your Startup →
          </a>
        </p>
        {isVerified && startup.ufrn && (
          <p
            style={{
              margin: "4px 0 0",
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#9ca3af",
            }}
          >
            UFRN: {startup.ufrn} ·{" "}
            <a
              href={`${BASE_URL}/verify/${startup.ufrn}`}
              style={{ color: "#6b7280", textDecoration: "underline" }}
            >
              Verify
            </a>
          </p>
        )}
      </footer>
    </div>
  )
}

// Named exports — useable in StartupDetail or any child component
export { VerifiedBadge, UFRNBadge, ClaimBanner, TrustBar, slugToName, safeDecode }

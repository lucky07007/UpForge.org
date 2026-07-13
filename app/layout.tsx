// app/layout.tsx

import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "../components/client-layout"
import { CookieBanner } from "../components/cookie-banner"
import Script from "next/script"

import { getDomainContext } from "@/lib/domain.server"
import { fetchAllStartups } from "@/lib/google-sheets"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
}

async function getLatestStartupDate(): Promise<string> {
  try {
    const startups = await fetchAllStartups()
    let maxTime = 0
    let maxDateStr = ""
    startups.forEach((s) => {
      const dateStr = s.updated_at || s.created_at
      if (dateStr) {
        const time = new Date(dateStr).getTime()
        if (time > maxTime) {
          maxTime = time
          maxDateStr = dateStr
        }
      }
    })
    if (maxDateStr) {
      return new Date(maxDateStr).toISOString()
    }
  } catch {}

  return new Date().toISOString()
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = "https://www.upforge.org"

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default:
        "UpForge — Global Startup Registry & Emerging Market Intelligence 2026",
      template: "%s | UpForge",
    },

    description:
      "UpForge is the world's independent verified startup registry. Discover global startups, unicorn founders, funding intelligence, and emerging market insights.",

    applicationName: "UpForge",

    keywords: [
      "global startup registry",
      "startup database worldwide",
      "verified startups directory",
      "Indian startup registry",
      "AI startups database",
      "fintech startups global",
      "emerging market startups",
      "UFRN lookup",
    ],

    authors: [
      {
        name: "UpForge Editorial",
        url: `${baseUrl}/about`,
      },
    ],

    creator: "UpForge",
    publisher: "UpForge",

    alternates: {
      canonical: baseUrl,
    },

    verification: {
      // Add your actual Google Search Console verification token here
       google: "google4fca56100e982c53",
    },

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    manifest: "/site.webmanifest",

    referrer: "origin-when-cross-origin",

    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: "UpForge",
      title:
        "UpForge — Global Startup Registry & Emerging Market Intelligence 2026",
      description:
        "Discover verified startups globally. Founder profiles, funding intelligence, and sector analysis.",
      images: [
        {
          url: `${baseUrl}/og/global-registry.png`,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@upforge_in",
      creator: "@upforge_in",
      title: "UpForge — Global Startup Registry",
      images: [`${baseUrl}/og/global-registry.png`],
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
      // Add your Bing verification token here when ready
      // "msvalidate.01": "YOUR_BING_TOKEN",
      // This links your AdSense publisher account to this site for pre-approval
      "google-adsense-account": "ca-pub-5377045438787332",
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getDomainContext()
  const latestDate = await getLatestStartupDate()

  // Organization schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UpForge",
    url: "https://www.upforge.org",
    logo: "https://www.upforge.org/logo.jpg",
    description:
      "Global startup registry with verified founder database and UFRN credentials",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.linkedin.com/company/upforge-india",
      "https://twitter.com/upforge_in",
    ],
    dateModified: latestDate,
  }

  // Website schema
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UpForge",
    url: "https://www.upforge.org",
    description: "Global startup registry with verified founder database",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.upforge.org/startups?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  // Breadcrumb schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.upforge.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Registry",
        item: "https://www.upforge.org/registry",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Submit Startup",
        item: "https://www.upforge.org/submit",
      },
    ],
  }

  return (
    <html
      lang="en-US"
      className={`${inter.variable} ${playfair.variable}`}
      data-domain={ctx}
    >
      <head>
        {/* Performance: Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
      </head>

      <body className="bg-background text-foreground flex flex-col min-h-screen antialiased font-sans">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3J7Y3695TK"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3J7Y3695TK');
          `}
        </Script>

        {/* Google AdSense Auto Ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5377045438787332"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <ClientLayout domainContext={ctx}>{children}</ClientLayout>

        <CookieBanner />
      </body>
    </html>
  )
}

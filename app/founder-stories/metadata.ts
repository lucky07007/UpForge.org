// app/founder-stories/metadata.ts
// Keep metadata separate since page.tsx is a client component

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Founder Chronicle — India's Greatest Startup Builders 2026 | UpForge",
  description:
    "5 stories from the founders behind India's most consequential startups — Zepto, PhysicsWallah, Zomato, Zerodha, Nykaa. Newspaper-editorial format. Real quotes, real numbers, verified by UpForge. March 2026.",
  keywords:
    "Indian startup founder stories, startup founders India 2026, Indian entrepreneur success story, Aadit Palicha Zepto, Alakh Pandey PhysicsWallah, Deepinder Goyal Zomato, Nithin Kamath Zerodha, Falguni Nayar Nykaa, young founders India, first generation entrepreneurs India, founder insights India, UpForge founder chronicle",
  alternates: { canonical: "https://upforge.in/founder-stories" },
  openGraph: {
    title: "The Founder Chronicle — India's Greatest Startup Builders 2026 | UpForge",
    description:
      "5 real stories from the founders behind India's most consequential startups. Newspaper editorial format. Zepto, PhysicsWallah, Zomato, Zerodha, Nykaa.",
    url: "https://upforge.in/founder-stories",
    siteName: "UpForge",
    locale: "en_IN",
    type: "article",
    images: [{ url: "https://upforge.in/og/founder-stories.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@upforge_in",
    title: "The Founder Chronicle — India 2026 | UpForge",
    images: ["https://upforge.in/og/founder-stories.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
}

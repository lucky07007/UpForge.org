import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const BASE = "https://www.upforge.org"

  const commonAllows = [
    "/",
    "/startup/",
    "/startups/",
    "/blog/",
    "/ufrn/",
    "/registry/",
    "/about",
    "/submit",
    "/contact",
    "/privacy",
    "/terms",
    "/faq",
    "/founders",
    "/verify",
    "/verification",
    "/methodology",
    "/editorial-standards",
    "/sitemap.xml",
  ]

  const commonDisallows = [
    "/admin/",
    "/api/",
    "/_next/",
    "/private/",
    "/*?preview=",
    "/*?draft=",
    "/*?token=",
  ]

  return {
    rules: [
      // Rule 1: Allow major search engine crawlers with specific paths
      {
        userAgent: [
          "Googlebot",
          "Googlebot-News",
          "Googlebot-Image",
          "Googlebot-Video",
          "AdsBot-Google",
          "AdsBot-Google-Mobile",
        ],
        allow: commonAllows,
        disallow: commonDisallows,
      },
      
      // Rule 2: Bing specific
      {
        userAgent: ["Bingbot", "MSNBot"],
        allow: commonAllows,
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
        ],
        crawlDelay: 2,
      },
      
      // Rule 3: Block AI training bots completely
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "Amazonbot",
          "Google-Extended",
          "meta-externalagent",
          "Bytespider",
          "Applebot-Extended",
          "PerplexityBot",
          "Anthropic-AI",
          "cohere-ai",
          "Diffbot",
        ],
        disallow: ["/"],
      },
      
      // Rule 4: Catch-all for other bots
      {
        userAgent: "*",
        allow: commonAllows,
        disallow: commonDisallows,
        crawlDelay: 3,
      },
    ],
    sitemap: [
      `${BASE}/sitemap.xml`,
    ],
    host: BASE,
  }
}

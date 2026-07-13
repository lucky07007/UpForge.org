// app/editorial-standards/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert, BookOpen, UserCheck, HelpCircle, History } from "lucide-react"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Editorial Standards & Corrections Policy | UpForge Journal",
  description:
    "Explore the editorial standards governing the UpForge journal. Learn about our accuracy workflows, research independence, and corrections framework.",
  alternates: { canonical: "https://www.upforge.org/editorial-standards" },
  openGraph: {
    title: "Editorial Standards & Corrections Policy | UpForge Journal",
    description:
      "Operational standards for the UpForge editorial team: independence guidelines, research checks, and correction logs.",
    url: "https://www.upforge.org/editorial-standards",
    siteName: "UpForge",
    images: [{ url: "https://www.upforge.org/og-editorial-standards.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.upforge.org/editorial-standards",
      "url": "https://www.upforge.org/editorial-standards",
      "name": "Editorial Standards & Corrections Policy",
      "description": "The operational guidelines, research validation workflow, and corrections logs policy of the UpForge journal.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.upforge.org" },
          { "@type": "ListItem", "position": 2, "name": "Editorial Standards", "item": "https://www.upforge.org/editorial-standards" }
        ]
      }
    }
  ]
}

export default function EditorialStandardsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background min-h-screen text-foreground font-serif overflow-x-hidden">
        
        {/* Header Section */}
        <section className="border-b-[2px] border-foreground max-w-[1300px] mx-auto px-4 md:px-8 w-full mt-5 pb-6 flex flex-col items-center text-center">
          <h1
            className="text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Editorial Standards
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#C59A2E] font-bold mt-2">
            Governance, Accuracy, and Independence in Our Research and Analysis
          </p>
        </section>

        {/* Main Body Content */}
        <main className="max-w-[900px] mx-auto px-6 py-12 space-y-12">
          
          <section className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-relaxed">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic mb-8">
              "We believe that startup intelligence should be free from promotional influence. The UpForge Journal publishes data-backed research designed to help founders and investors make informed, analytical decisions."
            </p>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4">
              1. Editorial Independence
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-6 font-serif">
              UpForge is an independent startup registry. Our articles, industry rankings, and ecosystem analyses are determined solely by our editorial board. We maintain a strict boundary between our commercial operations and our research:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-serif text-foreground/80 mb-8">
              <li><strong>No Paid Rankings:</strong> We never accept payment to feature a startup or change its ranking in our editorial pieces.</li>
              <li><strong>No Pay-to-Play Profiles:</strong> Any sponsored profiles are explicitly labeled as such in the registry layout. Our editorial journal remains entirely independent of sponsorship.</li>
              <li><strong>Declaration of Interest:</strong> If an author has a direct financial interest or equity stake in a discussed company, the article will include a clear, public declaration of interest.</li>
            </ul>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              2. Verification & Fact-Checking Workflow
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-6 font-serif">
              Every journal article goes through a formal three-step verification process to ensure accuracy before publication:
            </p>

            <div className="space-y-4 my-6">
              <div className="flex gap-4 border border-foreground p-4 bg-muted/15">
                <div className="shrink-0 font-mono text-[#C59A2E] font-bold text-lg">01</div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider font-sans">Primary Source Verification</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We cross-reference all metrics (funding round sizes, revenue claims, founder titles) against primary corporate records (MCA fillings, DPIIT indexes, or audited press releases) before quoting them.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border border-foreground p-4 bg-muted/15">
                <div className="shrink-0 font-mono text-[#C59A2E] font-bold text-lg">02</div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider font-sans">Analyst Peer Review</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Drafts are peer-reviewed by a Senior Research Analyst to check for statistical validity, clean logic, and alignment with our data-first presentation standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border border-foreground p-4 bg-muted/15">
                <div className="shrink-0 font-mono text-[#C59A2E] font-bold text-lg">03</div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider font-sans">Editor-in-Chief Review</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The Editor-in-Chief performs the final review, validating that the content complies with Google Publisher policies, E-E-A-T trust signals, and site-wide accuracy guidelines.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              3. AI-Assisted Writing & Plagiarism Guidelines
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4 font-serif">
              Our writers commit to producing unique, insightful content:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-serif text-foreground/80 mb-8">
              <li><strong>Zero Plagiarism Policy:</strong> We do not copy content from other sources. All citations must be credited to their original publisher.</li>
              <li><strong>AI Transparency:</strong> While our research analysts may use generative AI tools to clean raw dataset columns or generate structural outlines, all written analysis, insights, and final text are compiled and validated by named human authors.</li>
            </ul>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              4. Corrections Log Policy
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4 font-serif">
              When factual errors occur, we correct them promptly. A notice detailing the edit will be placed in the footer of the corrected article, and the change will be logged here.
            </p>

            <div className="border border-foreground bg-muted/10 p-6 rounded-md my-6">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                <History className="h-4 w-4 text-[#C59A2E]" /> Historical Corrections Log (2026)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Date</th>
                      <th className="border border-border p-2 text-left">Article / Route</th>
                      <th className="border border-border p-2 text-left">Correction Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-mono whitespace-nowrap">2026-06-26</td>
                      <td className="border border-border p-2">
                        <Link href="/blog/best-vc-firms-india-2026" className="text-[#C59A2E] hover:underline">
                          /blog/best-vc-firms-india-2026
                        </Link>
                      </td>
                      <td className="border border-border p-2 text-muted-foreground">
                        Corrected fund check size ranges in the Tier 1 table to align with recent SEC filings.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono whitespace-nowrap">2026-07-06</td>
                      <td className="border border-border p-2">
                        <Link href="/about" className="text-[#C59A2E] hover:underline">
                          /about
                        </Link>
                      </td>
                      <td className="border border-border p-2 text-muted-foreground">
                        Rectified name fields for Vikash Sharma and Vikash Yadav to resolve bio card naming mismatches.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#B30000]/5 border-l-4 border-[#B30000] p-6 my-8">
              <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#B30000]" /> Report an Editorial Inaccuracy
              </h3>
              <p className="text-sm text-foreground/80 font-serif leading-relaxed mb-4">
                We take feedback seriously. If you have spotted an error in any of our published articles, please let our editorial board know.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-foreground hover:bg-[#B30000] text-background hover:text-white px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Submit Correction Request →
              </Link>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

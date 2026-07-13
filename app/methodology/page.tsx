// app/methodology/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Database, CheckCircle, RefreshCw, Scale, Search } from "lucide-react"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Registry Verification Methodology & Data Standards | UpForge",
  description:
    "Explore the UpForge verification framework. Learn how we issue UFRN credentials, cross-reference state registries, and audit startup profile data.",
  alternates: { canonical: "https://www.upforge.org/methodology" },
  openGraph: {
    title: "Registry Verification Methodology & Data Standards | UpForge",
    description:
      "The official UpForge verification framework: manual audit stages, UFRN taxonomy, and database integrity guidelines.",
    url: "https://www.upforge.org/methodology",
    siteName: "UpForge",
    images: [{ url: "https://www.upforge.org/og-methodology.png", width: 1200, height: 630 }],
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
      "@id": "https://www.upforge.org/methodology",
      "url": "https://www.upforge.org/methodology",
      "name": "Registry Verification Methodology & Data Standards",
      "description": "The verification methodology and operational guidelines for issuing UFRN credentials on the UpForge global startup registry.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.upforge.org" },
          { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://www.upforge.org/methodology" }
        ]
      }
    }
  ]
}

export default function MethodologyPage() {
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
            Verification Methodology
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#C59A2E] font-bold mt-2">
            The Standards and Guidelines Powering the UpForge Global Registry
          </p>
        </section>

        {/* Main Body Content */}
        <main className="max-w-[900px] mx-auto px-6 py-12 space-y-12">
          
          <section className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-relaxed">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic mb-8">
              "Data integrity is the foundational currency of trust. UpForge operates not as a promotional hub or marketing listing, but as an independent, neutral registrar. Every credential issued is backed by verifiable state records, double-checked by our research team."
            </p>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4">
              1. The Verification Workflow
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-6 font-serif">
              Our registry accepts submissions from verified founders, investors, and public registrars. Before a profile is published and assigned an active UpForge Registry Number (UFRN), it undergoes a multi-stage validation workflow:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 font-sans">
              <div className="border border-foreground p-5 bg-muted/20">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="h-5 w-5 text-[#C59A2E]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Stage 1: Primary Cross-Reference</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We verify incorporation files against state databases (such as the Ministry of Corporate Affairs in India, Delaware Division of Corporations, and local registrars of companies) to confirm legal existence.
                </p>
              </div>

              <div className="border border-foreground p-5 bg-muted/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-[#C59A2E]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Stage 2: Founder Vetting</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We verify founder profiles through public identity channels (LinkedIn, official team bios, company registrations) to check for legitimate control of the entity and prevent fraud.
                </p>
              </div>

              <div className="border border-foreground p-5 bg-muted/20">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="h-5 w-5 text-[#C59A2E]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Stage 3: Data Cleansing</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We check sectors, launch dates, locations, and website status. Descriptions are rewritten to eliminate generic template text and ensure specific corporate definitions.
                </p>
              </div>

              <div className="border border-foreground p-5 bg-muted/20">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-[#C59A2E]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Stage 4: UFRN Issuance</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upon passing all verification checks, the startup is listed, its UFRN is generated, and a downloadable official digital record certificate is made available.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              2. UFRN Taxonomy & Formatting
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-6 font-serif">
              Every verified startup is assigned a unique <strong>UpForge Registry Number (UFRN)</strong>. The UFRN is a structured identifier that details key company information in its taxonomy:
            </p>

            <div className="bg-muted border border-border p-6 rounded-md my-6 font-mono text-xs text-foreground">
              <p className="font-bold mb-3 text-sm text-[#C59A2E]">UFRN Format Example:</p>
              <div className="text-center py-4 bg-background border border-foreground font-bold text-lg tracking-widest text-[#B30000] mb-3">
                UPF-ATH-450X2
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">UPF:</strong> Global prefix designating the UpForge Startup Registry.</li>
                <li><strong className="text-foreground">ATH:</strong> The first three consonants or characters of the verified startup name (e.g., Ather Energy).</li>
                <li><strong className="text-foreground">450X2:</strong> A unique cryptographic hash representing the startup's entry row, country indicator, and index sequence.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              3. Data Sources & Audit Frequency
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4 font-serif">
              We rely on structured, verifiable data pipelines to keep the registry accurate:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-serif text-foreground/80 mb-8">
              <li>
                <strong>Government Filings:</strong> Corporate registries (MCA, SEC, Companies House) are monitored for status changes, name changes, or winding-up events.
              </li>
              <li>
                <strong>Weekly Sheets Sync:</strong> Our primary data cache syncs with the Google Sheets master list every 5 minutes (via cached edge fetches) to capture updates in real-time.
              </li>
              <li>
                <strong>Monthly Profiling Audits:</strong> Key listings (including sponsored and featured profiles) are audited monthly to update funding data, acquisition details, and founder listings.
              </li>
            </ul>

            <h2 className="text-2xl font-bold font-serif border-b border-foreground pb-2 mb-4 mt-10">
              4. Dispute & Corrections Policy
            </h2>
            <p className="text-foreground/90 leading-relaxed mb-4 font-serif">
              We acknowledge that corporate data changes frequently. To maintain registry accuracy:
            </p>
            <ul className="list-disc pl-6 space-y-3 font-serif text-foreground/80 mb-8">
              <li>
                <strong>Founder Claims:</strong> Verified founders can claim their profile to update descriptions, logos, and links directly. All claims require email validation from the company's official domain.
              </li>
              <li>
                <strong>Third-Party Reports:</strong> Investors, researchers, and public users can submit corrections if they spot inaccurate or outdated information on a profile.
              </li>
              <li>
                <strong>Dispute Handling:</strong> Disputed profiles (e.g., disputed founders, IP claims) are marked as "Verification Pending" or temporarily de-indexed until legal documentation resolves the ownership details.
              </li>
            </ul>

            <div className="bg-[#B30000]/5 border-l-4 border-[#B30000] p-6 my-8">
              <h3 className="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#B30000]" /> Submit a Data Correction
              </h3>
              <p className="text-sm text-foreground/80 font-serif leading-relaxed mb-4">
                If you are a founder wishing to claim your profile, or an analyst identifying an error in our registry dataset, please submit a report immediately.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-foreground hover:bg-[#B30000] text-background hover:text-white px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Go to Contact & Support →
              </Link>
            </div>

          </section>
        </main>
      </div>
    </>
  )
}

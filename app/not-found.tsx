import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "404 - Page Not Found | UpForge",
  description: "The page you're looking for doesn't exist or has been moved. Browse verified startups on UpForge.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        
        {/* 404 Number */}
        <div className="text-8xl md:text-9xl font-bold text-[#C59A2E]/20 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
          404
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground" style={{ fontFamily: "'Georgia', serif" }}>
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          It might be a startup that&apos;s no longer listed, or a page that&apos;s been relocated.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/registry"
            className="px-6 py-2.5 bg-[#C59A2E] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#A8821E] transition-colors"
          >
            Browse Registry
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border-2 border-foreground font-bold text-sm uppercase tracking-wider hover:bg-muted transition-colors"
          >
            Go Home
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="border-t-2 border-foreground pt-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/blog" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Journal
            </Link>
            <span className="text-border">·</span>
            <Link href="/submit" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Submit Startup
            </Link>
            <span className="text-border">·</span>
            <Link href="/verify" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Verify UFRN
            </Link>
            <span className="text-border">·</span>
            <Link href="/about" className="text-muted-foreground hover:text-foreground underline transition-colors">
              About
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

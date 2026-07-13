// components/cookie-banner.tsx
"use client"

import { useState, useEffect } from "react"
import { Cookie, Settings2 } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem("upforge_cookie_consent")
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleDecision = (decision: "all" | "essential") => {
    localStorage.setItem("upforge_cookie_consent", decision)
    
    // If 'all', we would perfectly initialize Google Analytics / Tag Manager here
    // as per strict GDPR "prior consent" requirements required by Google Priority indexing
    if (decision === "all") {
      window.dispatchEvent(new Event("upforge_analytics_consent_granted"))
    }
    
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t-2 border-foreground bg-background p-5 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-row items-center gap-4">
          <div className="bg-[#B30000] p-2 rounded-sm hidden sm:block">
            <Cookie className="w-6 h-6 text-white flex-shrink-0" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-sans font-black text-[12px] uppercase tracking-widest text-foreground mb-1">
              Data Collection & Privacy Standard
            </h4>
            <p className="font-serif text-[13px] text-muted-foreground leading-relaxed max-w-3xl">
              We use strictly necessary cookies to operate the registry, and optional analytics trackers to measure global reach. Providing consent allows us to deploy Google Analytics to prioritize search indexing and improve the UFRN ecosystem. <br className="hidden md:block" /> 
              <a href="/legal/privacy" className="underline text-foreground underline-offset-2 hover:text-[#B30000] transition-colors">Read Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => handleDecision("essential")}
            className="w-full sm:w-auto font-sans font-bold text-[10px] tracking-widest uppercase px-5 py-3 border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Settings2 className="w-3 h-3" /> Decline Optional
          </button>
          
          <button 
            onClick={() => handleDecision("all")}
            className="w-full sm:w-auto bg-[#B30000] text-white shadow-md font-sans font-black text-[10px] tracking-[0.15em] uppercase px-8 py-3 hover:bg-[#900000] transition-colors whitespace-nowrap"
          >
            Accept All Cookies
          </button>
        </div>

      </div>
    </div>
  )
}

"use client";

import React from "react";
import Link from "next/link";
import { Scale, Landmark, Gavel, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-background">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-10 pb-24">
        
        {/* ══════════════════════════════════════
              HEADER — Authoritative & Trust-first
        ══════════════════════════════════════ */}
        <section className="border-b border-border max-w-[1300px] mx-auto w-full mt-5 pb-6 flex flex-col items-center text-center">

          <h1
            className="mast-h1 text-3xl md:text-[44px] lg:text-[54px] font-bold leading-[1.05] text-foreground mb-3 max-w-3xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Terms of Registry
          </h1>

          <p className="mast-tagline font-serif italic text-base md:text-[17px] text-muted-foreground max-w-lg mb-5 leading-relaxed">
            The legal framework governing data integrity, UFRN allocation, and institutional utilization of the Global Index.
          </p>

        </section>


        <main className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
            
            {/* Main Legal Content */}
            <div className="space-y-16 text-center md:text-left">


              {/* Section 1 */}
              <section>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="text-3xl font-serif italic text-muted-foreground/40">
                    01
                  </span>

                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                    Binding Acceptance
                  </h2>
                </div>

                <div className="font-serif text-[18px] leading-[1.8] text-foreground space-y-4">
                  <p>
                    Utilization of the UpForge Global Registry constitutes a <strong>legally binding agreement</strong> to these Protocols. Users agree to utilize data solely for lawful due diligence, research, and professional analysis.
                  </p>
                </div>
              </section>


              {/* Section 2 */}
              <section>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="text-3xl font-serif italic text-muted-foreground/40">
                    02
                  </span>

                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                    Data Integrity & UFRN
                  </h2>
                </div>

                <div className="font-serif text-[18px] leading-[1.8] text-foreground space-y-4">
                  <p>
                    Founders are responsible for factual accuracy. Any deliberate misrepresentation results in immediate <strong>UFRN revocation</strong> and permanent exclusion from the Global Index.
                  </p>
                </div>
              </section>


              {/* Section 3 */}
              <section>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="text-3xl font-serif italic text-muted-foreground/40">
                    03
                  </span>

                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                    Intellectual Property
                  </h2>
                </div>

                <div className="font-serif text-[18px] leading-[1.8] text-foreground">
                  <p>
                    The "UpForge" name and "UFRN" system are exclusive intellectual property. Certified entities are granted a limited license to display their Registry Badge while status remains "Verified."
                  </p>
                </div>
              </section>


              {/* Section 4 */}
              <section>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="text-3xl font-serif italic text-muted-foreground/40">
                    04
                  </span>

                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                    Limitation of Liability
                  </h2>
                </div>

                <div className="font-serif text-[18px] leading-[1.8] text-foreground">
                  <p>
                    The registry is provided "as-is." UpForge does not guarantee the future performance of any listed entity. Independent financial auditing is advised for all users.
                  </p>
                </div>
              </section>

            </div>


            {/* Sidebar */}
            <aside className="space-y-8">

              <div className="border border-border p-8 sticky top-10 bg-background text-center md:text-left">

                <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
                  <ShieldCheck className="text-accent w-5 h-5" />

                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">
                    Jurisdiction
                  </h4>
                </div>
                
                <div className="space-y-8">

                  <SidebarItem 
                    icon={<Scale size={18}/>} 
                    title="Statutory Law" 
                    desc="Governed by the IT Act 2000 and data treaty standards." 
                  />

                  <SidebarItem 
                    icon={<Gavel size={18}/>} 
                    title="Exclusive Seat" 
                    desc="Disputes subject to exclusive jurisdiction of Mumbai Courts." 
                  />

                </div>
                
                <div className="pt-8 mt-12 border-t border-border">
                  <Link href="/contact" className="flex items-center justify-between group">
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-accent transition-colors">
                      Legal Inquiry
                    </span>

                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform text-accent"
                    />
                  </Link>
                </div>

                <div className="mt-12 opacity-30 text-center">
                  <img src="/seal.jpg" alt="Official Seal" className="w-20 mx-auto grayscale" />
                </div>

              </div>


              {/* Enforcement panel */}
              <div className="bg-accent p-6 text-background text-center md:text-left">

                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <AlertTriangle size={16} />

                  <h4 className="text-[10px] font-bold uppercase tracking-widest">
                    Enforcement
                  </h4>
                </div>

                <p className="text-[11px] font-serif leading-relaxed opacity-90 italic">
                  Violations lead to legal action and permanent blacklisting on the global ledger.
                </p>

              </div>

            </aside>

          </div>
        </main>


        <footer className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">

          <p className="font-sans font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            UpForge Global • Governance Division
          </p>

          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-foreground">
            <Link href="/privacy" className="hover:text-accent">
              Privacy Protocol
            </Link>

            <Link href="/compliance" className="hover:text-accent">
              Compliance
            </Link>
          </div>

        </footer>

      </div>
    </div>
  );
}


function SidebarItem({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode,
  title: string,
  desc: string
}) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

      <div className="text-accent shrink-0">
        {icon}
      </div>

      <div>
        <h4 className="text-[12px] font-black uppercase tracking-wider mb-1">
          {title}
        </h4>

        <p className="text-[11px] text-muted-foreground leading-snug font-serif italic">
          {desc}
        </p>
      </div>

    </div>
  );
}

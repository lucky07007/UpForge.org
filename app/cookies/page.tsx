"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, BarChart3, EyeOff, Settings2, Info } from "lucide-react";

export default function CookiesPage() {
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
            Cookie Policy
          </h1>

          <p className="mast-tagline font-serif italic text-base md:text-[17px] text-muted-foreground max-w-lg mb-5 leading-relaxed">
            Transparent session management and telemetry standards for the UpForge Global Registry.
          </p>

        </section>


        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 text-[18px] leading-[1.8] font-serif my-16">

          <section className="flex flex-col items-center text-center md:items-start md:text-left">

            <div className="flex items-center gap-4 mb-4">
              <EyeOff className="text-accent" size={24} />

              <h2 className="text-xs font-black font-sans uppercase tracking-[0.3em]">
                01. Core Intent
              </h2>
            </div>

            <p className="text-foreground border-l-0 md:border-l-2 border-border md:pl-6 italic">
              Cookies on UpForge are utilized solely to facilitate secure session management and improve retrieval speed. We do not engage in behavioral advertising or cross-site tracking.
            </p>

          </section>


          <section className="flex flex-col items-center text-center md:items-start md:text-left">

            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="text-accent" size={24} />

              <h2 className="text-xs font-black font-sans uppercase tracking-[0.3em]">
                02. Telemetry
              </h2>
            </div>

            <p className="text-foreground border-l-0 md:border-l-2 border-border md:pl-6 italic">
              We use anonymized telemetry to monitor the health of our intelligence datasets. This data is non-personally identifiable and encrypted at the source.
            </p>

          </section>

        </div>


        {/* Technical Breakdown */}
        <div className="mb-20">

          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center justify-center md:justify-start gap-2">
            <Info size={14} className="text-accent" />
            Disclosure Table
          </h3>

          <div className="border border-border overflow-x-auto">

            <table className="w-full text-center md:text-left border-collapse font-serif min-w-[500px]">

              <thead>
                <tr className="bg-foreground text-background text-[11px] font-sans uppercase tracking-widest">

                  <th className="p-4 border-r border-border text-center md:text-left">
                    Category
                  </th>

                  <th className="p-4 border-r border-border text-center md:text-left">
                    Purpose
                  </th>

                  <th className="p-4 text-center">
                    Duration
                  </th>

                </tr>
              </thead>


              <tbody className="text-sm">

                <tr className="border-b border-border">

                  <td className="p-4 border-r border-border font-bold">
                    Authentication
                  </td>

                  <td className="p-4 border-r border-border">
                    Securing UFRN administrative access.
                  </td>

                  <td className="p-4 uppercase text-[10px] font-sans text-center">
                    Session
                  </td>

                </tr>


                <tr className="border-b border-border">

                  <td className="p-4 border-r border-border font-bold">
                    Preferences
                  </td>

                  <td className="p-4 border-r border-border">
                    Remembering registry filter settings.
                  </td>

                  <td className="p-4 uppercase text-[10px] font-sans text-center">
                    30 Days
                  </td>

                </tr>


                <tr>

                  <td className="p-4 border-r border-border font-bold">
                    Performance
                  </td>

                  <td className="p-4 border-r border-border">
                    CDN optimization for startup logos.
                  </td>

                  <td className="p-4 uppercase text-[10px] font-sans text-center">
                    Persistent
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* User Control Box */}
        <div className="p-8 md:p-10 border-4 border-border bg-muted flex flex-col items-center md:flex-row gap-8 text-center md:text-left">

          <div className="shrink-0 bg-background p-4 border border-border">
            <Settings2 className="text-accent" size={40} />
          </div>

          <div className="max-w-xl">

            <h3 className="text-lg font-black uppercase tracking-widest mb-2 font-sans">
              User Sovereignty
            </h3>

            <p className="text-sm text-muted-foreground font-serif leading-relaxed italic">
              You maintain total control. By modifying your browser settings, you can decline all non-essential tracking. Note that registry features requiring <strong>UFRN Verification</strong> may be functionally limited without session persistence.
            </p>

          </div>

        </div>


        {/* Final Official Stamp */}
        <div className="mt-24 text-center">

          <img
            src="/seal.jpg"
            alt="Official Seal"
            className="w-24 mx-auto mb-4 grayscale opacity-40 hover:opacity-100 transition-opacity"
          />

          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            UpForge Data Integrity Office
          </p>

        </div>

      </div>
    </div>
  );
}

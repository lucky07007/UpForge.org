"use client";

import React, { useState } from "react";
import {
  CheckCircle2, Loader2, Users, Building2, Sparkles,
  ChevronRight, ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── EmailJS Config ───────────────────────────────────────────────────────────
const WORKING_SERVICE_ID  = "service_jwpk5li";
const WORKING_TEMPLATE_ID = "template_ah89eas";
const WORKING_PUBLIC_KEY  = "2N6-20rWXZApcyd_K";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  founder_name: string;
  startup_name: string;
  email: string;
  website: string;
  description: string;
  industry: string;
  founded_year: string;
}

const EMPTY: FormState = {
  founder_name: "",
  startup_name: "",
  email: "",
  website: "",
  description: "",
  industry: "",
  founded_year: new Date().getFullYear().toString(),
};

const STEPS = [
  { label: "Identity",  icon: Users },
  { label: "Details",   icon: Building2 },
];

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="sf-field">
      <label className="sf-label">
        {label} {required && <span style={{ color:"#E53935" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState("");

  const update = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));

  const stepValid = [
    !!(form.founder_name && form.startup_name && form.email),
    !!(form.industry && form.description),
  ];

  const handleSubmit = async () => {
    setIsLoading(true); setError("");
    try {
      // EMAIL 1: Admin notification
      await emailjs.send(
        WORKING_SERVICE_ID,
        WORKING_TEMPLATE_ID,
        {
          name:    form.founder_name,
          title:   form.startup_name,
          email:   "contact@upforge.org",
          phone:   "N/A",
          message: `
UpForge Registry Submission
──────────────────────────────
Founder      : ${form.founder_name}
Company      : ${form.startup_name}
Year Founded : ${form.founded_year}
Sector       : ${form.industry}
Website      : ${form.website || "N/A"}
Description  : ${form.description}
──────────────────────────────
Next step: Review → Approve → Auto-send UFRN to ${form.email}
          `.trim(),
        },
        WORKING_PUBLIC_KEY
      );

      // EMAIL 2: Founder confirmation
      await emailjs.send(
        WORKING_SERVICE_ID,
        WORKING_TEMPLATE_ID,
        {
          name:  form.founder_name,
          title: form.startup_name,
          email: form.email,
          phone: "N/A",
          message: `
Hi ${form.founder_name},

We've successfully received your submission for "${form.startup_name}".

This is more than just a listing — it's a step toward being independently verified and discovered globally. Every startup we review has the potential to become part of something bigger.

Our team will carefully review your request and publish it within 3-5 business days.

This is an automated confirmation, so there's no need to reply — but know that your milestone is officially in motion.

Excited to see you grow,
The UpForge Team
          `.trim(),
        },
        WORKING_PUBLIC_KEY
      );
      
      setStep(2);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return <SuccessScreen startupName={form.startup_name} founderName={form.founder_name} email={form.email} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400;700&display=swap');

        .sf {
          --sf-bg:         var(--background,  #FDFCF8);
          --sf-bg2:        var(--muted,        #F5F2EC);
          --sf-fg:         var(--foreground,   #1C1C1C);
          --sf-fg2:        var(--muted-foreground, #8A8478);
          --sf-fg3:        var(--muted-foreground, #AAA);
          --sf-border:     var(--border,       #E2DDD5);
          --sf-card:       var(--background,   #FDFCF8);
          --sf-gold:       #C59A2E;
          --sf-gold-dark:  #B8872A;
          --sf-invert-bg:  var(--foreground,   #1C1C1C);
          --sf-invert-fg:  var(--background,   #FDFCF8);

          background: var(--sf-bg2);
          color: var(--sf-fg);
          min-height: 100vh;
          padding: 64px 16px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .sf-header {
          border-bottom: 1.5px solid var(--sf-fg);
          padding-bottom: 32px;
          margin-bottom: 48px;
        }
        .sf-h1 {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--sf-fg);
          margin-bottom: 6px;
          line-height: 1.08;
          letter-spacing: -.02em;
        }
        .sf-sub {
          font-family: 'Space Mono', monospace;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.26em; text-transform: uppercase;
          color: var(--sf-fg2);
        }

        .sf-card {
          background: var(--sf-card);
          border: 1px solid var(--sf-border);
        }

        .sf-stepper {
          display: flex; gap: 32px; margin-bottom: 48px;
          overflow-x: auto; padding-bottom: 8px;
          border-bottom: 1px solid var(--sf-border);
        }
        .sf-step-item {
          display: flex; align-items: center; gap: 8px;
          padding-bottom: 16px; border-bottom: 2px solid transparent;
          transition: all 0.2s; opacity: 0.3;
        }
        .sf-step-item.active {
          border-bottom-color: var(--sf-fg);
          opacity: 1;
        }
        .sf-step-num {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          color: var(--sf-fg);
        }
        .sf-step-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: -0.02em; text-transform: uppercase;
          white-space: nowrap; color: var(--sf-fg);
        }

        .sf-field { display: flex; flex-direction: column; gap: 6px; }
        .sf-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--sf-fg2);
        }

        .sf-input, .sf-select, .sf-textarea {
          width: 100%;
          border: 1px solid var(--sf-border);
          background: var(--sf-bg);
          color: var(--sf-fg);
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.18s;
          font-family: inherit;
        }
        .sf-input::placeholder,
        .sf-textarea::placeholder { color: var(--sf-fg3); }
        .sf-input:hover,
        .sf-select:hover,
        .sf-textarea:hover  { border-color: var(--sf-fg2); }
        .sf-input:focus,
        .sf-select:focus,
        .sf-textarea:focus  { border-color: var(--sf-fg); }
        .sf-select {
          appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A8478' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .sf-select option {
          background: var(--sf-bg);
          color: var(--sf-fg);
        }
        .sf-textarea { resize: vertical; }

        .sf-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width: 540px) { .sf-grid2 { grid-template-columns: 1fr; } }
        .sf-stack { display: flex; flex-direction: column; gap: 24px; }

        .sf-btn-primary {
          background: var(--sf-invert-bg); color: var(--sf-invert-fg);
          border: none; padding: 14px 40px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; transition: background 0.18s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .sf-btn-primary:hover:not(:disabled) { background: var(--sf-gold-dark); }
        .sf-btn-primary:disabled { opacity: 0.2; cursor: not-allowed; }

        .sf-btn-gold {
          background: var(--sf-gold); color: #fff;
          border: none; padding: 14px 40px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; transition: background 0.18s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .sf-btn-gold:hover:not(:disabled) { background: var(--sf-gold-dark); }

        .sf-btn-back {
          background: none; border: none;
          font-family: 'Space Mono', monospace;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--sf-fg2); cursor: pointer;
          transition: color 0.18s;
        }
        .sf-btn-back:hover { color: var(--sf-fg); }

        .sf-process-num {
          width: 24px; height: 24px; flex-shrink: 0;
          background: var(--sf-bg2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          color: var(--sf-fg);
        }
        .sf-process-num.gold {
          background: var(--sf-gold); color: #fff;
        }

        .sf-ufrn-box {
          border: 1px solid var(--sf-gold);
          background: var(--sf-card);
          padding: 24px;
        }

        .sf-error {
          font-family: 'Space Mono', monospace;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; color: #E53935;
        }

        .sf-success-wrap {
          min-height: 100vh;
          background: var(--sf-bg2);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .sf-success-card {
          background: var(--sf-card);
          border: 1px solid var(--sf-border);
          padding: 48px; max-width: 480px; width: 100%;
          text-align: center;
        }
        .sf-cert-box {
          border: 1px solid var(--sf-gold);
          background: var(--sf-bg2);
          padding: 20px; margin-bottom: 32px; text-align: left;
        }
      `}</style>

      <div className="sf">
        <div style={{ maxWidth:900, margin:"0 auto" }}>

          <div className="sf-header">
            <h1 className="sf-h1">
              List Your Startup on <span style={{ color:"var(--sf-gold)" }}>UpForge</span>
            </h1>
            <p className="sf-sub">Global Registry — 150+ Countries • Free Listing</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:48 }}
               className="sf-layout">
            <style>{`
              @media(min-width:768px){
                .sf-layout { grid-template-columns: 1fr 280px !important; }
              }
            `}</style>

            {/* Form */}
            <div className="sf-card" style={{ padding:"40px" }}>

              <div className="sf-stepper">
                {STEPS.map((s, i) => (
                  <div key={i} className={`sf-step-item${step === i ? " active" : ""}`}>
                    <span className="sf-step-num">{i + 1}</span>
                    <span className="sf-step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <form style={{ display:"flex", flexDirection:"column", gap:28 }}>
                <AnimatePresence mode="wait">

                  {/* Step 1: Identity */}
                  {step === 0 && (
                    <motion.div key="s0" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                      <div className="sf-grid2">
                        <Field label="Founder Name" required>
                          <input value={form.founder_name} onChange={update("founder_name")} placeholder="Your full name" className="sf-input" />
                        </Field>
                        <Field label="Startup Name" required>
                          <input value={form.startup_name} onChange={update("startup_name")} placeholder="Company name" className="sf-input" />
                        </Field>
                      </div>
                      <div style={{ marginTop:24 }}>
                        <Field label="Work Email" required>
                          <input type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" className="sf-input" />
                        </Field>
                      </div>
                      <div style={{ marginTop:24 }}>
                        <Field label="Website URL">
                          <input type="url" value={form.website} onChange={update("website")} placeholder="https://yourstartup.com" className="sf-input" />
                        </Field>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Details */}
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                      <div className="sf-grid2">
                        <Field label="Industry" required>
                          <select value={form.industry} onChange={update("industry")} className="sf-select">
                            <option value="">Select sector</option>
                            {["AI/ML","SaaS","FinTech","HealthTech","EdTech","D2C","Climate Tech","Enterprise","Other"].map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Founded Year">
                          <input type="number" value={form.founded_year} onChange={update("founded_year")} placeholder="2024" className="sf-input" />
                        </Field>
                      </div>
                      <div style={{ marginTop:24 }}>
                        <Field label="What does your startup do?" required>
                          <textarea value={form.description} onChange={update("description")} placeholder="Briefly describe your product and target market..." rows={3} className="sf-textarea sf-input" />
                        </Field>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && <p className="sf-error">{error}</p>}

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:16 }}>
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="sf-btn-back"
                    style={{ visibility: step === 0 ? "hidden" : "visible" }}
                  >
                    ← Back
                  </button>
                  {step === 0 ? (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={!stepValid[0]}
                      className="sf-btn-primary"
                    >
                      Continue <ChevronRight size={12}/>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="sf-btn-gold"
                    >
                      {isLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin"/> Submitting…</>
                        : "Submit to Registry"
                      }
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <div className="sf-card" style={{ padding:28 }}>
                <p style={{
                  fontFamily:"'Space Mono',monospace", fontSize:10,
                  fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em",
                  color:"var(--sf-fg)", marginBottom:20
                }}>Process</p>
                <ul style={{ display:"flex", flexDirection:"column", gap:20, listStyle:"none", padding:0, margin:0 }}>
                  {[
                    { n:"01", txt:"Submit your startup details", gold:false },
                    { n:"02", txt:"Team reviews within 3–5 days", gold:false },
                    { n:"03", txt:"Receive UFRN credential via email", gold:true },
                    { n:"04", txt:"Go live on global registry", gold:true },
                  ].map((item, i) => (
                    <li key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <span className={`sf-process-num${item.gold ? " gold" : ""}`}>{item.n}</span>
                      <p style={{ fontSize:11, lineHeight:1.6, color:"var(--sf-fg2)", margin:0 }}>{item.txt}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sf-ufrn-box">
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <ShieldCheck size={14} color="var(--sf-gold)" />
                  <p style={{
                    fontFamily:"'Space Mono',monospace", fontSize:10,
                    fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em",
                    color:"var(--sf-gold)", margin:0
                  }}>UFRN Credential</p>
                </div>
                <p style={{ fontSize:11, color:"var(--sf-fg2)", lineHeight:1.6, margin:0 }}>
                  Your unique global registry ID. Share on LinkedIn, pitch decks, and your website. Format: <span style={{ fontFamily:"'Space Mono',monospace", color:"var(--sf-gold)" }}>UF-2026-00001</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({
  startupName, founderName, email,
}: { startupName: string; founderName: string; email: string }) {
  return (
    <>
      <style>{`
        .sf-success-wrap {
          min-height: 100vh;
          background: var(--muted, #F5F2EC);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .sf-success-card {
          background: var(--background, #FDFCF8);
          border: 1px solid var(--border, #E2DDD5);
          padding: 48px; max-width: 480px; width: 100%;
          text-align: center;
        }
        .sf-cert-box {
          border: 1px solid #C59A2E;
          background: var(--muted, #F5F2EC);
          padding: 20px; margin-bottom: 32px; text-align: left;
        }
        .sf-btn-primary-plain {
          background: var(--foreground, #1C1C1C);
          color: var(--background, #FDFCF8);
          border: none; padding: 12px 32px;
          font-family: 'Space Mono', monospace;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          cursor: pointer; transition: background 0.18s;
        }
        .sf-btn-primary-plain:hover { background: #B8872A; }
      `}</style>

      <div className="sf-success-wrap">
        <div className="sf-success-card">
          <CheckCircle2 style={{ width:48, height:48, color:"#C59A2E", margin:"0 auto 24px", display:"block" }} />
          <h2 style={{ fontFamily:"'EB Garamond',Georgia,serif", fontSize:"2rem", marginBottom:16, color:"var(--foreground, #1C1C1C)" }}>
            Submission Received
          </h2>
          <p style={{ color:"var(--muted-foreground, #8A8478)", fontSize:".875rem", lineHeight:1.75, marginBottom:16 }}>
            Thank you, <strong>{founderName.split(" ")[0]}</strong>.{" "}
            <strong>{startupName}</strong> is now in review.
          </p>

          <div className="sf-cert-box">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <ShieldCheck size={14} color="#C59A2E" />
              <p style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:"#C59A2E", margin:0 }}>
                What's Next
              </p>
            </div>
            <p style={{ fontSize:11, color:"var(--muted-foreground, #8A8478)", lineHeight:1.8, margin:0 }}>
              Check your email <strong>{email}</strong> — we just sent a confirmation. Your UFRN credential will arrive within 3-5 business days.
            </p>
          </div>

          <button onClick={() => (window.location.href = "/")} className="sf-btn-primary-plain">
            Explore Registry
          </button>
        </div>
      </div>
    </>
  );
}

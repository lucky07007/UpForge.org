"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { X, Send, Loader2, Minus, RotateCcw, Globe } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

// ─── RICH TEXT ─────────────────────────────────────────────────────────────

function RichText({ text }: { text: string }) {
  const lines = text.split("\n").reduce<string[]>((acc, line, i, arr) => {
    if (line.trim() === "" && i > 0 && arr[i - 1].trim() === "") return acc
    acc.push(line)
    return acc
  }, [])

  const inline = (str: string): React.ReactNode[] =>
    str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={i} style={{ fontWeight: 700, color: "var(--foreground)" }}>{p.slice(2, -2)}</strong>
      if (p.startsWith("*") && p.endsWith("*"))
        return <em key={i} style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>{p.slice(1, -1)}</em>
      if (p.startsWith("`") && p.endsWith("`"))
        return (
          <code key={i} style={{
            background: "var(--muted)", color: "var(--foreground)", padding: "1px 5px",
            fontSize: 10.5, fontFamily: "monospace", border: "1px solid var(--border)",
          }}>
            {p.slice(1, -1)}
          </code>
        )
      return <span key={i}>{p}</span>
    })

  const els: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const t = lines[i].trim()
    if (!t) { els.push(<div key={`s${i}`} style={{ height: 5 }} />); i++; continue }

    if (/^(\d+)[.)]\s/.test(t)) {
      const items: { n: string; text: string }[] = []
      while (i < lines.length) {
        const m = lines[i].trim().match(/^(\d+)[.)]\s+(.+)$/)
        if (!m) break
        items.push({ n: m[1], text: m[2] }); i++
      }
      els.push(
        <div key={`ol${i}`} style={{ display: "flex", flexDirection: "column", gap: 5, margin: "6px 0" }}>
          {items.map((it, ix) => (
            <div key={ix} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, fontFamily: "system-ui", fontSize: 9, fontWeight: 800, color: "#C59A2E", minWidth: 14, paddingTop: 3 }}>
                {it.n}.
              </span>
              <span style={{ fontSize: 12, lineHeight: 1.7, color: "var(--foreground)", fontFamily: "'Georgia', serif" }}>
                {inline(it.text)}
              </span>
            </div>
          ))}
        </div>
      )
      continue
    }

    if (/^[-•]\s/.test(t)) {
      const items: string[] = []
      while (i < lines.length) {
        const m = lines[i].trim().match(/^[-•]\s+(.+)$/)
        if (!m) break
        items.push(m[1]); i++
      }
      els.push(
        <div key={`ul${i}`} style={{ display: "flex", flexDirection: "column", gap: 4, margin: "5px 0" }}>
          {items.map((b, ix) => (
            <div key={ix} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, marginTop: 8, width: 3, height: 3, background: "#C59A2E", display: "inline-block" }} />
              <span style={{ fontSize: 12, lineHeight: 1.7, color: "var(--foreground)", fontFamily: "'Georgia', serif" }}>
                {inline(b)}
              </span>
            </div>
          ))}
        </div>
      )
      continue
    }

    const hm = t.match(/^(#{1,3})\s+(.+)$/)
    if (hm) {
      els.push(
        <p key={`h${i}`} style={{ fontSize: 9, fontWeight: 800, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "system-ui", marginTop: 10, marginBottom: 2 }}>
          {inline(hm[2])}
        </p>
      )
      i++; continue
    }

    if (t === "---") {
      els.push(<div key={`hr${i}`} style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />)
      i++; continue
    }

    els.push(
      <p key={`p${i}`} style={{ fontSize: 12.5, lineHeight: 1.75, color: "var(--foreground)", fontFamily: "'Georgia', serif", margin: 0 }}>
        {inline(t)}
      </p>
    )
    i++
  }

  return <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{els}</div>
}

// ─── TYPING DOTS ─────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, background: "var(--muted-foreground)", display: "inline-block",
          animation: `forgeDot 1.2s ${i * 0.18}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  )
}

// ─── QUICK PROMPTS ────────────────────────────────────────────────────────────

const PROMPTS = [
  { q: "How do I get UF-ID verified?",    cat: "Creators"   },
  { q: "What benefits do featured creators get?", cat: "Benefits" },
  { q: "How are creators discovered?",     cat: "Discovery"  },
  { q: "Can I update my creator profile?", cat: "Support"   },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export function Chatbot() {
  const [isOpen, setIsOpen]       = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [badge, setBadge]         = useState(0)
  const [showTip, setShowTip]     = useState(false)
  const [msgs, setMsgs]           = useState<Message[]>([{
    role: "assistant",
    content: "I'm **forge** — UpForge's creator intelligence AI.\n\nI help creators with:\n- UF-ID verification process\n- Profile management & visibility tips\n- Community growth strategies\n- Creator discovery & trends\n\nHow can I help you today?",
  }])
  const [newIdxs, setNewIdxs] = useState<Set<number>>(new Set())

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 3500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, loading])

  useEffect(() => {
    if (isOpen && !minimized) {
      setShowTip(false)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen, minimized])

  useEffect(() => { if (isOpen) setBadge(0) }, [isOpen])

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    const userMsg: Message = { role: "user", content: msg }
    const nextIdx = msgs.length + 1
    setMsgs(p => [...p, userMsg])
    setNewIdxs(p => new Set(p).add(msgs.length))
    setInput("")
    setLoading(true)
    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, userMsg] }),
      })
      const data = await res.json()
      const reply = data.message ?? data.error ?? "Couldn't process that — please try again."
      setMsgs(p => [...p, { role: "assistant", content: reply }])
      setNewIdxs(p => new Set(p).add(nextIdx))
      if (!isOpen) setBadge(c => c + 1)
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Network issue — please try again." }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, msgs, isOpen])

  const reset = () => {
    setMsgs([{
      role: "assistant",
      content: "I'm **forge** — UpForge's creator intelligence AI.\n\nI help creators with:\n- UF-ID verification process\n- Profile management & visibility tips\n- Community growth strategies\n- Creator discovery & trends\n\nHow can I help you today?",
    }])
    setNewIdxs(new Set())
    setInput("")
  }

  return (
    <>
      <style>{`
        @keyframes forgeDot {
          0%,60%,100% { opacity:.3; transform:translateY(0); }
          30% { opacity:1; transform:translateY(-3px); }
        }
        @keyframes forgeIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes forgeSpin { to { transform:rotate(360deg); } }
        .asc::-webkit-scrollbar{width:2px}
        .asc::-webkit-scrollbar-thumb{background:var(--border)}
        .ap:hover{background:var(--muted)!important;border-color:#C59A2E!important;}
        .ai:focus{outline:none;border-color:#C59A2E!important;}
        .ab:not([disabled]):hover{background:#C59A2E!important;border-color:#C59A2E!important;}
        .ac:hover{color:#C59A2E!important;}
        
        /* FIX: Input text visibility */
        .ai {
          color: #111 !important;
          background: #ffffff !important;
        }
        .ai::placeholder {
          color: #888 !important;
        }
      `}</style>

      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", alignItems:"flex-end" }}>

        {/* ── PANEL ─────────────────────────────────────────────── */}
        {isOpen && (
          <div style={{
            marginBottom: 16,
            borderRadius: 16,
            width: "min(92vw, 356px)",
            height: minimized ? "auto" : "min(530px, 76vh)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            background: "var(--background)",
            border: "1px solid var(--border)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)",
            animation: "forgeIn 0.18s ease forwards",
          }}>

            {/* Header */}
            <div style={{ background:"var(--foreground)", flexShrink:0 }}>
              <div style={{ height:2, background:"var(--foreground)" }} />
              <div style={{ display:"flex", alignItems:"center", padding:"10px 14px", gap:10 }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:28, height:28, overflow:"hidden", border:"1px solid var(--border)", borderRadius:"50%" }}>
                    <Image src="/robot.jpg" alt="forge" width={28} height={28} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} priority />
                  </div>
                  <span style={{ position:"absolute", bottom:0, right:0, width:7, height:7, background:"#000", borderRadius:"50%", border:"1.5px solid #fff" }} />
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Georgia',serif", fontSize:13, fontWeight:700, color:"var(--background)", lineHeight:1 }}>forge</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                    <Globe size={8} style={{ color:"rgba(255,255,255,0.7)" }} />
                    <span style={{ fontSize:9, color:"var(--background)", opacity: 0.8, letterSpacing:"0.12em", fontFamily:"system-ui", textTransform:"uppercase" }}>
                      UpForge Creator Intelligence
                    </span>
                  </div>
                </div>

                <div style={{ display:"flex" }}>
                  {([
                    ["Reset",     <RotateCcw key="r" style={{ width:10, height:10 }} />, reset],
                    [minimized?"Expand":"Minimise", <Minus key="m" style={{ width:10, height:10 }} />, () => setMinimized(v => !v)],
                    ["Close",     <X key="x" style={{ width:10, height:10 }} />,         () => setIsOpen(false)],
                  ] as [string, React.ReactNode, () => void][]).map(([label, icon, fn]) => (
                    <button key={label} onClick={fn} aria-label={label} className="ac"
                      style={{ padding:"4px 5px", background:"none", border:"none", cursor:"pointer", color: "var(--muted-foreground)", display:"flex", alignItems:"center", transition:"color .12s" }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Body */}
            {!minimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} aria-live="polite" className="asc"
                  style={{ flex:1, overflowY:"auto", padding:"14px 14px", display:"flex", flexDirection:"column", gap:10, background:"var(--background)" }}>

                  <div style={{ textAlign:"center", fontSize:9, color:"var(--muted-foreground)", letterSpacing:"0.16em", fontFamily:"system-ui", marginBottom:2 }}>
                    {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase()}
                  </div>

                  {msgs.map((m, idx) => {
                    const isUser = m.role === "user"
                    return (
                      <div key={idx} style={{
                        display:"flex", justifyContent:isUser?"flex-end":"flex-start", alignItems:"flex-end", gap:8,
                        animation: newIdxs.has(idx) ? "forgeIn 0.16s ease forwards" : "none",
                        opacity: newIdxs.has(idx) ? 0 : 1,
                      }}>
                        {!isUser && (
                          <div style={{ width:18, height:18, overflow:"hidden", flexShrink:0, border:"1px solid var(--border)", marginBottom:1 }}>
                            <Image src="/robot.jpg" alt="" width={18} height={18} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                          </div>
                        )}
                        {isUser ? (
                          <div style={{ maxWidth:"78%", padding:"8px 11px", background:"var(--foreground)", borderLeft:"2px solid #C59A2E" }}>
                            <span style={{ fontSize:12.5, color:"var(--background)", fontFamily:"'Georgia',serif", lineHeight:1.65 }}>{m.content}</span>
                          </div>
                        ) : (
                          <div style={{ maxWidth:"85%", padding:"9px 11px", background:"var(--background)", border:"1px solid var(--border)", borderLeft:"2px solid #C59A2E" }}>
                            <RichText text={m.content} />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {loading && (
                    <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                      <div style={{ width:18, height:18, overflow:"hidden", flexShrink:0, border:"1px solid var(--border)" }}>
                        <Image src="/robot.jpg" alt="" width={18} height={18} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                      </div>
                      <div style={{ background:"var(--background)", border:"1px solid var(--border)", borderLeft:"2px solid #C59A2E", padding:"0 10px" }}>
                        <TypingDots />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick prompts - Updated for Creators Community */}
                {msgs.length === 1 && (
                  <div style={{ padding:"9px 14px", borderTop:"1px solid var(--border)", background:"var(--muted)", flexShrink:0 }}>
                    <div style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--muted-foreground)", fontFamily:"system-ui", fontWeight:700, marginBottom:7 }}>
                      Featured Creator Community
                    </div>
                    <div style={{ fontSize:9, color:"var(--muted-foreground)", fontFamily:"system-ui", marginBottom:8, fontStyle:"italic" }}>
                      Creators are discovered from public platforms to support early visibility.
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {PROMPTS.map((p, idx) => (
                        <button key={idx} onClick={() => send(p.q)} className="ap"
                          style={{ textAlign:"left", display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"var(--background)", border:"1px solid var(--border)", cursor:"pointer", transition:"background .12s, border-color .12s" }}>
                          <span style={{ fontSize:7.5, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.18em", color:"#C59A2E", fontFamily:"system-ui", flexShrink:0 }}>{p.cat}</span>
                          <span style={{ fontSize:11.5, color: "var(--muted-foreground)", fontFamily:"'Georgia',serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input - FIXED with explicit colors */}
                <div style={{ padding:"10px 14px", borderTop:"1px solid var(--border)", background:"var(--background)", flexShrink:0 }}>
                  <div style={{ display:"flex", gap:7 }}>
                    <input
                      ref={inputRef}
                      value={input}
                      disabled={loading}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send() } }}
                      placeholder="Ask about creator verification, benefits..."
                      aria-label="Message forge"
                      className="ai"
                      style={{
                        flex:1, padding:"9px 11px", fontSize:12.5,
                        fontFamily:"'Georgia',serif", 
                        background:"#ffffff",  // EXPLICIT WHITE BACKGROUND
                        border:"1px solid var(--border)", 
                        color:"#111111",  // EXPLICIT DARK TEXT
                        outline:"none",
                        transition:"border-color .15s",
                      }}
                    />
                    <button onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send" className="ab"
                      style={{
                        width:37, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                        background: loading || !input.trim() ? "#F2EFE9" : "#111",
                        color:      loading || !input.trim() ? "var(--muted-foreground)"     : "var(--background)",
                        border:"1px solid", borderColor: loading || !input.trim() ? "var(--border)" : "#111",
                        cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                        transition:"background .12s, border-color .12s",
                      }}>
                      {loading
                        ? <Loader2 style={{ width:13, height:13, animation:"forgeSpin 1s linear infinite" }} />
                        : <Send style={{ width:13, height:13 }} />
                      }
                    </button>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                    <span style={{ fontSize:9, color:"var(--muted-foreground)", fontFamily:"system-ui", letterSpacing:"0.08em" }}>
                      forge · Featured Creator Community
                    </span>
                    <span style={{ fontSize:9, color:"var(--border)", fontFamily:"system-ui" }}>⏎ send</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FAB ───────────────────────────────────────────────── */}
        <button
          onClick={() => { setIsOpen(v => !v); setMinimized(false); setShowTip(false) }}
          aria-label="Open forge"
          style={{
            width:52, height:52, borderRadius:"50%", flexShrink:0, cursor:"pointer", overflow:"hidden",
            background:"var(--foreground)", border:"1.5px solid var(--border)",
            boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
            display:"flex", flexDirection:"column", position:"relative",
            transition:"box-shadow .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.25), 0 0 0 4px rgba(0,0,0,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)")}
        >
          {isOpen ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X style={{ width:15, height:15, color:"var(--background)" }} />
            </div>
          ) : (
            <>
              <div style={{ flex:1, overflow:"hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src="/robot.jpg" alt="forge" width={52} height={52} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} priority />
              </div>
            </>
          )}

          {/* Unread badge */}
          {!isOpen && badge > 0 && (
            <span style={{
              position:"absolute", top:-3, right:-3, minWidth:15, height:15,
              background:"#C59A2E", color:"var(--background)", fontSize:8, fontFamily:"system-ui", fontWeight:900,
              border:"1.5px solid white", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px",
            }}>
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </button>
      </div>
    </>
  )
}

// app/compare/page.tsx
import { Metadata } from "next"
import { headers } from "next/headers"
import { CompareClient } from "./compare-client"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 3600

const ALL_COMPARISONS = [
  { name: "Claude vs OpenAI", slug: "/compare/claude-vs-openai", category: "AI Models", description: "Anthropic's Constitutional AI vs OpenAI's GPT — which AI assistant is right for you?", item1: "Claude", item2: "ChatGPT", image: "/claude-vs-openai.jpg", color: "#10A37F", readTime: "8 min", verdict: "Best for Enterprise", trending: true },
  { name: "ChatGPT vs Google Gemini", slug: "/compare/chatgpt-vs-gemini", category: "AI Models", description: "OpenAI vs Google — battle of the AI giants for supremacy in 2026.", item1: "ChatGPT", item2: "Gemini", image: "/chatgpt-vs-gemini.jpg", color: "#4285F4", readTime: "6 min", verdict: "Best for General Use", trending: true },
  { name: "GitHub Copilot vs Cursor AI", slug: "/compare/github-copilot-vs-cursor-ai", category: "Developer Tools", description: "AI code completion giant vs AI-native editor — which transforms your workflow?", item1: "Copilot", item2: "Cursor", image: "/github-copilot-vs-cursor-ai.jpg", color: "#000000", readTime: "7 min", verdict: "Best for Developers", trending: false },
  { name: "Notion vs Coda", slug: "/compare/notion-vs-coda", category: "Productivity", description: "All-in-one workspace comparison — which tool is best for your team's workflow?", item1: "Notion", item2: "Coda", image: "/notion-vs-coda.jpg", color: "#000000", readTime: "5 min", verdict: "Best for Teams", trending: false },
  { name: "Notion vs Obsidian", slug: "/compare/notion-vs-obsidian", category: "Knowledge Management", description: "Cloud workspace vs local knowledge garden — choose your thinking tool.", item1: "Notion", item2: "Obsidian", image: "/notion-vs-obsidian.jpg", color: "#7C3AED", readTime: "6 min", verdict: "Best for PKM", trending: true },
  { name: "Figma vs Sketch", slug: "/compare/figma-vs-sketch", category: "Design Tools", description: "Which UI/UX design tool is right for your team in 2026? Full comparison.", item1: "Figma", item2: "Sketch", image: "/figma-vs-sketch.jpg", color: "#A259FF", readTime: "5 min", verdict: "Best for Collaboration", trending: false },
  { name: "Canva vs CapCut", slug: "/compare/canva-vs-capcut", category: "Creative Tools", description: "Design platform vs video editing powerhouse — which creative tool fits you?", item1: "Canva", item2: "CapCut", image: "/canva-vs-capcut.jpg", color: "#7B2CBF", readTime: "4 min", verdict: "Best for Creators", trending: false },
  { name: "Slack vs Microsoft Teams", slug: "/compare/slack-vs-teams", category: "Collaboration", description: "Which team communication platform wins for your organization in 2026?", item1: "Slack", item2: "Teams", image: "/slack-vs-teams.jpg", color: "#4A154B", readTime: "7 min", verdict: "Best for Startups", trending: false },
  { name: "Zoom vs Google Meet", slug: "/compare/zoom-vs-google-meet", category: "Video Conferencing", description: "Best video meeting platform for 2026 — features, pricing, and verdict.", item1: "Zoom", item2: "Google Meet", image: "/zoom-vs-google-meet.jpg", color: "#0B5CFF", readTime: "5 min", verdict: "Best for Business", trending: false },
  { name: "iPhone vs Samsung", slug: "/compare/iphone-vs-samsung", category: "Smartphones", description: "iPhone 17 Pro Max vs Galaxy S25 Ultra — which flagship phone wins?", item1: "iPhone", item2: "Galaxy", image: "/iphone-vs-samsung.jpg", color: "#000000", readTime: "8 min", verdict: "Best for Ecosystem", trending: true },
  { name: "Fiverr vs Upwork", slug: "/compare/fiverr-vs-upwork", category: "Freelance Platforms", description: "Which freelance marketplace is best for your career or business in 2026?", item1: "Fiverr", item2: "Upwork", image: "/fiverr-vs-upwork.jpg", color: "#1DBF73", readTime: "6 min", verdict: "Best for Freelancers", trending: false },
  { name: "Stripe vs Razorpay", slug: "/compare/stripe-vs-razorpay", category: "Payment Gateways", description: "Global payments giant vs India's fintech champion — which fits your business?", item1: "Stripe", item2: "Razorpay", image: "/stripe-vs-razorpay.jpg", color: "#635BFF", readTime: "5 min", verdict: "Best for India", trending: false },
  { name: "Meta Quest vs Apple Vision Pro", slug: "/compare/meta-quest-vs-apple-vision-pro", category: "VR Headsets", description: "Meta Quest 4 vs Apple Vision Pro 2 — immersive computing battle.", item1: "Meta Quest", item2: "Vision Pro", image: "/meta-quest-vs-apple-vision-pro.jpg", color: "#0066FF", readTime: "7 min", verdict: "Best for Gaming", trending: true },
  { name: "Docker vs Podman", slug: "/compare/docker-vs-podman", category: "Developer Tools", description: "Containerization showdown — Docker vs Podman for modern DevOps.", item1: "Docker", item2: "Podman", image: "/docker-vs-podman.jpg", color: "#2496ED", readTime: "6 min", verdict: "Best for Security", trending: false },
  { name: "Kubernetes vs Docker Swarm", slug: "/compare/kubernetes-vs-docker-swarm", category: "DevOps", description: "Orchestration battle — which container management platform scales better?", item1: "Kubernetes", item2: "Docker Swarm", image: "/kubernetes-vs-docker-swarm.jpg", color: "#326CE5", readTime: "8 min", verdict: "Best for Enterprise", trending: false },
  { name: "AWS vs Azure vs GCP", slug: "/compare/aws-vs-azure-vs-gcp", category: "Cloud Platforms", description: "The ultimate cloud showdown — AWS, Azure, or Google Cloud in 2026?", item1: "AWS", item2: "Azure vs GCP", image: "/aws-vs-azure-vs-gcp.jpg", color: "#FF9900", readTime: "10 min", verdict: "Best Overall: AWS", trending: true },
  { name: "Vercel vs Netlify", slug: "/compare/vercel-vs-netlify", category: "Web Hosting", description: "Jamstack deployment giants — which hosting platform for your next project?", item1: "Vercel", item2: "Netlify", image: "/vercel-vs-netlify.jpg", color: "#000000", readTime: "6 min", verdict: "Best for Next.js", trending: false },
  { name: "Linear vs Jira", slug: "/compare/linear-vs-jira", category: "Project Management", description: "Modern issue tracking vs enterprise giant — which PM tool wins?", item1: "Linear", item2: "Jira", image: "/linear-vs-jira.jpg", color: "#5E6AD2", readTime: "5 min", verdict: "Best for Startups", trending: false },
  { name: "Supabase vs Firebase", slug: "/compare/supabase-vs-firebase", category: "Backend Platforms", description: "Open-source Firebase alternative vs Google's BaaS — database showdown.", item1: "Supabase", item2: "Firebase", image: "/supabase-vs-firebase.jpg", color: "#3ECF8E", readTime: "7 min", verdict: "Best Open Source", trending: true },
  { name: "Next.js vs Remix", slug: "/compare/nextjs-vs-remix", category: "Web Frameworks", description: "React meta-framework battle — Next.js 15 vs Remix 3 in production.", item1: "Next.js", item2: "Remix", image: "/nextjs-vs-remix.jpg", color: "#000000", readTime: "7 min", verdict: "Best Ecosystem", trending: false },
  { name: "TypeScript vs JavaScript", slug: "/compare/typescript-vs-javascript", category: "Programming Languages", description: "Should you use TypeScript or vanilla JavaScript? Full 2026 comparison.", item1: "TypeScript", item2: "JavaScript", image: "/typescript-vs-javascript.jpg", color: "#3178C6", readTime: "6 min", verdict: "Best for Scale", trending: false },
  { name: "Rust vs Go", slug: "/compare/rust-vs-go", category: "Programming Languages", description: "Systems programming showdown — Rust's safety vs Go's simplicity.", item1: "Rust", item2: "Go", image: "/rust-vs-go.jpg", color: "#DEA584", readTime: "8 min", verdict: "Best Performance", trending: true },
  { name: "Tailwind CSS vs Bootstrap", slug: "/compare/tailwind-vs-bootstrap", category: "CSS Frameworks", description: "Utility-first vs component framework — which CSS approach wins in 2026?", item1: "Tailwind CSS", item2: "Bootstrap", image: "/tailwind-vs-bootstrap.jpg", color: "#06B6D4", readTime: "5 min", verdict: "Best DX", trending: false },
  { name: "VS Code vs JetBrains", slug: "/compare/vscode-vs-jetbrains", category: "Developer Tools", description: "Code editor vs full IDE — which development environment is right for you?", item1: "VS Code", item2: "JetBrains", image: "/vscode-vs-jetbrains.jpg", color: "#007ACC", readTime: "6 min", verdict: "Best Free Option", trending: false }
]

const categories = [...new Set(ALL_COMPARISONS.map(c => c.category))]

async function getDomain(): Promise<"org" | "in"> {
  const headersList = await headers()
  const context = headersList.get("x-upforge-domain")
  if (context === "org" || context === "in") return context as "org" | "in"
  const host = headersList.get("host") ?? ""
  return host.includes("upforge.org") ? "org" : "in"
}

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = "https://www.upforge.in/compare"
  return {
    title: `Compare ${ALL_COMPARISONS.length}+ Tools & AI Models (2026) | Side-by-Side Analysis | UpForge`,
    description: `Expert comparisons of ${ALL_COMPARISONS.length}+ tools, AI models, SaaS & developer platforms. Claude vs OpenAI, Notion vs Coda. Make smarter decisions.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: "Compare Best Tools & AI Models (2026) | UpForge",
      description: `Detailed side-by-side comparisons of ${ALL_COMPARISONS.length}+ tools.`,
      url: canonicalUrl,
      siteName: "UpForge",
      type: "website"
    },
    robots: { index: true, follow: true }
  }
}

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tool & AI Model Comparisons 2026 | UpForge",
          description: `Expert comparisons of ${ALL_COMPARISONS.length}+ tools.`,
          url: "https://www.upforge.in/compare"
        }}
      />
      <CompareClient comparisons={ALL_COMPARISONS} categories={categories} />
    </>
  )
}

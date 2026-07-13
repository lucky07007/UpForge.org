// app/creators/page.tsx

import { Metadata } from "next"
import { CreatorsClient } from "./creators-client"

export const revalidate = 0
export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "UpForge Creator Community — Grow Together on Instagram",
    description:
      "Join the UpForge Verified Creator Community. Submit your profile, get featured in the daily spotlight, and connect with fellow Instagram creators to grow together.",
    keywords: [
      "instagram creator community",
      "verified creator community",
      "creator spotlight",
      "grow on instagram",
      "creator network india",
      "digital creators community",
    ],
    alternates: {
      canonical: "https://upforge.org/creators",
    },
    openGraph: {
      title: "UpForge Creator Community — Grow Together on Instagram",
      description:
        "Submit your profile, get featured daily, and support other creators. A free community for Instagram creators.",
      type: "website",
      url: "https://upforge.org/creators",
    },
  }
}

export default function CreatorsPage() {
  return <CreatorsClient />
}

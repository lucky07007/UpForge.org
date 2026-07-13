import { RegistryGridSkeleton } from "@/components/LoadingSkeletons"

export default function RegistryLoading() {
  return (
    <div className="max-w-[1300px] mx-auto px-4 py-12">
      <div className="h-8 w-64 bg-muted rounded animate-pulse mb-8" />
      <RegistryGridSkeleton />
    </div>
  )
}

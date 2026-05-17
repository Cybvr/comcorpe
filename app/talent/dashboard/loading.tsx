import { Skeleton } from "@/components/ui/skeleton"

export default function TalentDashboardLoading() {
  return (
    <div className="px-6 py-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-border rounded-full px-4 py-2">
            <Skeleton className="w-3.5 h-3.5 rounded-full bg-primary/20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-8" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>

      {/* Welcome Banner (Dark Block) */}
      <section className="bg-foreground rounded-xl p-6 mb-8 relative overflow-hidden">
        <Skeleton className="h-3.5 w-36 bg-background/20 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background/[0.08] rounded-lg p-4 flex flex-col gap-3 border border-background/[0.12]">
              <Skeleton className="w-5 h-5 rounded bg-primary/20" />
              <Skeleton className="h-4.5 w-36 bg-background/20" />
              <Skeleton className="h-7 w-24 rounded-full bg-background/10" />
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-8">
          
          {/* Newest matches */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-xl p-5 bg-background space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-4.5 w-36" />
                        <Skeleton className="h-3.5 w-48" />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-right shrink-0">
                      <Skeleton className="h-4.5 w-16 ml-auto" />
                      <Skeleton className="h-3.5 w-20 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5.5 w-14 rounded-sm" />
                    <Skeleton className="h-5.5 w-16 rounded-sm" />
                    <Skeleton className="h-5.5 w-12 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Assigned Work */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-3">
              {[1].map((i) => (
                <div key={i} className="border border-border rounded-xl p-5 bg-background space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-4.5 w-36" />
                        <Skeleton className="h-3.5 w-48" />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-right shrink-0">
                      <Skeleton className="h-4.5 w-16 ml-auto" />
                      <Skeleton className="h-3.5 w-20 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5.5 w-14 rounded-sm" />
                    <Skeleton className="h-5.5 w-16 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Spaces you might like */}
          <section className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="border border-border rounded-xl p-4 bg-background flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </section>

          {/* Top operators */}
          <section className="space-y-4">
            <Skeleton className="h-6 w-60" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="border border-border rounded-xl p-4 bg-background flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Referral card */}
          <section className="border border-border rounded-xl p-6 bg-border/40 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5.5 w-48" />
              <Skeleton className="h-4.5 w-full" />
              <Skeleton className="h-4.5 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8.5 flex-1 rounded-lg" />
              <Skeleton className="h-8.5 w-16 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6.5 w-14 rounded-full" />
              <Skeleton className="h-6.5 w-14 rounded-full" />
              <Skeleton className="h-6.5 w-14 rounded-full" />
            </div>
          </section>
        </div>

        {/* Right Sidebar - Growth Community */}
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Composer Box */}
          <div className="border border-border rounded-xl p-4 bg-background">
            <div className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full shrink-0" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </div>

          {/* Post list */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-xl p-4 bg-background space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-2.5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                </div>
                <div className="flex gap-4 pt-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="h-11 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  )
}

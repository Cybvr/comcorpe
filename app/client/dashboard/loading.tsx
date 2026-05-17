import { Skeleton } from "@/components/ui/skeleton"

export default function ClientDashboardLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1280px] mx-auto animate-pulse">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 uppercase tracking-widest bg-primary/10" />
            <Skeleton className="h-9 w-64 sm:w-80" />
            <Skeleton className="h-4 w-72 sm:w-96 mt-1" />
          </div>
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Main Content Area */}
        <div className="space-y-10">

          {/* Slack Messages Feed */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="bg-background border border-border rounded-2xl divide-y divide-muted overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-5 flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3.5 w-16" />
                      </div>
                      <Skeleton className="h-3.5 w-12" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-5/6" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-muted/30 flex justify-center">
                <Skeleton className="h-3.5 w-48" />
              </div>
            </div>
          </section>

          {/* Active Work / Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-background border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-16" />
                        <span className="text-border">•</span>
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-muted">
                    <div className="space-y-1 md:text-right">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="w-24 h-1.5 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Pods */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border border-border rounded-xl p-5 bg-background space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-12 rounded-sm" />
                  </div>
                  
                  {/* Squad members skeletons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="aspect-square rounded-md" />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-muted">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-4.5 w-4.5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Stats Area */}
        <aside className="space-y-8">
          {/* Active Stats (Commercial Health) - matching dark wrapper */}
          <div className="bg-foreground rounded-2xl p-6 space-y-6">
            <Skeleton className="h-5 w-36 bg-background/20" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-36 bg-background/15" />
                <Skeleton className="h-3.5 w-8 bg-background/20" />
              </div>
              <Skeleton className="h-1.5 w-full bg-background/10" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-background/15" />
                <Skeleton className="h-5 w-20 bg-background/20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-background/15" />
                <Skeleton className="h-5 w-10 bg-background/20" />
              </div>
            </div>
          </div>

          {/* Recent Invoices / Activity */}
          <section className="space-y-3">
            <Skeleton className="h-5 w-28 px-1" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-background border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-16" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2.5 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-3.5 w-14" />
                </div>
              ))}
            </div>
          </section>

          {/* Help / Resources */}
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-44 bg-primary/20" />
              <Skeleton className="h-3.5 w-full bg-primary/10" />
              <Skeleton className="h-3.5 w-3/4 bg-primary/10" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg bg-primary/20" />
          </div>
        </aside>
      </div>
    </div>
  )
}

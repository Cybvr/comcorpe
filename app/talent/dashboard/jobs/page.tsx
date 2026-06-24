'use client'

import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { Skeleton } from '@/components/ui/skeleton'
import { useJobs } from '@/lib/jobs'
import { useCurrentUser } from '@/lib/user'

export default function TalentJobsPage() {
  const { jobs, loading: jobsLoading } = useJobs()
  const { user, loading: userLoading } = useCurrentUser()

  const loading = jobsLoading || userLoading

  if (loading) {
    return (
      <div className="mx-auto max-w-[1240px] px-4 py-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="mb-8 max-w-[1040px] rounded-2xl bg-muted p-1.5">
          <div className="flex flex-col gap-2 lg:flex-row">
            <Skeleton className="h-12 flex-1 rounded-xl bg-background" />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex max-w-[1040px] flex-col gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-background p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <Skeleton className="h-10 w-10 rounded-lg sm:h-11 sm:w-11" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-2/3" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-sm" />
                    <Skeleton className="h-5 w-20 rounded-sm" />
                    <Skeleton className="h-5 w-14 rounded-sm" />
                  </div>
                </div>
                <div className="hidden space-y-2 text-right sm:block">
                  <Skeleton className="ml-auto h-5 w-16" />
                  <Skeleton className="ml-auto h-4 w-28" />
                  <Skeleton className="ml-auto h-3 w-20" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 border-t border-border/50 pt-3 sm:hidden">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="ml-auto h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const assignedSlugs = user?.assignedJobSlugs ?? []
  const matchedJobs = jobs.filter(j => assignedSlugs.includes(j.slug))

  return (
    <TalentJobsBoard
      title="My matches"
      jobs={matchedJobs}
      countLabel={`${matchedJobs.length} match${matchedJobs.length !== 1 ? 'es' : ''}`}
      variant="discover"
      searchPlaceholder="Search matches..."
      emptyLabel="matches"
    />
  )
}

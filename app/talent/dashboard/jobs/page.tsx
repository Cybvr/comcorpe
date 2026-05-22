'use client'

import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { useJobs } from '@/lib/jobs'
import TalentDashboardLoading from '../loading'

export default function TalentJobsPage() {
  const { jobs, loading } = useJobs()

  if (loading) {
    return <TalentDashboardLoading />
  }

  return (
    <TalentJobsBoard
      title="Jobs"
      jobs={jobs}
      countLabel={`${jobs.length} matches`}
      variant="discover"
      searchPlaceholder="Search roles..."
      emptyLabel="matches"
    />
  )
}

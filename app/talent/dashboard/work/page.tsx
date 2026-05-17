'use client'

import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { useJobs } from '@/lib/jobs-client'
import { useCurrentUser } from '@/lib/user-client'
import TalentDashboardLoading from '../loading'

export default function WorkPage() {
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { jobs, loading: jobsLoading } = useJobs()

  if (userLoading || jobsLoading || !currentUser) {
    return <TalentDashboardLoading />
  }

  const assignedSlugs = currentUser.assignedJobSlugs ?? []
  const assignedJobs = jobs.filter((job) => assignedSlugs.includes(job.slug))

  return (
    <TalentJobsBoard
      title="My work"
      jobs={assignedJobs}
      countLabel={`${assignedJobs.length} assigned`}
      variant="assigned"
      searchPlaceholder="Search assigned work..."
      emptyLabel="assigned jobs"
    />
  )
}

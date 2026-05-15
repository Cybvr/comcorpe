import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { jobs } from '@/lib/jobs'
import { currentUser } from '@/lib/user'

export default function WorkPage() {
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

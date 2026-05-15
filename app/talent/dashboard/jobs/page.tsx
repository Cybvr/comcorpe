import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { jobs } from '@/lib/jobs'

export default function TalentJobsPage() {
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

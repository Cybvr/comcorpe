'use client'

import { useState, useEffect } from 'react'
import TalentJobsBoard from '@/components/dashboard/TalentJobsBoard'
import { getJobs } from '@/lib/admin/store'
import type { Job } from '@/lib/jobs'

export default function TalentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

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

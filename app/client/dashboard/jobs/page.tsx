import JobCard from '@/components/dashboard/JobCard'
import { jobs } from '@/lib/jobs'

export default function JobsPage() {
  return (
    <div className="px-8 py-8 max-w-[960px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Jobs</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Open matches</h1>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} baseHref="/client/dashboard/jobs" />
        ))}
      </div>
    </div>
  )
}

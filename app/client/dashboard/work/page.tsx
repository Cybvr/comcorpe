import ApplicationCard from '@/components/dashboard/ApplicationCard'
import { applications } from '@/lib/applications'

export default function WorkPage() {
  return (
    <div className="px-8 py-8 max-w-[900px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">My work</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Applications and active work</h1>
      </div>

      <div className="flex flex-col gap-3">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  )
}

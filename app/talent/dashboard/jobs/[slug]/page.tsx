import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { getJobBySlug, jobs } from '@/lib/jobs'

export function generateStaticParams() {
  return jobs.map((job) => ({
    slug: job.slug,
  }))
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  return (
    <div className="px-8 py-8 max-w-[980px] mx-auto">
      <Link href="/talent/dashboard/jobs" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to jobs
      </Link>

      <div className="border border-ink-10 rounded-xl p-8 bg-paper">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-3">{job.type}</p>
            <h1 className="font-display font-black text-[40px] tracking-[-0.03em] text-ink leading-none">{job.client}</h1>
            <p className="font-display font-black text-[22px] tracking-[-0.02em] text-ink mt-3">{job.title}</p>
            <p className="font-text text-[16px] leading-relaxed text-ink-60 mt-5 max-w-[62ch]">{job.summary}</p>
          </div>

          <div className="shrink-0 min-w-[220px] border border-ink-10 rounded-xl p-5">
            <div className="font-display font-black text-[22px] tracking-[-0.02em] text-ink">{job.rate}</div>
            <div className="flex items-center gap-2 text-ink-60 text-sm mt-4">
              <MapPin size={14} /> {job.location}
            </div>
            <div className="flex items-center gap-2 text-ink-60 text-sm mt-2">
              <Clock size={14} /> {job.time}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          {job.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 px-2 py-1 border border-ink-10 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-10">
          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Scope</h2>
            <div className="flex flex-col gap-3">
              {job.scope.map((item) => (
                <div key={item} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Good fit</h2>
            <div className="flex flex-col gap-3">
              {job.requirements.map((item) => (
                <div key={item} className="border border-ink-10 rounded-lg p-4 font-text text-sm text-ink-60">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-10 flex justify-end">
          <button className="font-text text-sm font-semibold px-5 py-3 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]">
            Submit interest
          </button>
        </div>
      </div>
    </div>
  )
}

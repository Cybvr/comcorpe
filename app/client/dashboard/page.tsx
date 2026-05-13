import Link from 'next/link'
import {
  AlertCircle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CreditCard,
} from 'lucide-react'
import {
  clientDecisions,
  clientPodRecommendations,
} from '@/lib/client-dashboard'
import { jobs } from '@/lib/jobs'
import { clientInvoices } from '@/lib/invoices'
import { currentUser } from '@/lib/user'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
}

const invoiceStatusStyles = {
  Paid: 'bg-green-600/10 text-green-700 border-green-600/20',
  Due: 'bg-amber-100 text-amber-700 border-amber-200',
  Draft: 'bg-ink-10 text-ink-60 border-ink-20',
}

export default function ClientDashboardPage() {
  // Filter unified jobs by current user's company
  const myJobs = jobs.filter(j => j.client === currentUser.company)
  
  // Categorize jobs for the dashboard view
  const myBriefs = myJobs.filter(j => j.status === 'Scoping' || j.status === 'Pod review')
  const myProjects = myJobs.filter(j => j.status === 'Active')
  const myDecisions = clientDecisions.filter(d => myJobs.some(j => j.title === d.related))
  const myInvoices = clientInvoices.filter(i => i.label.includes(currentUser.company))

  const primaryBriefs = myBriefs.slice(0, 3)
  const primaryPods = clientPodRecommendations.slice(0, 2)

  // Dynamic metrics
  const dynamicMetrics = [
    { 
      label: 'Active briefs', 
      value: myBriefs.length.toString(), 
      meta: `${myBriefs.filter(b => b.status === 'Pod review').length} ready for pod review` 
    },
    { 
      label: 'Live projects', 
      value: myProjects.length.toString(), 
      meta: `${myProjects.length} currently live`
    },
    { 
      label: 'Recommended pods', 
      value: '2', 
      meta: 'Across fintech, growth, trust' 
    },
    { 
      label: 'Open invoices', 
      value: `$${(myInvoices.reduce((acc, inv) => acc + parseInt(inv.amount.replace(/[^0-9]/g, '')), 0) / 1000).toFixed(1)}k`, 
      meta: 'Next due Jan 31' 
    },
  ]

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1240px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Client cockpit</p>
          <h1 className="font-display font-black text-[34px] tracking-[-0.03em] text-ink leading-none">
            Hi, {currentUser.name}. Here is what needs movement.
          </h1>
        </div>
        <Link
          href="/client/dashboard/jobs"
          className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms] shrink-0"
        >
          Review briefs
        </Link>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        {dynamicMetrics.map((metric) => (
          <article key={metric.label} className="border border-ink-10 rounded-xl p-5 bg-paper">
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-3">{metric.label}</p>
            <div className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">{metric.value}</div>
            <p className="font-text text-sm text-ink-60 mt-3">{metric.meta}</p>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-8">
          <section className="bg-ink rounded-xl p-6 dark-inv-section relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
              <div>
                <p className="font-mono text-xs text-paper/50 uppercase tracking-eyebrow mb-2">Pending decisions</p>
                <h2 className="font-display font-black text-[24px] tracking-[-0.03em] text-paper leading-tight">
                  Decisions that unblock the work
                </h2>
              </div>
              <AlertCircle size={24} strokeWidth={1.5} className="text-blue shrink-0" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
              {myDecisions.map((decision) => (
                <Link
                  key={decision.id}
                  href={decision.href}
                  className="bg-paper/[0.08] rounded-lg p-4 border border-paper/[0.12] hover:bg-paper/[0.14] transition-colors group"
                >
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-blue">{decision.urgency}</span>
                  <h3 className="font-display font-black text-[15px] leading-tight text-paper mt-2 group-hover:text-blue transition-colors">
                    {decision.title}
                  </h3>
                  <p className="font-text text-xs leading-relaxed text-paper/60 mt-2">{decision.body}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Active briefs</h2>
              <Link href="/client/dashboard/jobs" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
                View all briefs <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {primaryBriefs.map((brief) => (
                <Link
                  key={brief.id}
                  href={`/client/dashboard/jobs/${brief.slug}`}
                  className="border border-ink-10 rounded-xl p-5 bg-paper hover:border-ink-20 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <Briefcase size={18} strokeWidth={1.5} className="text-blue shrink-0" />
                    <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[brief.status]}`}>
                      {brief.status}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mb-2">{brief.client}</p>
                  <h3 className="font-display font-black text-[17px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">
                    {brief.title}
                  </h3>
                  <p className="font-text text-xs leading-relaxed text-ink-60 mt-3 line-clamp-3">{brief.summary}</p>
                  <div className="mt-5 pt-4 border-t border-ink-10 flex items-center justify-between gap-3">
                    <span className="font-text text-xs text-ink-40">{brief.updatedAt}</span>
                    <ArrowUpRight size={14} className="text-ink-40 group-hover:text-blue transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Recommended pods</h2>
              <Link href="/client/dashboard/community" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
                View talent pods <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {primaryPods.map((pod) => (
                <Link
                  key={pod.id}
                  href={`/client/dashboard/community/${pod.slug}`}
                  className="border border-ink-10 rounded-xl p-5 bg-paper hover:border-ink-20 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center font-display font-black text-[12px] text-paper shrink-0">
                      {pod.leadInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-blue">{pod.fit}</span>
                        <span className="font-text text-xs text-ink-40">{pod.availability}</span>
                      </div>
                      <h3 className="font-display font-black text-[17px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">
                        {pod.name}
                      </h3>
                      <p className="font-text text-xs leading-relaxed text-ink-60 mt-2">{pod.summary}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Active work</h2>
              <Link href="/client/dashboard/work" className="font-text text-xs text-blue hover:underline">View all</Link>
            </div>
            <div className="flex flex-col gap-3">
              {myProjects.map((project) => (
                <Link
                  key={project.id}
                  href="/client/dashboard/work"
                  className="border border-ink-10 rounded-xl p-4 bg-paper hover:border-ink-20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight">{project.title}</h3>
                      <p className="font-text text-xs text-ink-60 mt-1">{project.phase}</p>
                    </div>
                    <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="h-1.5 bg-ink-10 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <p className="font-text text-xs text-ink-40 mt-3">Next review: {project.nextReview}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Billing</h2>
              <Link href="/client/dashboard/billing" className="font-text text-xs text-blue hover:underline">Open billing</Link>
            </div>
            <div className="flex flex-col gap-3">
              {myInvoices.slice(0, 2).map((invoice) => (
                <article key={invoice.id} className="border border-ink-10 rounded-xl p-4 bg-paper">
                  <div className="flex items-start justify-between gap-3">
                    <CreditCard size={16} strokeWidth={1.5} className="text-blue shrink-0 mt-0.5" />
                    <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${invoiceStatusStyles[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight mt-3">{invoice.label}</h3>
                  <div className="font-display font-black text-[24px] tracking-[-0.03em] text-ink leading-none mt-3">{invoice.amount}</div>
                  <p className="font-text text-xs text-ink-60 mt-2">{invoice.due}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border border-ink-10 rounded-xl p-5 bg-ink-10/40">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                <CheckCircle2 size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display font-black text-[17px] tracking-[-0.01em] text-ink leading-tight">Client operating rhythm</h2>
                <p className="font-text text-sm text-ink-60 mt-2">
                  Review decisions, approve pod movement, and keep every active engagement moving from this cockpit.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

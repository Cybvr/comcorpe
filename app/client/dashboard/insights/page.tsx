import Link from 'next/link'
import { ArrowRight, Search as SearchIcon } from 'lucide-react'
import { clientInsights, growthConsultingHeadlines } from '@/lib/client-insights'

export default function ClientInsightsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Insights & Strategies</p>
        <h1 className="font-display font-black text-[36px] tracking-[-0.03em] text-foreground leading-none">Operational Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-10">
        <section className="flex flex-col gap-6">
          <div className="relative mb-2">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search operational growth, transformation, or playbooks..."
              className="w-full pl-12 pr-4 py-3 bg-border/40 border border-transparent rounded-xl focus:outline-none focus:border-input transition-all font-text text-[15px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientInsights.map((insight) => {
              return (
                <article 
                  key={insight.id} 
                  className="group relative flex flex-col border border-border rounded-2xl bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
                >
                  <Link href={`/client/dashboard/insights/${insight.slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View insight</span>
                  </Link>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] px-2 py-1 bg-primary/10 text-primary rounded uppercase tracking-wider font-bold">
                        {insight.badge}
                      </span>
                      <span className="font-text text-xs text-muted-foreground">{insight.category}</span>
                    </div>

                    <h3 className="font-display font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                      {insight.title}
                    </h3>

                    <p className="font-text text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {insight.body}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <span className="font-text text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        View insight
                      </span>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground mb-2">On the Web</h2>
          <ul className="border-y border-border divide-y divide-border">
            {growthConsultingHeadlines.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start justify-between gap-4 py-2.5 hover:text-primary transition-colors"
                >
                  <span className="block">
                    <span className="block font-text text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                      {item.headline}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

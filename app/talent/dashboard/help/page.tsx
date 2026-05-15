import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { helpTopics } from '@/lib/help'

export default function HelpPage() {
  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Help centre</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Support topics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {helpTopics.map((topic) => (
          <Link key={topic.id} href={`/talent/dashboard/help/${topic.slug}`} className="group border border-ink-10 rounded-xl p-5 bg-paper hover:border-blue transition-colors">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink leading-tight group-hover:text-blue transition-colors">{topic.title}</h2>
              <ArrowUpRight size={15} strokeWidth={1.5} className="text-ink-20 group-hover:text-blue shrink-0 transition-colors" />
            </div>
            <p className="font-text text-sm text-ink-60 mt-3">{topic.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

import { HelpCircle } from 'lucide-react'
import { clientHelpTopics } from '@/lib/client-dashboard'

export default function HelpPage() {
  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Help centre</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Client support topics</h1>
        <p className="font-text text-sm text-ink-60 mt-3 max-w-[62ch]">
          Quick reference for submitting briefs, reviewing pods, managing active work, and understanding billing approvals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {clientHelpTopics.map((topic) => (
          <article key={topic.id} className="border border-ink-10 rounded-xl p-5 bg-paper">
            <HelpCircle size={18} strokeWidth={1.5} className="text-blue mb-4" />
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink leading-tight">{topic.title}</h2>
            <p className="font-text text-sm text-ink-60 mt-3">{topic.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

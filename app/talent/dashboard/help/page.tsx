import { helpTopics } from '@/lib/help'

export default function HelpPage() {
  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-blue mb-2">Help centre</p>
        <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Support topics</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {helpTopics.map((topic) => (
          <article key={topic.id} className="border border-ink-10 rounded-xl p-5 bg-paper">
            <h2 className="font-display font-black text-[18px] tracking-[-0.02em] text-ink leading-tight">{topic.title}</h2>
            <p className="font-text text-sm text-ink-60 mt-3">{topic.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

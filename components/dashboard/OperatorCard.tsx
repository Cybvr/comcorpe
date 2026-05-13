import Link from 'next/link'
import type { Operator } from '@/lib/operators'

export default function OperatorCard({ operator }: { operator: Operator }) {
  return (
    <Link href={`/talent/${operator.talentId}`} className="block group">
      <article className="border border-ink-10 rounded-xl p-4 flex items-center gap-3 bg-paper group-hover:border-ink-20 transition-colors">
        <div className={`w-10 h-10 rounded-full ${operator.color} flex items-center justify-center font-display font-black text-[13px] text-paper shrink-0`}>
          {operator.initials}
        </div>
        <div>
          <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">{operator.name}</div>
          <div className="font-text text-[11px] text-ink-60">{operator.title}</div>
        </div>
      </article>
    </Link>
  )
}

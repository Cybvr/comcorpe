'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import PostCard from '@/components/dashboard/PostCard'
import { useInsights, useInsightBySlug } from '@/lib/insights'
import { useUser } from '@/lib/user-client'

export default function ClientInsightPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { insight } = useInsightBySlug(slug)
  const { insights } = useInsights()
  const { user: author } = useUser(insight?.authorId ?? '')

  if (insight === undefined) return null
  if (!insight) notFound()

  const otherInsights = insights.filter(i => i.slug !== slug)
  const authorTitle = author?.talentRole ?? insight.role
  const authorInitials = author?.initials ?? insight.author?.split(' ').map(n => n[0]).join('')

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1040px] mx-auto">
      <Link href="/client/dashboard/insights" className="font-text text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to insights
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">
        <article className="border border-border rounded-xl p-8 bg-background">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-full bg-input flex items-center justify-center font-display font-black text-[12px] text-foreground shrink-0">
              {authorInitials}
            </div>
            <div>
              <div className="font-display font-black text-[16px] text-foreground leading-none">{insight.author}</div>
              <div className="font-text text-xs text-muted-foreground/70 mt-1">{insight.role}</div>
            </div>
            <span className="ml-auto font-mono text-[10px] px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm uppercase tracking-eyebrow">
              {insight.badge ?? insight.meta}
            </span>
          </div>

          <h1 className="font-display font-black text-[34px] tracking-[-0.03em] text-foreground leading-tight max-w-[18ch]">
            {insight.title}
          </h1>
          <p className="font-text text-[16px] leading-relaxed text-muted-foreground mt-6">{insight.body ?? insight.description}</p>
          {insight.detail && <p className="font-text text-[16px] leading-relaxed text-muted-foreground mt-5">{insight.detail}</p>}

          <div className="mt-8 pt-5 border-t border-border flex items-center gap-4">
            <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
              <TrendingUp size={12} /> {insight.likes ?? 0}
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
              <MessageCircle size={12} /> {insight.replies ?? 0}
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors" aria-label="Share post">
              <Share2 size={12} />
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors ml-auto" aria-label="Save post">
              <Bookmark size={12} />
            </button>
          </div>
        </article>

        <aside className="border border-border rounded-xl p-5 bg-background">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mb-4">Consulting lead</p>
          <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center font-display font-black text-[13px] text-background mb-4">
            {authorInitials}
          </div>
          <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground leading-tight">{insight.author}</h2>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-primary mt-2">{authorTitle}</p>
          {author?.desc && <p className="font-text text-sm text-muted-foreground mt-4">{author.desc}</p>}
          {author?.bg && <p className="font-text text-xs text-muted-foreground/70 mt-4">{author.bg}</p>}
        </aside>
      </div>

      {otherInsights.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">More insights</h2>
            <Link href="/client/dashboard/insights" className="font-text text-xs text-primary hover:underline">
              View all insights
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherInsights.map((i) => (
              <PostCard key={i.slug} post={i as any} baseHref="/client/dashboard/insights" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

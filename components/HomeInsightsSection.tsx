'use client'

import Link from 'next/link'
import { getBlogHref, useBlogPosts } from '@/lib/blog'
import Image from 'next/image'

export default function HomeInsightsSection() {
  const { posts: all, loading } = useBlogPosts()
  const preview = all.slice(0, 3)

  if (loading || preview.length === 0) return null

  return (
    <section className="py-24 md:py-40 px-6 md:px-24 bg-background border-t border-foreground">
      <div className="flex items-baseline justify-between gap-6 mb-20">
        <span className="font-text text-xs font-semibold tracking-eyebrow uppercase text-foreground inline-flex items-center gap-2.5">
          <span className="w-6 h-px bg-foreground inline-block" />
          Insights
        </span>
        <Link
          href="/insights"
          className="font-mono text-xs text-primary flex items-center gap-2 hover:gap-4 transition-all duration-300"
        >
          View all <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground border border-foreground overflow-hidden rounded-sm">
        {preview.map((insight, index) => (
          <Link
            key={insight.slug}
            href={getBlogHref(insight.slug)}
            className="group bg-background hover:bg-primary/[0.03] transition-all duration-300 flex flex-col min-h-[300px]"
          >
            {(() => {
              const src = insight.coverImage || insight.thumbnail || insight.image || insight.imageUrl
              return (
                <div className="relative aspect-video w-full overflow-hidden bg-background">
                  {src ? (
                    <Image src={src} alt={insight.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 relative overflow-hidden bg-background">
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                      <div className="relative z-10 font-display font-black text-xl tracking-tight text-foreground/30 select-none uppercase">
                        {insight.category || 'Insights'}
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
            <div className="p-8 md:p-10 flex flex-col flex-1">
              <div className="flex items-center justify-between gap-6 mb-10">
                <span className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">
                  0{index + 1}
                </span>
                {insight.meta && (
                  <span className="font-mono text-[10px] text-primary uppercase tracking-eyebrow border border-primary px-2 py-1">
                    {insight.meta}
                  </span>
                )}
              </div>
              {insight.eyebrow && (
                <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-eyebrow mb-4">
                  {insight.eyebrow}
                </div>
              )}
              <h2 className="font-display font-black text-[26px] md:text-[32px] leading-tight tracking-h3 text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                {insight.title}
              </h2>
              <p className="font-text text-[15px] leading-relaxed text-muted-foreground m-0 mb-auto line-clamp-3">
                {insight.excerpt}
              </p>
              <div className="mt-10 font-mono text-xs text-primary flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                Read sourced note <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

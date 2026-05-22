'use client'

import Link from 'next/link'
import { use } from 'react'
import { useBlogPostBySlug } from '@/lib/blog'
import { notFound } from 'next/navigation'

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { post, loading } = useBlogPostBySlug(slug)

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-10 w-2/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  const paragraphs = post.body.split(/\n\n+/).filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-16 pb-24 md:px-24 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground hover:text-primary transition-colors"
          >
            <span aria-hidden="true">&larr;</span> Blog
          </Link>

          <div className="mt-10 mb-12 border-b border-foreground pb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                {post.publishedAt}
              </span>
            </div>
            <h1 className="font-display font-black text-[clamp(36px,5.5vw,72px)] leading-[0.92] tracking-tight text-foreground mb-6">
              {post.title}
            </h1>
            <p className="font-text text-[18px] leading-lede text-muted-foreground max-w-[48ch]">
              {post.excerpt}
            </p>
            {post.author && (
              <p className="mt-6 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
                By {post.author}
              </p>
            )}
          </div>

          <article className="space-y-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="font-text text-[17px] leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}

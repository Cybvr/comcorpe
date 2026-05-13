import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import PostCard from '@/components/dashboard/PostCard'
import { getPostBySlug, posts } from '@/lib/posts'
import { getTalentProfile } from '@/lib/talent'

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const author = getTalentProfile(post.authorId)
  const otherPosts = posts.filter((p) => p.slug !== slug)

  return (
    <div className="px-8 py-8 max-w-[1040px] mx-auto">
      <Link href="/talent/dashboard/community" className="font-text text-sm text-ink-60 hover:text-blue transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} /> Back to community
      </Link>

      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        <article className="border border-ink-10 rounded-xl p-8 bg-paper">
          <div className="flex items-center gap-3 mb-8">
            <Link href={`/talent/${author.id}`} className="shrink-0">
              <div className="w-11 h-11 rounded-full bg-ink-20 flex items-center justify-center font-display font-black text-[12px] text-ink hover:bg-blue/20 transition-colors">
                {author.initials}
              </div>
            </Link>
            <div>
              <Link href={`/talent/${author.id}`} className="font-display font-black text-[16px] text-ink hover:text-blue transition-colors leading-none block">
                {author.name}
              </Link>
              <div className="font-text text-xs text-ink-40 mt-1">{post.role}</div>
            </div>
            <span className="ml-auto font-mono text-[10px] px-2 py-1 bg-blue/10 text-blue border border-blue/20 rounded-sm uppercase tracking-eyebrow">
              {post.badge}
            </span>
          </div>

          <h1 className="font-display font-black text-[34px] tracking-[-0.03em] text-ink leading-tight max-w-[18ch]">
            {post.title}
          </h1>
          <p className="font-text text-[16px] leading-relaxed text-ink-60 mt-6">{post.body}</p>
          <p className="font-text text-[16px] leading-relaxed text-ink-60 mt-5">
            The useful pattern here is not the tactic by itself. It is the sequence: start with the trust carrier, prove the commercial motion, then move direct once the market has a reason to believe you.
          </p>

          <div className="mt-8 pt-5 border-t border-ink-10 flex items-center gap-4">
            <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors">
              <TrendingUp size={12} /> {post.likes}
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors">
              <MessageCircle size={12} /> {post.replies}
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors" aria-label="Share post">
              <Share2 size={12} />
            </button>
            <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors ml-auto" aria-label="Save post">
              <Bookmark size={12} />
            </button>
          </div>
        </article>

        <aside className="border border-ink-10 rounded-xl p-5 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mb-4">Talent profile</p>
          <Link href={`/talent/${author.id}`} className="block group">
            <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center font-display font-black text-[13px] text-paper mb-4 group-hover:bg-blue transition-colors">
              {author.initials}
            </div>
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">{author.name}</h2>
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-blue mt-2">{author.role}</p>
          <p className="font-text text-sm text-ink-60 mt-4">{author.desc}</p>
          <p className="font-text text-xs text-ink-40 mt-4">{author.bg}</p>
          <Link href={`/talent/${author.id}`} className="mt-5 inline-flex font-text text-xs font-semibold px-4 py-2 bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]">
            View full profile →
          </Link>
        </aside>
      </div>

      {otherPosts.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">More from the community</h2>
            <Link href="/talent/dashboard/community" className="font-text text-xs text-blue hover:underline">
              View all posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {otherPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Bookmark, MessageCircle, MoreHorizontal, Share2, TrendingUp } from 'lucide-react'
import type { Post } from '@/lib/posts'

export default function PostCard({
  post,
  baseHref = '/talent/dashboard/community',
}: {
  post: Post
  baseHref?: string
}) {
  const initials = post.author
    .split(' ')
    .map((name) => name[0])
    .join('')

  return (
    <article className="border border-border rounded-xl p-4 bg-background hover:border-input transition-colors">
      <div className="flex items-start gap-2.5 mb-3">
        <Link href={`/talent/${post.authorId}`} className="shrink-0">
          <div className="w-7 h-7 rounded-full bg-input flex items-center justify-center font-display font-black text-[10px] text-foreground hover:bg-primary/20 transition-colors">
            {initials}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/talent/${post.authorId}`} className="font-display font-black text-[13px] text-foreground hover:text-primary transition-colors leading-none">
              {post.author}
            </Link>
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-sm uppercase tracking-eyebrow">
              {post.badge}
            </span>
          </div>
          <div className="font-text text-[11px] text-muted-foreground/70 mt-0.5">{post.role}</div>
        </div>
        <button className="text-muted-foreground/70 hover:text-foreground transition-colors" aria-label="Post actions">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <Link href={`${baseHref}/${post.slug}`} className="block group/title">
        <h3 className="font-display font-black text-[14px] tracking-[-0.01em] text-foreground group-hover/title:text-primary transition-colors leading-snug mb-1.5">
          {post.title}
        </h3>
      </Link>
      <p className="font-text text-[12px] leading-relaxed text-muted-foreground line-clamp-3">{post.body}</p>

      <div className="mt-3 pt-3 border-t border-border flex items-center gap-4">
        <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
          <TrendingUp size={12} /> {post.likes}
        </button>
        <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
          <MessageCircle size={12} /> {post.replies}
        </button>
        <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors" aria-label="Share post">
          <Share2 size={12} />
        </button>
        <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors ml-auto" aria-label="Save post">
          <Bookmark size={12} />
        </button>
      </div>
    </article>
  )
}

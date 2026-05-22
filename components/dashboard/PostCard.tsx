import Link from 'next/link'
import { Bookmark, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import type { Post } from '@/lib/posts'

// Helper to get a beautiful CSS gradient for the fallback placeholder
function getGradientClass(id: number) {
  const gradients = [
    'from-indigo-600 to-violet-600',
    'from-emerald-600 to-teal-600',
    'from-blue-600 to-indigo-600',
    'from-purple-600 to-pink-600',
    'from-violet-600 to-fuchsia-600',
    'from-slate-800 to-slate-900',
    'from-cyan-600 to-blue-600',
  ]
  const index = id ? (id % gradients.length) : 0
  return gradients[index]
}

// Extend the Post type interface locally in case typescript doesn't have these optional fields yet
interface PostWithImage extends Post {
  thumbnail?: string
  image?: string
  imageUrl?: string
}

export default function PostCard({
  post,
  baseHref = '/talent/dashboard/community',
}: {
  post: PostWithImage
  baseHref?: string
}) {
  const initials = post.author
    .split(' ')
    .map((name) => name[0])
    .join('')

  // Determine if there is a firebase dummy image/thumbnail
  const thumbnailUrl = post.thumbnail || post.image || post.imageUrl

  return (
    <article className="relative group flex flex-col h-full border border-border rounded-2xl bg-background hover:border-input hover:shadow-md transition-all overflow-hidden">
      {/* Thumbnail or Fallback Premium CSS Gradient */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradientClass(post.id)} flex items-center justify-center p-6 relative overflow-hidden`}>
            {/* Elegant glassmorphic background accent */}
            <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[1px]" />
            {/* Subtle mesh background grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="relative z-10 font-display font-black text-xl tracking-tight text-white/90 select-none uppercase">
              {post.category || 'Strategy'}
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <span className="font-mono text-[9px] px-2 py-0.5 bg-background/90 backdrop-blur-sm border border-border rounded-full uppercase tracking-eyebrow text-foreground">
            {post.category || 'Strategy'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Author info */}
        <div className="flex items-center gap-2.5 mb-4 relative z-20">
          <Link href={`/talent/${post.authorId}`} className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-input flex items-center justify-center font-display font-black text-[11px] text-foreground hover:bg-primary/20 transition-colors">
              {initials}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/talent/${post.authorId}`} className="font-display font-black text-[13px] text-foreground hover:text-primary transition-colors leading-none">
                {post.author}
              </Link>
              <span className="font-mono text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-sm uppercase tracking-eyebrow">
                {post.badge}
              </span>
            </div>
            <div className="font-text text-[10px] text-muted-foreground/70 mt-0.5">{post.role}</div>
          </div>
        </div>

        {/* Title link with absolute overlay to make card clickable */}
        <div className="mb-2">
          <Link href={`${baseHref}/${post.slug}`} className="block">
            <span className="absolute inset-0 z-10 cursor-pointer" aria-hidden="true" />
            <h3 className="font-display font-black text-[16px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
          </Link>
        </div>

        {/* Excerpt */}
        <p className="font-text text-[13px] leading-relaxed text-muted-foreground line-clamp-3 mb-6">
          {post.body}
        </p>

        {/* Stats and Actions at the bottom */}
        <div className="mt-auto pt-4 border-t border-border flex items-center gap-4 relative z-20">
          <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
            <TrendingUp size={12} /> {post.likes}
          </button>
          <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors">
            <MessageCircle size={12} /> {post.replies}
          </button>
          <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors ml-auto" aria-label="Share post">
            <Share2 size={12} />
          </button>
          <button className="flex items-center gap-1.5 font-text text-xs text-muted-foreground/70 hover:text-foreground transition-colors" aria-label="Save post">
            <Bookmark size={12} />
          </button>
        </div>
      </div>
    </article>
  )
}

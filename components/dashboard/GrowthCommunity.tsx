import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import DashboardPostComposer from './DashboardPostComposer'
import PostCard from './PostCard'
import { posts } from '@/lib/posts'

export default function GrowthCommunity({ audience }: { audience: 'talent' | 'client' }) {
  const communityHref = `/${audience}/dashboard/community`
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Growth community</h2>
        <Link href={communityHref} className="font-text text-xs text-primary hover:underline">View all posts</Link>
      </div>

      <DashboardPostComposer />

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} baseHref={communityHref} />
        ))}
      </div>

      <button className="font-text text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 justify-center py-3 border border-border rounded-xl hover:border-input">
        <RotateCcw size={13} /> Load more posts
      </button>
    </div>
  )
}

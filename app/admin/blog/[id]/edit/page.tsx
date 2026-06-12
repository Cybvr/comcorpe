'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getBlogPosts, updateBlogPost, getSystemUsers } from '@/lib/admin/store'
import type { BlogPost } from '@/lib/blog'
import type { User } from '@/lib/user'
import BlogForm, { type BlogFormData } from '@/components/admin/BlogForm'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: rawId } = use(params)
  const postId = decodeURIComponent(rawId)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [posts, usersData] = await Promise.all([getBlogPosts(), getSystemUsers()])
        setPost(posts.find(p => p.id === postId) ?? null)
        setUsers(usersData)
      } catch {
        setError('Failed to load post.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  function postToForm(p: BlogPost): BlogFormData {
    return {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      category: p.category,
      author: p.author,
      authorId: (p as any).authorId ?? '',
      publishedAt: p.publishedAt,
      coverImage: p.coverImage ?? '',
    }
  }

  async function handleSave(data: BlogFormData) {
    if (!post) return
    setSaving(true)
    setError('')
    const payload = { ...data }
    try {
      await updateBlogPost(post.id, payload as any)
      router.push('/admin/blog?saved=true')
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="border border-border p-16 text-center max-w-2xl">
        <div className="w-7 h-7 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={12} /> Back to Blog
        </Link>
        <p className="font-text text-sm text-muted-foreground">Post not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 w-full">
      <div className="pb-2">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Blog
        </Link>
      </div>

      {error && (
        <div className="border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 text-red-600">
          <AlertCircle size={15} />
          <span className="font-text text-sm font-semibold">{error}</span>
        </div>
      )}

      <BlogForm
        initial={postToForm(post)}
        onSave={handleSave}
        onCancel={() => router.push('/admin/blog')}
        saving={saving}
        users={users}
        submitLabel="Update post"
      />
    </div>
  )
}

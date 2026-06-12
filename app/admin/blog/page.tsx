'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBlogPosts, deleteBlogPost, getSystemUsers } from '@/lib/admin/store'
import type { BlogPost } from '@/lib/blog'
import type { User } from '@/lib/user'
import Modal from '@/components/admin/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Trash2, Edit2, Check, AlertCircle, FileText } from 'lucide-react'
import PostThumbnail from '@/components/ui/PostThumbnail'

export default function AdminBlogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([getBlogPosts(), getSystemUsers()])
      setPosts(postsData)
      setUsers(usersData)
    } catch {
      showMsg('Failed to load data.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  useEffect(() => {
    if (searchParams.get('saved') === 'true') {
      showMsg('Post saved.', 'success')
    }
  }, [searchParams])

  function showMsg(text: string, type: 'success' | 'error') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await deleteBlogPost(deleteTarget.id)
      showMsg(`"${deleteTarget.title}" deleted.`, 'success')
      setDeleteTarget(null)
      await reload()
    } catch {
      showMsg('Failed to delete.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-[32px] tracking-hero text-foreground leading-tight">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage every post published on the blog.
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/blog/new')}
          className="self-start sm:self-auto h-auto px-4 py-2.5 font-text text-xs shrink-0"
        >
          <Plus size={14} /> New post
        </Button>
      </div>

      {message && (
        <div className={`border p-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}>
          {message.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          <span className="font-text text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="pl-9 pr-4 py-2.5"
        />
      </div>

      {loading ? (
        <div className="border border-border p-16 text-center space-y-4">
          <div className="w-7 h-7 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center text-muted-foreground">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-mono text-xs uppercase tracking-widest">No posts found</p>
          <p className="text-xs mt-1">{search ? 'Try a different search.' : 'Click "New post" to write the first one.'}</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map(post => {
            const authorUser = users.find(u => u.id === (post as any).authorId)
            return (
              <div key={post.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/5 transition-colors group">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="hidden sm:block shrink-0">
                    <PostThumbnail
                      src={post.coverImage}
                      alt={post.title}
                      category={post.category}
                      id={post.id}
                      className="w-16 h-16"
                      showBadge={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.category && (
                        <span className="font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase border bg-primary/10 border-primary/20 text-primary">
                          {post.category}
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">{post.publishedAt}</span>
                    </div>
                    <h3 className="font-display text-base font-black text-foreground leading-snug truncate pr-4">{post.title}</h3>
                    <p className="font-text text-xs text-muted-foreground line-clamp-1 max-w-[65ch]">{post.excerpt}</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      {authorUser?.image && (
                        <div className={`relative w-5 h-5 rounded-sm overflow-hidden ${authorUser.color || 'bg-foreground'}`}>
                          <Image src={authorUser.image} alt={authorUser.name} fill className="object-cover" />
                        </div>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground/60">{post.author}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/40">/{post.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push(`/admin/blog/${encodeURIComponent(post.id)}/edit`)}
                    className="h-auto w-auto p-2 text-muted-foreground hover:text-foreground hover:border-foreground"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteTarget(post)}
                    className="h-auto w-auto p-2 text-muted-foreground hover:text-red-500 hover:border-red-500"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}{search ? ' matching' : ' total'}
        </p>
      )}

      {deleteTarget && (
        <Modal title="Delete post" onClose={() => !saving && setDeleteTarget(null)}>
          <div className="space-y-5">
            <p className="font-text text-sm text-foreground leading-relaxed">
              Permanently delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDelete} disabled={saving} className="h-auto flex-1 py-3 font-text text-sm">
                {saving ? 'Deleting…' : 'Delete post'}
              </Button>
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={saving} className="h-auto flex-1 border-input py-3 font-text text-sm text-foreground hover:bg-border">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

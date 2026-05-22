'use client'

import { useEffect, useState, useCallback } from 'react'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/admin/store'
import type { BlogPost } from '@/lib/blog'
import Modal from '@/components/admin/Modal'
import { Plus, Search, Trash2, Edit2, Check, AlertCircle, FileText } from 'lucide-react'

// ─── Form ──────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: '',
  author: '',
  publishedAt: '',
  coverImage: '',
}

type BlogFormData = typeof EMPTY_FORM

const L = 'font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1'
const I = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-100'
const T = `${I} resize-none`

function BlogForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: BlogFormData
  onSave: (data: BlogFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<BlogFormData>({ ...EMPTY_FORM, ...initial })

  function set(field: keyof BlogFormData, value: string) {
    setForm(f => {
      const next = { ...f, [field]: value }
      // Auto-generate slug from title if slug hasn't been manually edited
      if (field === 'title' && !f.slug) {
        next.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }
      return next
    })
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <div>
        <label className={L}>Title *</label>
        <input className={I} value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Post title" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={L}>Slug *</label>
          <input className={I} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="my-post-slug" />
        </div>
        <div>
          <label className={L}>Category</label>
          <input className={I} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Insights" />
        </div>
      </div>

      <div>
        <label className={L}>Excerpt *</label>
        <textarea className={T} rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} required placeholder="One or two sentences summarising the post" />
      </div>

      <div>
        <label className={L}>Body *</label>
        <textarea className={T} rows={10} value={form.body} onChange={e => set('body', e.target.value)} required placeholder={'Write the full post here.\n\nSeparate paragraphs with a blank line.'} />
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">Blank line = new paragraph on the site.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={L}>Author</label>
          <input className={I} value={form.author} onChange={e => set('author', e.target.value)} placeholder="e.g. Jide Pinheiro" />
        </div>
        <div>
          <label className={L}>Published date</label>
          <input className={I} value={form.publishedAt} onChange={e => set('publishedAt', e.target.value)} placeholder="e.g. 22 May 2026" />
        </div>
      </div>

      <div>
        <label className={L}>Cover image URL (optional)</label>
        <input className={I} type="url" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
      </div>

      <div className="flex gap-3 pt-2 border-t border-border">
        <button type="submit" disabled={saving} className="flex-1 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors">
          {saving ? 'Saving…' : 'Publish post'}
        </button>
        <button type="button" onClick={onCancel} disabled={saving} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [modal, setModal] = useState<null | 'create' | BlogPost>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setPosts(await getBlogPosts())
    } catch {
      showMsg('Failed to load posts.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  function showMsg(text: string, type: 'success' | 'error') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  function postToForm(post: BlogPost): BlogFormData {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
      coverImage: post.coverImage ?? '',
    }
  }

  async function handleSave(data: BlogFormData) {
    setSaving(true)
    try {
      if (modal === 'create') {
        await createBlogPost(data)
        showMsg(`"${data.title}" published.`, 'success')
      } else if (modal && typeof modal === 'object') {
        await updateBlogPost(modal.id, data)
        showMsg(`"${data.title}" updated.`, 'success')
      }
      setModal(null)
      await reload()
    } catch {
      showMsg('Something went wrong.', 'error')
    } finally {
      setSaving(false)
    }
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
          <p className="text-sm text-muted-foreground mt-1">Create and manage blog posts. Stored in the Firestore <code className="font-mono text-xs bg-muted px-1">blog</code> collection.</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-text text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
        >
          <Plus size={14} /> New post
        </button>
      </div>

      {message && (
        <div className={`border p-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-red-500/5 border-red-500/20 text-red-600'}`}>
          {message.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          <span className="font-text text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full bg-background border border-input pl-9 pr-4 py-2.5 font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
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
          {filtered.map(post => (
            <div key={post.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/5 transition-colors group">
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
                <p className="font-text text-xs text-muted-foreground line-clamp-2 max-w-[65ch]">{post.excerpt}</p>
                <p className="font-mono text-[10px] text-muted-foreground/50">/{post.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setModal(post)} className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors" title="Edit">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setDeleteTarget(post)} className="p-2 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors" title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''}{search ? ' matching' : ' total'}
        </p>
      )}

      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'New post' : `Edit: ${(modal as BlogPost).title}`}
          onClose={() => !saving && setModal(null)}
        >
          <BlogForm
            initial={modal === 'create' ? EMPTY_FORM : postToForm(modal as BlogPost)}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete post" onClose={() => !saving && setDeleteTarget(null)}>
          <div className="space-y-5">
            <p className="font-text text-sm text-foreground leading-relaxed">
              Permanently delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {saving ? 'Deleting…' : 'Delete post'}
              </button>
              <button onClick={() => setDeleteTarget(null)} disabled={saving} className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

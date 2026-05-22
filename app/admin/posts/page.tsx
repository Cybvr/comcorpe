'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { getPosts, createPost, updatePost, deletePost } from '@/lib/admin/store'
import type { Post } from '@/lib/posts'
import Modal from '@/components/admin/Modal'
import { Plus, Search, Trash2, Edit2, Check, AlertCircle, FileText, TrendingUp, MessageCircle } from 'lucide-react'

// ─── Form ──────────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '',
  body: '',
  category: 'Strategy',
  badge: 'Strategy',
  author: '',
  authorId: '',
  role: '',
  thumbnail: '',
}

type PostFormData = typeof EMPTY_FORM

function PostForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: PostFormData
  onSave: (data: PostFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<PostFormData>({ ...EMPTY_FORM, ...initial })

  function set(field: keyof PostFormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  const L = 'font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1'
  const I = 'w-full px-4 py-3 border border-input bg-background font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-100'
  const T = `${I} resize-none`

  const CATEGORIES = ['Strategy', 'Leadership', 'Growth', 'Operations', 'Finance', 'Technology', 'Culture', 'Other']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={L}>Title *</label>
        <input
          id="post-title"
          className={I}
          value={form.title}
          onChange={e => set('title', e.target.value)}
          required
          placeholder="e.g. How to build a growth engine"
        />
      </div>

      <div>
        <label className={L}>Body / Content *</label>
        <textarea
          id="post-body"
          className={T}
          rows={6}
          value={form.body}
          onChange={e => set('body', e.target.value)}
          required
          placeholder="The full article content..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={L}>Category *</label>
          <select
            id="post-category"
            className={`${I} cursor-pointer`}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={L}>Badge Label</label>
          <input
            id="post-badge"
            className={I}
            value={form.badge}
            onChange={e => set('badge', e.target.value)}
            placeholder="e.g. Strategy"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={L}>Author Name *</label>
          <input
            id="post-author"
            className={I}
            value={form.author}
            onChange={e => set('author', e.target.value)}
            required
            placeholder="e.g. Jide Pinheiro"
          />
        </div>

        <div>
          <label className={L}>Author ID (UID)</label>
          <input
            id="post-authorid"
            className={I}
            value={form.authorId}
            onChange={e => set('authorId', e.target.value)}
            placeholder="Firebase UID or slug"
          />
        </div>
      </div>

      <div>
        <label className={L}>Author Role / Subtitle</label>
        <input
          id="post-role"
          className={I}
          value={form.role}
          onChange={e => set('role', e.target.value)}
          placeholder="e.g. Growth Strategist · Comcorpe"
        />
      </div>

      <div>
        <label className={L}>Thumbnail URL (optional)</label>
        <input
          id="post-thumbnail"
          className={I}
          type="url"
          value={form.thumbnail}
          onChange={e => set('thumbnail', e.target.value)}
          placeholder="https://..."
        />
        <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
          Leave blank to use a generated gradient placeholder.
        </p>
      </div>

      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          id="post-form-submit"
          className="flex-1 py-3 bg-foreground text-background font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-colors duration-100"
        >
          {saving ? 'Saving…' : 'Publish Article'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPostsPage() {
  const searchParams = useSearchParams()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Modal state: null = closed, 'create' = new post, Post = editing that post
  const [modal, setModal] = useState<null | 'create' | Post>(null)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  // ── Data ──────────────────────────────────────────────────────────────────

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPosts()
      setPosts(data)
    } catch {
      showMsg('Failed to load articles from Firestore.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])

  // Auto-open create modal when ?new=true
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setModal('create')
    }
  }, [searchParams])

  // ── Helpers ───────────────────────────────────────────────────────────────

  function showMsg(text: string, type: 'success' | 'error') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  function postToForm(post: Post): PostFormData {
    return {
      title: post.title,
      body: post.body,
      category: post.category,
      badge: post.badge,
      author: post.author,
      authorId: post.authorId,
      role: post.role,
      thumbnail: (post as any).thumbnail ?? '',
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async function handleSave(data: PostFormData) {
    setSaving(true)
    try {
      if (modal === 'create') {
        await createPost({
          title: data.title,
          body: data.body,
          category: data.category,
          badge: data.badge,
          author: data.author,
          authorId: data.authorId,
          role: data.role,
          likes: 0,
          replies: 0,
          slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
        })
        showMsg(`Article "${data.title}" created successfully!`, 'success')
      } else if (modal && typeof modal === 'object') {
        await updatePost(modal.id, {
          title: data.title,
          body: data.body,
          category: data.category,
          badge: data.badge,
          author: data.author,
          authorId: data.authorId,
          role: data.role,
          ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
        })
        showMsg(`Article "${data.title}" updated successfully!`, 'success')
      }
      setModal(null)
      await reload()
    } catch {
      showMsg('An error occurred. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await deletePost(deleteTarget.id)
      showMsg(`Article "${deleteTarget.title}" deleted.`, 'success')
      setDeleteTarget(null)
      await reload()
    } catch {
      showMsg('Failed to delete article.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-[32px] tracking-hero text-foreground leading-tight">Articles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and delete community articles stored in Firestore.
          </p>
        </div>
        <button
          id="new-article-btn"
          onClick={() => setModal('create')}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-text text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-100 shrink-0"
        >
          <Plus size={14} />
          New Article
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div className={`border p-4 flex items-center gap-3 transition-all duration-300
          ${message.type === 'success'
            ? 'bg-green-500/5 border-green-500/20 text-green-600'
            : 'bg-red-500/5 border-red-500/20 text-red-600'
          }`}
        >
          {message.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
          <span className="font-text text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
        <input
          id="posts-search"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or category…"
          className="w-full bg-background border border-input pl-9 pr-4 py-2.5 font-text text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-100"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="border border-border p-16 text-center text-muted-foreground space-y-4">
          <div className="w-7 h-7 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-widest uppercase">Loading articles from Firestore…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border border-dashed p-16 text-center text-muted-foreground">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-mono text-xs uppercase tracking-widest">No articles found</p>
          <p className="text-xs mt-1">
            {search ? 'Try a different search term.' : 'Click "New Article" to write the first one.'}
          </p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map(post => (
            <div
              key={post.id}
              id={`post-row-${post.id}`}
              className="px-6 py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/5 transition-colors duration-100 group"
            >
              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase border bg-primary/10 border-primary/20 text-primary">
                    {post.badge || post.category}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                    #{post.id}
                  </span>
                </div>
                <h3 className="font-display text-base font-black text-foreground leading-snug truncate pr-4">
                  {post.title}
                </h3>
                <p className="font-text text-xs text-muted-foreground line-clamp-2 max-w-[65ch]">
                  {post.body}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-muted-foreground/60">
                  <span className="font-mono text-[10px]">{post.author}</span>
                  {post.role && (
                    <span className="font-mono text-[10px] truncate max-w-[24ch]">{post.role}</span>
                  )}
                  <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                    <TrendingUp size={10} /> {post.likes}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                    <MessageCircle size={10} /> {post.replies}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setModal(post)}
                  id={`edit-post-${post.id}`}
                  className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(post)}
                  id={`delete-post-${post.id}`}
                  className="p-2 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}{search ? ' matching' : ' total'}
        </p>
      )}

      {/* Create / Edit Modal */}
      {modal !== null && (
        <Modal
          title={modal === 'create' ? 'New Article' : `Edit: ${(modal as Post).title}`}
          onClose={() => !saving && setModal(null)}
        >
          <PostForm
            initial={modal === 'create' ? EMPTY_FORM : postToForm(modal as Post)}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal title="Delete Article" onClose={() => !saving && setDeleteTarget(null)}>
          <div className="space-y-5">
            <p className="font-text text-sm text-foreground leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>?{' '}
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-delete-post"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-3 bg-red-600 text-white font-text text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors duration-100"
              >
                {saving ? 'Deleting…' : 'Delete Article'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className="flex-1 py-3 border border-input text-foreground font-text text-sm hover:bg-border transition-colors duration-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

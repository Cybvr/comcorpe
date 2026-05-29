import type { InsightSignal, InsightSource } from './insights'

export type ContentSourceCollection = 'blog' | 'insights' | 'posts'
export type ContentType = 'blog' | 'insight' | 'article'

export interface ContentEntry {
  id: string
  sourceId: string
  sourceCollection: ContentSourceCollection
  contentType: ContentType
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  publishedAt: string
  updatedAt?: string
  author: string
  authorId?: string
  coverImage?: string
  thumbnail?: string
  image?: string
  imageUrl?: string
  badge?: string
  role?: string
  likes?: number
  replies?: number
  detail?: string
  meta?: string
  eyebrow?: string
  lede?: string
  thesis?: string[]
  signals?: InsightSignal[]
  implications?: string[]
  sources?: InsightSource[]
  order?: number
}

export interface ContentFilter {
  contentType?: ContentType
  category?: string
  slug?: string
}

export function buildContentId(sourceCollection: ContentSourceCollection, sourceId: string) {
  return `${sourceCollection}:${sourceId}`
}

export function parseContentId(id: string) {
  const [sourceCollection, ...rest] = id.split(':')
  const sourceId = rest.join(':')

  if (
    (sourceCollection === 'blog' || sourceCollection === 'insights' || sourceCollection === 'posts') &&
    sourceId
  ) {
    return {
      sourceCollection,
      sourceId,
    } as const
  }

  return {
    sourceCollection: 'blog' as const,
    sourceId: id,
  }
}

export function buildExcerpt(text?: string | null, maxLength = 180) {
  const normalized = (text ?? '').replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}...`
}

function titleFromSlug(slug?: string) {
  if (!slug) return 'Untitled'
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizeCategory(category?: string | null, fallback = 'Blog') {
  const value = category?.trim()
  return value || fallback
}

function inferContentType(category?: string | null): ContentType {
  const normalized = category?.trim().toLowerCase()
  if (normalized === 'insight' || normalized === 'insights') return 'insight'
  if (normalized === 'article' || normalized === 'articles') return 'article'
  return 'blog'
}

function sortValue(entry: ContentEntry) {
  const updated = entry.updatedAt ? Date.parse(entry.updatedAt) : NaN
  if (Number.isFinite(updated)) return updated

  const published = Date.parse(entry.publishedAt)
  if (Number.isFinite(published)) return published

  const numericId = Number.parseInt(entry.sourceId, 10)
  if (Number.isFinite(numericId)) return numericId

  return 0
}

export function adaptBlogEntry(data: Record<string, any>, sourceId: string): ContentEntry {
  const category = normalizeCategory(data.category, 'Blog')
  const body = data.body ?? ''

  return {
    id: buildContentId('blog', sourceId),
    sourceId,
    sourceCollection: 'blog',
    contentType: inferContentType(category),
    slug: data.slug || sourceId,
    title: data.title || titleFromSlug(data.slug || sourceId),
    excerpt: data.excerpt || buildExcerpt(body),
    body,
    category,
    publishedAt: data.publishedAt || '',
    updatedAt: data.updatedAt,
    author: data.author || 'Comcorpe',
    authorId: data.authorId || '',
    coverImage: data.coverImage,
    thumbnail: data.thumbnail,
    image: data.image,
    imageUrl: data.imageUrl,
    badge: data.badge,
    role: data.role,
    likes: data.likes ?? 0,
    replies: data.replies ?? 0,
    detail: data.detail,
    meta: data.meta,
    eyebrow: data.eyebrow,
    lede: data.lede,
    thesis: data.thesis,
    signals: data.signals,
    implications: data.implications,
    sources: data.sources,
    order: data.order != null ? Number(data.order) : undefined,
  }
}

export function adaptInsightEntry(data: Record<string, any>, sourceId: string): ContentEntry {
  const body = data.body || data.description || data.lede || data.detail || data.thesis?.[0] || ''

  return {
    id: buildContentId('insights', sourceId),
    sourceId,
    sourceCollection: 'insights',
    contentType: 'insight',
    slug: data.slug || sourceId,
    title: data.title || titleFromSlug(data.slug || sourceId),
    excerpt: data.description || data.lede || buildExcerpt(body),
    body,
    category: normalizeCategory(data.category, 'Insights'),
    publishedAt: data.publishedAt || '',
    updatedAt: data.updatedAt,
    author: data.author || 'Comcorpe',
    authorId: data.authorId || '',
    coverImage: data.coverImage,
    thumbnail: data.thumbnail,
    image: data.image,
    imageUrl: data.imageUrl,
    badge: data.badge || data.meta || 'Insights',
    role: data.role || 'Comcorpe',
    likes: data.likes ?? 0,
    replies: data.replies ?? 0,
    detail: data.detail,
    meta: data.meta,
    eyebrow: data.eyebrow,
    lede: data.lede,
    thesis: data.thesis,
    signals: data.signals,
    implications: data.implications,
    sources: data.sources,
  }
}

export function adaptArticleEntry(data: Record<string, any>, sourceId: string): ContentEntry {
  const body = data.body ?? ''
  const category = normalizeCategory(data.category, 'Articles')

  return {
    id: buildContentId('posts', sourceId),
    sourceId,
    sourceCollection: 'posts',
    contentType: 'article',
    slug: data.slug || sourceId,
    title: data.title || titleFromSlug(data.slug || sourceId),
    excerpt: data.excerpt || buildExcerpt(body),
    body,
    category: category === 'Strategy' ? 'Articles' : category,
    publishedAt: data.publishedAt || '',
    updatedAt: data.updatedAt,
    author: data.author || 'Comcorpe',
    authorId: data.authorId || '',
    coverImage: data.coverImage,
    thumbnail: data.thumbnail,
    image: data.image,
    imageUrl: data.imageUrl,
    badge: data.badge || data.category || 'Articles',
    role: data.role || 'Contributor',
    likes: data.likes ?? 0,
    replies: data.replies ?? 0,
  }
}

export function mergeContentEntries(...groups: ContentEntry[][]) {
  const merged = new Map<string, ContentEntry>()

  for (const group of groups) {
    for (const entry of group) {
      if (!entry.slug) continue
      if (!merged.has(entry.slug)) {
        merged.set(entry.slug, entry)
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => sortValue(b) - sortValue(a))
}

export function filterContentEntries(entries: ContentEntry[], filter?: ContentFilter) {
  if (!filter) return entries

  return entries.filter((entry) => {
    if (filter.contentType && entry.contentType !== filter.contentType) return false
    if (filter.category && entry.category.toLowerCase() !== filter.category.toLowerCase()) return false
    if (filter.slug && entry.slug !== filter.slug) return false
    return true
  })
}

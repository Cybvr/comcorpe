const CACHE = 'comcorpe-v2'

const PRECACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// Hostnames that must never be intercepted by the SW
// Firebase uses streaming/long-poll responses that cannot be cloned
const SKIP_HOSTS = [
  'firebaseio.com',
  'firestore.googleapis.com',
  'googleapis.com',
  'firebaseapp.com',
  'identitytoolkit.googleapis.com',
  'accounts.google.com',
  'login.microsoftonline.com',
]

const STATIC_ASSET_RE = /\.(png|jpg|jpeg|gif|webp|svg|ico|json|txt|js|css|map)$/i

function isCacheablePublicRequest(url, request) {
  if (url.origin !== self.location.origin) return false
  if (request.mode === 'navigate') return url.pathname === '/'
  return PRECACHE.includes(url.pathname) || STATIC_ASSET_RE.test(url.pathname)
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Skip Firebase, Google auth, and internal API routes
  if (
    SKIP_HOSTS.some(h => url.hostname.endsWith(h)) ||
    url.pathname.startsWith('/api/') ||
    !isCacheablePublicRequest(url, e.request)
  ) return

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        // Only cache valid, non-opaque, non-streaming responses
        if (res.ok && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      })
      return cached ?? fresh
    })
  )
})

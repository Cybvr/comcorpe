/**
 * Signed session cookie — pure Web Crypto API, works in Edge Runtime (middleware).
 * One env var required: AUTH_SECRET (any random string, set in Vercel + .env.local)
 */

const ALG = { name: 'HMAC', hash: 'SHA-256' } as const
const TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

export const SESSION_COOKIE = 'cc_session'

export interface SessionPayload {
  uid: string
  role: string
  exp: number
}

async function key(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET ?? 'dev-secret-change-in-production'
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), ALG, false, ['sign', 'verify'])
}

function b64url(str: string) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromb64url(str: string) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

export async function signSession(uid: string, role: string): Promise<string> {
  const payload = b64url(JSON.stringify({ uid, role, exp: Date.now() + TTL }))
  const sig = await crypto.subtle.sign(ALG, await key(), new TextEncoder().encode(payload))
  const sigHex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${payload}.${sigHex}`
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return null
    const payload = token.slice(0, dot)
    const sigBytes = new Uint8Array((token.slice(dot + 1).match(/.{2}/g) ?? []).map(h => parseInt(h, 16)))
    const valid = await crypto.subtle.verify(ALG, await key(), sigBytes, new TextEncoder().encode(payload))
    if (!valid) return null
    const data: SessionPayload = JSON.parse(fromb64url(payload))
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

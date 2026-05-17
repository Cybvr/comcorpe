/**
 * Firestore Seed Script
 *
 * Pushes all static lib/ data into Firestore collections.
 * Safe to re-run — uses setDoc (merge) so it won't create duplicates.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 *
 * Requirements:
 *   npm install tsx dotenv (tsx is likely already installed via devDeps)
 */

import { resolve } from 'path'
import { config } from 'dotenv'

// Load .env.local before importing firebase
config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'

// ─── Lib data ──────────────────────────────────────────────────────────────────
import { jobs }                               from '../lib/jobs'
import { users, clientUsers }                 from '../lib/user'
import { insights }                           from '../lib/insights'
import { clientInsights, growthConsultingHeadlines } from '../lib/client-insights'
import { cases }                              from '../lib/cases'
import { pods }                               from '../lib/pods'
import { invoices, type Invoice }              from '../lib/invoices'
import { contractTerms }                      from '../lib/contract'
import { leadership, advisors }               from '../lib/people'
import { spaces }                             from '../lib/spaces'
import { payouts }                            from '../lib/payouts'
import { posts }                              from '../lib/posts'
import { services }                           from '../lib/services'
import { referral }                           from '../lib/referrals'

// ─── Firebase init ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ─── Helpers ───────────────────────────────────────────────────────────────────
/** Strip undefined values — Firestore doesn't accept them */
function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

async function seedCollection<T extends object>(
  collectionName: string,
  items: T[],
  getKey: (item: T) => string,
) {
  console.log(`\n📦 Seeding "${collectionName}" (${items.length} docs)…`)
  for (const item of items) {
    const key = getKey(item)
    await setDoc(doc(collection(db, collectionName), key), clean(item), { merge: true })
    console.log(`   ✓ ${key}`)
  }
}

async function seedSingleDoc(collectionName: string, key: string, data: object) {
  console.log(`\n📦 Seeding "${collectionName}/${key}"…`)
  await setDoc(doc(collection(db, collectionName), key), clean(data), { merge: true })
  console.log(`   ✓ ${key}`)
}

// ─── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🚀 Starting Firestore seed…')
  console.log(`   Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`)

  // Jobs
  await seedCollection('jobs', jobs, j => j.slug)

  // Users — unified into "users" collection
  const talentUsers = users.filter(u => u.role === 'talent')
  const combinedUsers = [
    ...talentUsers.map(u => ({ ...u, email: u.email || `${u.id}@comcorpe.com` })),
    ...clientUsers.map(u => ({ ...u, email: u.email || `${u.id}@comcorpe.com` })),
    // Seed admin accounts
    { id: 'jide-pinheiro', name: 'Jide Pinheiro', email: 'jide.pinheiro@comcorpe.com', role: 'admin', initials: 'JP' },
    { id: 'art-visual', name: 'Art Visual', email: 'art@visual.ng', role: 'admin', initials: 'AV' },
  ]
  await seedCollection('users', combinedUsers, u => u.id)

  // Insights
  await seedCollection('insights', insights, i => i.slug)

  // Client insights
  await seedCollection('clientInsights', clientInsights, i => i.slug)

  // Growth consulting headlines (stored as a single doc — it's a small list)
  await seedSingleDoc('meta', 'growthConsultingHeadlines', { items: growthConsultingHeadlines })

  // Cases
  await seedCollection('cases', cases, c => c.slug)

  // Pods
  await seedCollection('pods', pods, p => p.slug)

  // Invoices — key by jobSlug + milestoneId
  await seedCollection<Invoice>('invoices', invoices, inv => `${inv.jobSlug}_${inv.milestoneId}`)

  // Contract terms (stored as a single doc)
  await seedSingleDoc('meta', 'contractTerms', { items: contractTerms })

  // People — leadership (no id field, use slugified name)
  await seedCollection('leadership', leadership, p => (p as { name: string }).name.toLowerCase().replace(/\s+/g, '-'))

  // People — advisors (no id field, use slugified name)
  await seedCollection('advisors', advisors, a => (a as { name: string }).name.toLowerCase().replace(/\s+/g, '-'))

  // Spaces
  await seedCollection('spaces', spaces, s => String(s.id))

  // Payouts
  await seedCollection('payouts', payouts, p => String(p.id))

  // Posts
  await seedCollection('posts', posts, p => p.slug)

  // Services — key by `i` field
  await seedCollection('services', services, s => (s as { i: string }).i)

  // Referral (single config doc)
  await seedSingleDoc('meta', 'referral', referral)

  console.log('\n✅ Seed complete!')
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})

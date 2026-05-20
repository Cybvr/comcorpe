/**
 * One-time script to seed a job document into Firestore.
 *
 * Prerequisites:
 *   1. Download a service account JSON from Firebase Console →
 *      Project Settings → Service Accounts → Generate new private key
 *   2. Set GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
 *
 * Run:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npx tsx scripts/seed-job.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const PROJECT_ID = 'comcorpe'

if (!getApps().length) {
  initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string) })
}

const db = getFirestore()

async function main() {
  const jobsCol = db.collection('jobs')

  // Determine next numeric id
  const snap = await jobsCol.get()
  const existingIds = snap.docs.map(d => (d.data().id as number) || 0)
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1

  const slug = 'cbn-stability-campaign'

  // Guard against duplicates
  const existing = await jobsCol.doc(slug).get()
  if (existing.exists) {
    console.log(`Job "${slug}" already exists — skipping.`)
    process.exit(0)
  }

  const job = {
    id: nextId,
    slug,
    title: 'CBN stability campaign',
    clientId: 'jide-pinheiro',
    type: 'PROJECT',
    status: 'Scoping',
    summary: '',
    rate: '',
    location: '',
    time: '',
    tags: [],
    updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
    scope: [],
    requirements: [],
  }

  await jobsCol.doc(slug).set(job)
  console.log(`Created job #${nextId}: "${job.title}" (doc id: ${slug})`)
}

main().catch(err => { console.error(err); process.exit(1) })

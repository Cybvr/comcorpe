/**
 * Seed a treatment plan (diagnosis) for every job in the collection.
 *
 * Uses the Firebase CLIENT SDK — no service account or ADC needed.
 *
 * Run:
 *   npx tsx scripts/seed-treatment-plan.ts
 *
 * PowerShell (if overriding credentials):
 *   $env:FIREBASE_EMAIL="you@example.com"
 *   $env:FIREBASE_PASSWORD="yourpassword"
 *   npx tsx scripts/seed-treatment-plan.ts
 *
 * Fallbacks:
 *   FIREBASE_EMAIL defaults to jide.pinheiro@comcorpe.com
 *   FIREBASE_PASSWORD falls back to COMCORPE_LOGIN_PASSWORD from .env.local
 */

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app  = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db   = getFirestore(app)

// ── Edit the diagnosis content here ──────────────────────────────────────────
const PLAN_CONTENT = `<h2>Root Causes</h2><p>The core growth problem stems from weak brand recall in the target segment and messaging that speaks to product features rather than the customer's lived problem.</p><h2>Key Barriers</h2><ul><li><p>Sales cycle stretched by unclear value proposition at first contact</p></li><li><p>No published case studies or social proof to de-risk the purchase decision</p></li></ul><h2>Audience Insights</h2><p>Decision-makers prioritise speed-to-value over cost. The primary buyer is C-suite but the internal champion pushing for evaluation is typically a mid-level ops or growth lead. Competitive comparison content is the dominant trigger.</p><h2>Messaging Recommendations</h2><p>Lead every touchpoint with outcome language ("grow revenue, not headcount") rather than a feature list. Introduce one comparable-company case study within 90 days. Replace generic CTAs with urgency-framed offers tied to a specific result.</p><h2>Growth Levers</h2><ol><li><p>Referral programme targeting existing happy customers</p></li><li><p>Outbound sequence aimed at ops leads at Series B–C companies</p></li><li><p>SEO content targeting high-intent comparison keywords</p></li></ol>`
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const email = (
    process.env.FIREBASE_EMAIL ??
    'jide.pinheiro@comcorpe.com'
  ).trim().toLowerCase()
  const password = (
    process.env.FIREBASE_PASSWORD ??
    process.env.COMCORPE_LOGIN_PASSWORD ??
    ''
  ).trim()

  if (!password) {
    console.error('Set FIREBASE_PASSWORD or COMCORPE_LOGIN_PASSWORD before running.')
    process.exit(1)
  }

  console.log(`Signing in as ${email}...`)
  await signInWithEmailAndPassword(auth, email, password)
  console.log('Signed in ✓\n')

  const jobsSnap = await getDocs(collection(db, 'jobs'))
  if (jobsSnap.empty) { console.error('No jobs found.'); process.exit(1) }

  let created = 0
  let updated = 0

  for (const jobDoc of jobsSnap.docs) {
    const jobSlug = jobDoc.data().slug ?? jobDoc.id

    const existing = await getDocs(
      query(collection(db, 'treatmentPlans'), where('jobSlug', '==', jobSlug))
    )

    const planId = existing.empty
      ? `plan_${jobSlug}`
      : existing.docs[0].id

    await setDoc(doc(db, 'treatmentPlans', planId), {
      jobSlug,
      content: PLAN_CONTENT,
      createdAt: new Date().toISOString(),
    }, { merge: true })

    if (existing.empty) {
      console.log(`  ✅ Created plan for "${jobDoc.data().title}" (${jobSlug})`)
      created++
    } else {
      console.log(`  ♻️  Updated plan for "${jobDoc.data().title}" (${jobSlug})`)
      updated++
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated.`)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })

/**
 * One-time migration: prepend an "Onboarding" milestone to every job
 * that doesn't already have one as its first milestone.
 *
 * Uses the firebase CLIENT SDK — no service account or ADC needed.
 * Just needs a Firebase user with read/write access to the jobs collection.
 *
 * Run:
 *   FIREBASE_EMAIL=you@example.com FIREBASE_PASSWORD=yourpassword npx tsx scripts/migrate-onboarding-milestone.ts
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
  getDocs,
  doc,
  updateDoc,
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

const ONBOARDING_MILESTONE = {
  id:     'onboarding',
  title:  'Onboarding',
  date:   '',
  status: 'completed', // already done for existing jobs
  amount: '$18,000',
}

const DIAGNOSIS_MILESTONE = {
  id:     'diagnosis',
  title:  'Diagnosis',
  date:   '',
  status: 'pending' as const,
  amount: '$10,000',
}

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

  const snap = await getDocs(collection(db, 'jobs'))

  if (snap.empty) {
    console.log('No jobs found.')
    return
  }

  let patched = 0
  let skipped = 0

  for (const docSnap of snap.docs) {
    const data       = docSnap.data()
    const milestones = [...((data.milestones ?? []) as any[])]

    const onboardingIndex = milestones.findIndex(
      (ms) => ms?.id === 'onboarding' || ms?.title?.toLowerCase() === 'onboarding'
    )

    if (onboardingIndex === -1) {
      milestones.unshift({ ...ONBOARDING_MILESTONE })
    } else {
      milestones[onboardingIndex] = {
        ...milestones[onboardingIndex],
        ...ONBOARDING_MILESTONE,
      }

      if (onboardingIndex !== 0) {
        const [onboarding] = milestones.splice(onboardingIndex, 1)
        milestones.unshift(onboarding)
      }
    }

    const diagnosisIndex = milestones.findIndex((ms, index) => {
      if (index === 0) return false
      const title = ms?.title?.toLowerCase?.() ?? ''
      return title.includes('diagnos')
    })

    if (diagnosisIndex === -1) {
      milestones.splice(1, 0, { ...DIAGNOSIS_MILESTONE })
    } else {
      milestones[diagnosisIndex] = {
        ...milestones[diagnosisIndex],
        ...DIAGNOSIS_MILESTONE,
        amount: '$10,000',
      }

      if (diagnosisIndex !== 1) {
        const [diagnosis] = milestones.splice(diagnosisIndex, 1)
        milestones.splice(1, 0, diagnosis)
      }
    }

    const nextMilestone = milestones.find((ms, index) => index > 0 && ms.status !== 'completed')?.title

    // JSON.stringify is key-order sensitive; Firestore may return different ordering.
    // Normalise by sorting keys before comparing.
    const stable = (val: unknown): string =>
      JSON.stringify(val, (_k, v) =>
        v && typeof v === 'object' && !Array.isArray(v)
          ? Object.fromEntries(Object.keys(v as object).sort().map(k => [k, (v as any)[k]]))
          : v
      )

    const before = stable(data.milestones ?? [])
    const after  = stable(milestones)

    if (before === after && data.nextMilestone === nextMilestone) {
      console.log(`  ⏭  Skipping "${data.title}" — already up to date`)
      skipped++
      continue
    }

    await updateDoc(doc(db, 'jobs', docSnap.id), {
      milestones,
      ...(nextMilestone ? { nextMilestone } : {}),
    })

    console.log(`  ✅ Patched "${data.title}" (${docSnap.id})`)
    patched++
  }

  console.log(`\nDone. ${patched} patched, ${skipped} skipped.`)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })

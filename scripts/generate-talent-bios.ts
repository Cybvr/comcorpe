/**
 * One-time migration: generate concise talent bios for every talent profile
 * in Firestore, then write them back to the `desc` field.
 *
 * Uses the firebase CLIENT SDK — no service account or ADC needed.
 * Just needs a Firebase user with read/write access to the users collection.
 *
 * Run a dry run first:
 *   npx tsx scripts/generate-talent-bios.ts
 *
 * Apply changes:
 *   npx tsx scripts/generate-talent-bios.ts --apply
 *
 * Overwrite existing non-trivial bios too:
 *   npx tsx scripts/generate-talent-bios.ts --apply --overwrite
 *
 * Fallbacks:
 *   FIREBASE_EMAIL defaults to jide.pinheiro@comcorpe.com
 *   FIREBASE_PASSWORD falls back to COMCORPE_LOGIN_PASSWORD from .env.local
 */

import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

type TalentDoc = {
  role?: string
  name?: string
  talentRole?: string
  industry?: string
  bg?: string
  desc?: string
  rate?: string
  location?: string
  yearsExp?: string
  disciplines?: string[]
  availability?: string
  highlights?: string[]
  networkAffiliations?: string[]
}

const APPLY = process.argv.includes('--apply')
const OVERWRITE = process.argv.includes('--overwrite')

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function cleanText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim()
    : ''
}

function stripTrailingPunctuation(value: string) {
  return value.replace(/[.,;:!?]+$/g, '').trim()
}

function toSentence(value: string) {
  const trimmed = cleanText(value)
  if (!trimmed) return ''
  const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`
}

function joinList(items: string[]) {
  const cleanItems = items.map(cleanText).filter(Boolean)
  if (cleanItems.length === 0) return ''
  if (cleanItems.length === 1) return cleanItems[0]
  if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`
  return `${cleanItems.slice(0, -1).join(', ')}, and ${cleanItems[cleanItems.length - 1]}`
}

function experienceLabel(yearsExp: string) {
  const value = cleanText(yearsExp)
  if (!value) return ''
  if (value.includes('15+')) return 'senior'
  if (value.includes('9-14')) return 'seasoned'
  if (value.includes('5-8')) return 'experienced'
  if (value.includes('2-4')) return 'emerging'
  return ''
}

function buildIntro(profile: TalentDoc) {
  const name = cleanText(profile.name) || 'This operator'
  const role = cleanText(profile.talentRole) || 'specialist operator'
  const industry = cleanText(profile.industry)
  const location = cleanText(profile.location)
  const seniority = experienceLabel(profile.yearsExp ?? '')

  const article = /^[aeiou]/i.test(role) ? 'an' : 'a'
  const rolePhrase = seniority ? `${seniority} ${role}` : role
  const sectorPhrase = industry ? ` focused on ${industry.toLowerCase()}` : ''
  const locationPhrase = location ? ` based in ${location}` : ''

  return `${name} is ${article} ${rolePhrase}${sectorPhrase}${locationPhrase}`
}

function buildBackground(profile: TalentDoc) {
  const bg = cleanText(profile.bg)
  if (bg) {
    return `With a background in ${stripTrailingPunctuation(bg)}, they bring sharp commercial judgment and hands-on execution to complex growth work`
  }

  const disciplines = (profile.disciplines ?? []).map(cleanText).filter(Boolean)
  if (disciplines.length > 0) {
    return `Their work spans ${joinList(disciplines.slice(0, 3))}, helping teams move from strategy into delivery with clarity`
  }

  const network = (profile.networkAffiliations ?? []).map(cleanText).filter(Boolean)
  if (network.length > 0) {
    return `They combine strategic thinking with operating discipline, with network experience across ${joinList(network.slice(0, 2))}`
  }

  return 'They combine strategic thinking with practical delivery, helping clients turn ambitious briefs into structured progress'
}

function buildCloser(profile: TalentDoc) {
  const highlights = (profile.highlights ?? []).map(cleanText).filter(Boolean)
  if (highlights.length > 0) {
    return highlights[0]
  }

  const availability = cleanText(profile.availability)
  const rate = cleanText(profile.rate)

  if (availability && rate) {
    return `Available ${availability.toLowerCase()} with commercial flexibility around ${rate}`
  }

  if (availability) {
    return `Available ${availability.toLowerCase()} for briefs that need fast alignment and accountable execution`
  }

  if (rate) {
    return `Operates with clear commercial expectations around ${rate}`
  }

  return 'Best suited to briefs that need structured thinking, speed, and dependable follow-through'
}

function buildBio(profile: TalentDoc) {
  const parts = [
    toSentence(buildIntro(profile)),
    toSentence(buildBackground(profile)),
    toSentence(buildCloser(profile)),
  ].filter(Boolean)

  return cleanText(parts.join(' '))
}

function shouldSkipExisting(desc: string) {
  return !OVERWRITE && cleanText(desc).length > 0
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
  console.log('Signed in.\n')

  const snap = await getDocs(collection(db, 'users'))
  const talentDocs = snap.docs.filter((docSnap) => (docSnap.data().role ?? '') === 'talent')

  if (talentDocs.length === 0) {
    console.log('No talent profiles found.')
    return
  }

  let generated = 0
  let skipped = 0
  let unchanged = 0

  for (const docSnap of talentDocs) {
    const data = docSnap.data() as TalentDoc
    const existingDesc = cleanText(data.desc)

    if (shouldSkipExisting(existingDesc)) {
      console.log(`SKIP ${docSnap.id} (${data.name ?? 'Unknown'}) — existing bio already populated`)
      skipped++
      continue
    }

    const nextDesc = buildBio(data)
    if (!nextDesc) {
      console.log(`SKIP ${docSnap.id} (${data.name ?? 'Unknown'}) — not enough profile data to build bio`)
      skipped++
      continue
    }

    if (existingDesc === nextDesc) {
      console.log(`OK   ${docSnap.id} (${data.name ?? 'Unknown'}) — generated bio matches existing`)
      unchanged++
      continue
    }

    console.log(`\n${APPLY ? 'WRITE' : 'PLAN '} ${docSnap.id} (${data.name ?? 'Unknown'})`)
    console.log(`  role: ${data.talentRole ?? '—'}`)
    if (existingDesc) console.log(`  old:  ${existingDesc}`)
    console.log(`  new:  ${nextDesc}`)

    if (APPLY) {
      await updateDoc(doc(db, 'users', docSnap.id), {
        desc: nextDesc,
      })
    }

    generated++
  }

  console.log(`\nDone. ${generated} ${APPLY ? 'written' : 'planned'}, ${unchanged} unchanged, ${skipped} skipped.`)
  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to write bios.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

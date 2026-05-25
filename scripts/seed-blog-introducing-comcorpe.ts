/**
 * One-time script to seed the "Introducing Comcorpe" blog post into Firestore.
 *
 * Prerequisites:
 *   1. Download a service account JSON from Firebase Console →
 *      Project Settings → Service Accounts → Generate new private key
 *   2. Set GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json
 *
 * Run:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json npx tsx scripts/seed-blog-introducing-comcorpe.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string) })
}

const db = getFirestore()

const slug = 'introducing-comcorpe'

const post = {
  slug,
  title: 'Introducing Comcorpe: The Operating Layer Your Growth Function Has Been Missing',
  excerpt:
    'Enterprise growth teams are not short of ambition. They are short of the right infrastructure to act on it. Comcorpe was built to fix that.',
  body: `Enterprise growth teams are not short of ambition. They are short of the right infrastructure to act on it.

Strategy consultants diagnose the problem. Agencies execute a slice of it. Internal teams manage the gap in between — and absorb all the friction that comes with it. The result is a growth function that moves slower than the market it is trying to capture.

Comcorpe was built to fix that.

We are a growth systems company.

That means we do not sell services. We architect, assemble, and operate growth engines — unified systems that collapse the distance between a commercial problem and a delivered outcome.

Our model is built around specialist pods: curated groups of operators assembled specifically around the shape of your problem. Not a bench of generalists. Not a retained agency relationship. The right people, scoped to a defined outcome, activated fast.

How it works in practice

When a growth challenge surfaces — whether it is a new market entry, a revenue model that needs rebuilding, or a product that needs to reach the right audience at scale — your team opens the Comcorpe marketplace with a clear brief. Talent is filtered against the real shape of the problem, not a job title. Profiles are reviewed across experience, seniority, and expected impact. Stakeholders approve the scope and budget. Contracts and onboarding happen on-platform. The pod moves into execution with full visibility from brief to output.

The entire flow is designed to remove the lag that normally sits between diagnosis, staffing, approval, and delivery. It is repeatable by design.

Where we operate

We concentrate on high-impact sectors across Pan-Africa: Technology and Fintech, Public Infrastructure, and Consumer Ecosystems. These are markets where growth is complex, where the right operators are hard to find through conventional channels, and where the cost of moving slowly is high.

Built for enterprise

Comcorpe is designed for organisations that already know what growth should look like but struggle to assemble and activate the right capability around it — quickly enough to matter. The platform handles the administrative layer so your team can stay focused on outcomes.

If you already know the problem you need to solve, we can help you shape the brief and configure the right pod around it.`,
  category: 'Announcements',
  publishedAt: '25 May 2026',
  author: 'Comcorpe',
}

async function main() {
  const blogCol = db.collection('blog')

  const existing = await blogCol.doc(slug).get()
  if (existing.exists) {
    console.log(`Post "${slug}" already exists — skipping.`)
    process.exit(0)
  }

  const id = Date.now().toString()
  await blogCol.doc(id).set({ id, ...post })
  console.log(`Created blog post: "${post.title}" (doc id: ${id})`)
}

main().catch(err => { console.error(err); process.exit(1) })

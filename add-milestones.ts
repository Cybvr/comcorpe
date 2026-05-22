import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching jobs from Firebase...");
  const jobsSnap = await getDocs(collection(db, 'jobs'));
  const allJobs = jobsSnap.docs.map(d => ({ docId: d.id, ...d.data() }));

  // Find the MTN job
  const mtnJob = allJobs.find((j: any) =>
    j.docId.toLowerCase().includes('mtn') ||
    (j.title && j.title.toLowerCase().includes('mtn'))
  );

  if (!mtnJob) {
    console.error("❌ No MTN job found in Firebase. Existing jobs:");
    allJobs.forEach((j: any) => console.log(`  - ${j.docId}: ${j.title}`));
    process.exit(1);
  }

  console.log(`✅ Found MTN job: "${(mtnJob as any).title}" (doc: ${mtnJob.docId})`);
  console.log(`   Current status: ${(mtnJob as any).status}`);
  console.log(`   Current milestones: ${(mtnJob as any).milestones?.length ?? 0}`);

  // 4 milestones based on the CBN Stability campaign framework from the image
  const milestones = [
    {
      id: 'ms-1',
      title: 'Behavioural Diagnostics & Brief Delivery',
      date: '2026-06-06',
      status: 'pending' as const,
    },
    {
      id: 'ms-2',
      title: 'Opportunity Intelligence & Strategic Systems Insight',
      date: '2026-06-20',
      status: 'pending' as const,
    },
    {
      id: 'ms-3',
      title: 'Embedded Intelligence Partnership & Living Measurement Framework',
      date: '2026-07-11',
      status: 'pending' as const,
    },
    {
      id: 'ms-4',
      title: 'Influence System Deployment & Orchestrated Behaviour-Change System',
      date: '2026-07-25',
      status: 'pending' as const,
    },
  ];

  console.log("\nAdding 4 milestones:");
  milestones.forEach((m, i) => console.log(`  ${i + 1}. ${m.title} (${m.date})`));

  await setDoc(doc(db, 'jobs', mtnJob.docId), {
    milestones,
    phase: 'Phase 1 — Diagnostics',
    nextMilestone: milestones[0].title,
    progress: 0,
    updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
  }, { merge: true });

  console.log("\n✅ Milestones pushed to Firebase successfully.");
  console.log("DONE.");
}

run().catch(console.error);

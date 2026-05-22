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
  console.log("Searching for Jide Pinheiro admin user...");
  const usersSnap = await getDocs(collection(db, 'users'));
  let jideUser = usersSnap.docs.find(d => {
    const data = d.data();
    return (data.name && data.name.toLowerCase().includes('jide')) ||
           (data.email && data.email.toLowerCase().includes('jide'));
  });

  let jideId = 'jide-pinheiro';
  if (jideUser) {
    console.log("Found existing admin user:", jideUser.id);
    jideId = jideUser.id;
    // Ensure role is admin
    await setDoc(doc(db, 'users', jideUser.id), { role: 'admin' }, { merge: true });
  } else {
    console.log("Creating admin user 'jide-pinheiro'...");
    await setDoc(doc(db, 'users', 'jide-pinheiro'), {
      id: 'jide-pinheiro',
      name: 'Jide Pinheiro',
      initials: 'JP',
      role: 'admin',
      email: 'jide.pinheiro@comcorpe.com',
      isOnboarded: true,
      company: 'Comcorpe',
    });
    console.log("Admin user created.");
  }

  console.log("Fetching existing jobs...");
  const jobsSnap = await getDocs(collection(db, 'jobs'));
  const jobsList = jobsSnap.docs.map(d => d.data());
  const maxId = jobsList.reduce((max: number, j: any) => Math.max(max, j.id || 0), 0);
  const nextId = maxId + 1;

  const jobSlug = 'mtn-nigeria-value-cost-perception-strategy';

  // Check if job already exists
  const existingJob = jobsList.find((j: any) => j.slug === jobSlug);
  if (existingJob) {
    console.log("Job already exists, updating clientId to", jideId);
    await setDoc(doc(db, 'jobs', jobSlug), { clientId: jideId }, { merge: true });
  } else {
    const newJob = {
      id: nextId,
      slug: jobSlug,
      title: 'MTN Nigeria Value & Cost Perception Strategy',
      clientId: jideId,
      type: 'PROJECT',
      status: 'Scoping',
      summary: "Analyze and redesign MTN Nigeria's tariff structures, communications, and value perception to address customer complaints regarding high costs, while building a premium digital strategy that justifies pricing.",
      rate: '$65k - $120k',
      location: 'Lagos / Remote',
      time: '10-week engagement',
      tags: ['STRATEGY', 'TELECOM', 'PRICING', 'NIGERIA'],
      updatedAt: `Updated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      scope: [
        'Conduct comprehensive competitive analysis of Nigerian telecom pricing structures.',
        'Design behavior-based user rewards and loyalty programs to offset perceived expenses.',
        'Develop positioning frameworks and micro-campaign plans to highlight service quality and network reliability over sheer price.'
      ],
      requirements: [
        'Deep expertise in telecom product management or strategy in emerging markets.',
        'Experience working with major mobile network operators (MNOs) in Sub-Saharan Africa.',
        'Strong visual storytelling and financial engineering capability.'
      ],
    };
    await setDoc(doc(db, 'jobs', jobSlug), newJob);
    console.log("Job created successfully:", jobSlug);
  }

  console.log("DONE.");
}

run().catch(console.error);

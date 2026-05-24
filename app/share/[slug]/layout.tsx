import type { Metadata } from 'next'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'comcorpe'
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ''

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/jobs/${slug}?key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      const title = data.fields?.title?.stringValue
      if (title) return { title }
    }
  } catch {}
  return { title: 'Brief' }
}

export default function ShareSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

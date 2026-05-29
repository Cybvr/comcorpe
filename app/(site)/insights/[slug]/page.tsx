import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `${slug} | Blog`,
    description: 'Pan-African telecoms and fintech insights for market growth systems.',
  }
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/blog/${slug}`)
}

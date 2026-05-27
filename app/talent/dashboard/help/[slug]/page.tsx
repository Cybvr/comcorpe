import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { getHelpTopic, helpTopics } from '@/lib/help'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return helpTopics.map((topic) => ({ slug: topic.slug }))
}

export default async function TalentHelpTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = getHelpTopic(slug)

  if (!topic) notFound()

  return (
    <div className="px-8 py-8 max-w-[920px] mx-auto">
      <Link href="/talent/dashboard/help" className="font-text text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 mb-8">
        <ArrowLeft size={14} strokeWidth={1.5} />
        Help centre
      </Link>

      <div className="border-b border-border pb-8 mb-8">
        <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-3">Talent help</p>
        <h1 className="font-display font-black text-[18px] tracking-[-0.03em] text-foreground leading-none md:text-[20px]">{topic.title}</h1>
        <p className="font-text text-[16px] leading-relaxed text-muted-foreground mt-5 max-w-[62ch]">{topic.body}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">
        <div className="space-y-8">
          {topic.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground leading-tight">{section.title}</h2>
              <p className="font-text text-[15px] leading-relaxed text-muted-foreground mt-3">{section.body}</p>
            </section>
          ))}
        </div>

        <aside className="border border-border rounded-xl p-5 bg-background">
          <h2 className="font-display font-black text-[16px] tracking-[-0.01em] text-foreground">Quick checklist</h2>
          <div className="mt-4 space-y-3">
            {topic.checklist.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 size={15} strokeWidth={1.7} className="text-primary shrink-0 mt-0.5" />
                <p className="font-text text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

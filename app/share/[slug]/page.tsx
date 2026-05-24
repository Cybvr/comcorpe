'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Tag, CheckCircle2, ExternalLink, Target, LayoutDashboard } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Job } from '@/lib/jobs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const statusStyles: Record<string, string> = {
  'Active':     'bg-green-50 text-green-700 border-green-100',
  'Completed':  'bg-primary/10 text-primary border-primary/20',
  'Paused':     'bg-orange-50 text-orange-700 border-orange-100',
  'Scoping':    'bg-border text-muted-foreground border-border',
  'Pod review': 'bg-accent/10 text-accent border-accent/20',
  'Cancelled':  'bg-red-50 text-red-600 border-red-200',
}

const milestoneStyles: Record<string, string> = {
  completed:   'bg-primary/10 text-primary border-primary/20',
  'in-progress': 'bg-accent/5 text-accent border-accent/20',
  pending:     'bg-border text-muted-foreground/70 border-input',
}

export default function PublicJobPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'jobs', slug),
      (snap) => {
        setJob(snap.exists() ? (snap.data() as Job) : null)
        setLoading(false)
      },
      () => {
        setJob(null)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!job || !job.sharedPublicly) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display font-black text-2xl text-foreground">This brief is private</p>
        <p className="font-text text-sm text-muted-foreground max-w-xs">
          The owner hasn&apos;t enabled public sharing for this engagement.
        </p>
        <Link href="/" className="font-text text-sm font-semibold text-primary hover:underline">
          Go to Comcorpe →
        </Link>
      </div>
    )
  }

  const milestones = job.milestones ?? []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-[860px] mx-auto flex items-center justify-between">
          <Image
            src="/images/comcorpe.png"
            alt="Comcorpe"
            width={118}
            height={24}
            className="h-6 w-auto object-contain dark:invert"
            priority
          />
          <a
            href="mailto:hello@comcorpe.com"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-full font-text text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Get in touch <ExternalLink size={11} />
          </a>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-10">
        {/* Title block */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 rounded-sm border ${statusStyles[job.status] ?? statusStyles['Scoping']}`}>
              {job.status}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/50">
              {job.type}
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-[-0.03em] text-foreground leading-tight mb-5">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground/70">
            {job.location && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <MapPin size={13} /> {job.location}
              </span>
            )}
            {job.time && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <Clock size={13} /> {job.time}
              </span>
            )}
            {job.tags.length > 0 && (
              <span className="flex items-center gap-1.5 font-text text-sm">
                <Tag size={13} /> {job.tags.join(' · ')}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="brief" className="w-full">
          <div className="mb-8 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex w-max min-w-full justify-start">
              <TabsTrigger value="brief" className="flex items-center gap-2">
                <Target size={14} /> Brief
              </TabsTrigger>
              {milestones.length > 0 && (
                <TabsTrigger value="milestones" className="flex items-center gap-2">
                  <LayoutDashboard size={14} /> Milestones
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Brief */}
          <TabsContent value="brief" className="mt-0 space-y-10">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Overview</h2>
              <p className="font-text text-base leading-relaxed text-muted-foreground max-w-[70ch]">
                {job.summary}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Scope of work</h2>
                <ul className="space-y-3">
                  {job.scope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                      <span className="font-text text-sm text-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                      <span className="font-text text-sm text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-display font-black text-lg tracking-tight text-foreground">Interested in this engagement?</p>
                <p className="font-text text-sm text-muted-foreground mt-1">Reach out to the Comcorpe team to start a conversation.</p>
              </div>
              <a
                href="mailto:hello@comcorpe.com"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Get in touch
              </a>
            </section>
          </TabsContent>

          {/* Milestones */}
          <TabsContent value="milestones" className="mt-0">
            <section className="border-t border-border pt-6">
              <h2 className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mb-6">Engagement milestones</h2>
              <div className="border border-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Status</th>
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold">Milestone</th>
                      <th className="px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 font-semibold w-[120px]">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {milestones.map((ms) => (
                      <tr key={ms.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8px] font-bold border uppercase tracking-wider ${milestoneStyles[ms.status] ?? milestoneStyles.pending}`}>
                            {ms.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-text text-sm font-bold text-foreground">{ms.title}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-text text-[10px] text-muted-foreground/70 uppercase tracking-tight">{ms.date}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="border-t border-border mt-16 pt-8 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/40">
            Powered by Comcorpe
          </p>
          <Link href="/" className="font-text text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
            comcorpe.com
          </Link>
        </footer>
      </main>
    </div>
  )
}

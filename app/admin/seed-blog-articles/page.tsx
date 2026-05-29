'use client'

import { useEffect, useState } from 'react'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const ARTICLES = [
  {
    slug: 'when-the-rules-break-africa-needs-pressure-not-persuasion',
    title: 'When the rules break: Africa needs pressure, not persuasion',
    excerpt:
      'In a region where institutions are increasingly judged in real time, political authority is no longer sustained by speeches alone.',
    body: `In a region where institutions are increasingly judged in real time, political authority is no longer sustained by speeches alone. It is sustained by whether people can feel the state in the price of food, the reliability of power, the speed of service delivery, and the credibility of the public record. Pressure, not persuasion, is now the dominant political force.

The old model assumed that legitimacy could be managed from the centre through messaging, patronage, and periodic elections. That model is deteriorating. Digital-native citizens no longer wait for formal channels to explain failure to them. They document it, amplify it, and compare it across borders. A government that cannot act locally will eventually be judged globally.

This changes the logic of governance. The challenge is no longer whether leaders can defend an idea of the state. It is whether the state can still perform as an everyday institution. Proximity matters more than rhetoric, and responsiveness matters more than ceremony. When the gap between promise and experience becomes too large, public trust collapses quickly and often without warning.

For businesses, the signal is equally clear. Organisations operating in fragile environments can no longer rely on state stability as a proxy for social stability. They must understand the civic mood, the cost of delay, and the practical conditions that shape public consent. In this environment, the institutions that survive are the ones that can deliver value before they request patience.

The era of passive legitimacy is over. What remains is earned, daily, and under pressure.`,
    publishedAt: '17 May 2026',
    meta: '5 min read',
  },
  {
    slug: 'when-the-rules-break-africas-new-economy-is-being-built-outside-formal-employment',
    title: 'When the rules break: Africa’s new economy is being built outside formal employment',
    excerpt:
      'Many policymakers still describe youth unemployment as if the main problem were the absence of jobs. That is only part of the story.',
    body: `Many policymakers still describe youth unemployment as if the main problem were the absence of jobs. That is only part of the story. The deeper issue is that a large share of economic activity is now happening outside the structures designed to recognise it. People are working, earning, learning, and building value in ways that the formal labour market still struggles to measure.

This matters because the old promise of linear progress is breaking down. School, certification, employment, and upward mobility no longer form a reliable sequence for millions of young people. Instead, ambition is being routed through informal trade, digital freelancing, small-scale service work, and platform-mediated income. The economy is not idle. It is simply misclassified.

The policy consequence is serious. If governments only count formal payroll jobs, they will underestimate both the resilience of the population and the scale of exclusion. They will also miss the opportunity to support the transition from informal survival to productive scale. The future is not just about creating jobs; it is about building systems that let people turn effort into durable income.

For firms, this is a strategic invitation. The next competitive advantage will belong to organisations that know how to work with distributed talent, flexible production, and hybrid livelihood models. Companies that treat informal capability as invisible will fall behind. Companies that can recognise it, structure it, and scale it will shape the next generation of growth.

The new economy is already here. The real question is whether institutions are ready to see it.`,
    publishedAt: '8 May 2026',
    meta: '4 min read',
  },
  {
    slug: 'when-the-rules-break-africas-sovereignty-now-includes-data-power-and-food',
    title: 'When the rules break: Africa’s sovereignty now includes data, power, and food',
    excerpt:
      'The language of sovereignty is changing. It once referred primarily to borders, elections, and state authority.',
    body: `The language of sovereignty is changing. It once referred primarily to borders, elections, and state authority. Today it must also include control over data, energy, and food systems, because these are the infrastructures that decide whether a country can govern itself in practice.

If data leaves the continent, value leaves with it. If energy systems remain unreliable, industrial policy becomes theoretical. If food systems remain dependent on imported supply chains, national resilience stays fragile. These are not separate challenges. They are linked expressions of the same weakness: a lack of control over the foundations of economic life.

The result is a strategic vulnerability that many countries underestimate. A state can have a flag, a constitution, and a ministry for every sector, yet still be unable to secure the basic conditions for growth. In that case sovereignty exists on paper, but dependence rules in practice.

The response cannot be symbolic. It must be infrastructural. Governments need more than slogans about self-reliance. They need investment in local capacity, better coordination across sectors, and a stronger relationship between public policy and productive capability. Businesses also have a role to play, but only if they stop treating national development as an abstract backdrop to commercial activity.

The next chapter of sovereignty will be written in servers, substations, warehouses, farms, and logistics corridors. The countries that understand this early will gain leverage. The ones that do not will remain exposed to forces they do not control.`,
    publishedAt: '29 Apr 2026',
    meta: '4 min read',
  },
]

export default function SeedBlogArticlesPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function seedArticles() {
      setStatus('running')

      let created = 0
      let updated = 0

      for (const article of ARTICLES) {
        const existing = await getDocs(
          query(collection(db, 'blog'), where('slug', '==', article.slug))
        )
        const id = existing.empty ? article.slug : existing.docs[0].id

        await setDoc(doc(db, 'blog', id), {
          id,
          ...article,
          category: 'Blog',
          author: 'Comcorpe',
          authorId: '',
          badge: 'Blog',
          role: 'Comcorpe',
          likes: 0,
          replies: 0,
        }, { merge: true })

        if (existing.empty) created += 1
        else updated += 1
      }

      if (!cancelled) {
        setStatus('done')
        setMessage(`${created} created, ${updated} updated.`)
      }
    }

    seedArticles().catch((err) => {
      if (!cancelled) {
        setStatus('error')
        setMessage(err?.message ?? 'Unknown error')
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-12 font-mono text-sm">
      {status === 'running' && <p>Writing blog articles…</p>}
      {status === 'done' && <p className="text-green-600">Blog articles seeded — {message}</p>}
      {status === 'error' && <p className="text-red-600">Error: {message}</p>}
    </div>
  )
}

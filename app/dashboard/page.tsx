'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home, Briefcase, FolderOpen, MessageCircle, CreditCard, Gift,
  HelpCircle, Search, Bell, Settings, MapPin, Clock,
  ChevronRight, Share2, Sun, Moon, Users, Zap,
  BookOpen, Target, TrendingUp, Globe, Plus, ArrowRight,
  RotateCcw, Bookmark, MoreHorizontal,
} from 'lucide-react'

/* ─── Mock data ──────────────────────────────────────────── */

const briefs = [
  {
    id: 1, type: 'RETAINED', client: 'Volta Pay', role: 'Market Entry — Nigeria',
    rate: '$15k – 30k/mo', tags: ['FINTECH', 'PAYMENTS'],
    location: 'Lagos · London', time: 'Any time', saved: false,
  },
  {
    id: 2, type: 'PROJECT', client: 'EazeBank',  role: 'Growth Stagnation · Turnaround',
    rate: '$75k – 150k', tags: ['FINTECH', 'AFRICA'],
    location: 'Nigeria · Remote', time: '3 – 6 months', saved: true,
  },
  {
    id: 3, type: 'EQUITY', client: 'Stealth Co.', role: 'Consumer Brand Ecosystem Build',
    rate: '$25k – 75k + equity', tags: ['FMCG', 'BRAND'],
    location: 'Pan-Africa', time: 'Long-term', saved: false,
  },
]

const applied = [
  { id: 1, client: 'Terra.do', role: 'Growth Strategy Lead', status: 'On hold', date: 'Applied Nov 14' },
]

const spaces = [
  { id: 1, name: 'Lagos Growth Hub',   desc: 'Community for operators and founders scaling in West Africa.', members: '4,200', posts: '12 new posts last week', icon: Globe },
  { id: 2, name: 'Fintech Operators',  desc: 'Share playbooks, intros and war stories from regulated markets.', members: '1,800', posts: '8 new posts last week', icon: Zap },
  { id: 3, name: 'Brand Strategists',  desc: 'Consumer brand builders across FMCG, Telecoms and Gaming.', members: '920',   posts: '5 new posts last week', icon: Target },
]

const topOperators = [
  { id: 1, name: 'Amara Nwosu',    title: 'Growth Architect · Lagos',   initials: 'AN', color: 'bg-violet' },
  { id: 2, name: 'Tobi Adeyemi',   title: 'Fintech Commercial Lead',     initials: 'TA', color: 'bg-blue' },
]

const posts = [
  {
    id: 1, author: 'Yetunde Bello', role: 'Growth Lead · 4 days ago', badge: 'Market Entry',
    title: 'How we secured 3 anchor partnerships in 6 weeks — before launch',
    body: 'The playbook everyone gets wrong is going direct too early. In Nigeria, trust travels through aggregators first. Here\'s the exact sequence we used for a fintech client entering Lagos…',
    likes: 14, replies: 6, category: 'Growth',
  },
  {
    id: 2, author: 'Daniel Osei', role: 'Strategy · 2 days ago', badge: 'Career Advice',
    title: 'Growth strategy vs. growth execution — knowing which one you\'re being hired for',
    body: 'Most briefs conflate the two. Before you submit a proposal, ask: do they need someone to think, or someone to do? The answer changes your pod configuration entirely.',
    likes: 9, replies: 3, category: 'Strategy',
  },
  {
    id: 3, author: 'Kemi Adaora', role: 'Brand Systems · 1 day ago', badge: 'Brand',
    title: 'Consumer trust signals differ market to market — stop using a global template',
    body: 'What converts in Lagos won\'t convert in Nairobi. I\'ve mapped the top 5 trust drivers in 4 African markets. Happy to share the doc with anyone who replies.',
    likes: 22, replies: 11, category: 'Consumer',
  },
]

const badgeColour: Record<string, string> = {
  RETAINED: 'bg-blue/10 text-blue border-blue/20',
  PROJECT:  'bg-violet/10 text-violet border-violet/20',
  EQUITY:   'bg-green-600/10 text-green-700 border-green-600/20',
}

/* ─── Sub-components ─────────────────────────────────────── */

function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full font-display font-black text-[11px] text-paper ${className}`}>
      {initials}
    </div>
  )
}

function SidebarLink({
  icon: Icon, label, href = '#', badge, active = false,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  label: string; href?: string; badge?: number; active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-text text-sm transition-colors duration-150 ${
        active
          ? 'bg-blue/10 text-blue font-semibold'
          : 'text-ink-60 hover:bg-ink-10 hover:text-ink'
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="font-mono text-[10px] font-bold bg-blue text-paper px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [postText, setPostText] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    if (isDark) { document.documentElement.classList.add('dark'); setDarkMode(true) }
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <div className="flex h-screen bg-paper overflow-hidden font-text">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 border-r border-ink-10 flex flex-col h-full overflow-y-auto bg-paper">
        <div className="px-4 pt-5 pb-4 border-b border-ink-10">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/images/comcorpe.png" alt="Comcorpᵉ" className="h-6 w-auto object-contain dark:invert" />
          </Link>
        </div>

        <nav className="flex flex-col gap-0.5 p-3 flex-1">
          <SidebarLink icon={Home}          label="Home"           href="/dashboard" active />
          <SidebarLink icon={Briefcase}     label="Briefs"         href="/case-studies" />
          <SidebarLink icon={FolderOpen}    label="My work" />
          <SidebarLink icon={MessageCircle} label="Growth advice"  badge={3} />
          <SidebarLink icon={CreditCard}    label="Billing" />
          <SidebarLink icon={Gift}          label="Refer & grow" />
        </nav>

        <div className="p-3 border-t border-ink-10">
          <SidebarLink icon={HelpCircle} label="Help centre" />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-13 shrink-0 border-b border-ink-10 flex items-center gap-4 px-6 bg-paper">
          <div className="flex-1 relative max-w-md">
            <Search size={14} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-40" />
            <input
              type="text"
              placeholder="Search briefs, cases and resources"
              className="w-full pl-9 pr-4 py-2 text-sm bg-ink-10/60 border border-transparent rounded-lg text-ink placeholder:text-ink-40 focus:outline-none focus:border-ink-20 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleDark} className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer">
              {darkMode ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer relative">
              <Bell size={14} strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue rounded-full" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-ink-60 hover:bg-ink-10 transition-colors cursor-pointer">
              <Settings size={14} strokeWidth={1.5} />
            </button>
            <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center font-display font-black text-[11px] text-paper ml-1">JP</div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto bg-paper">
          <div className="px-8 py-8 max-w-[1200px] mx-auto">

            {/* Greeting + credits row */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">
                Hi, Jide!
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-ink-10 rounded-full px-4 py-2 text-sm text-ink">
                  <Zap size={14} strokeWidth={1.5} className="text-blue" />
                  <span className="font-mono font-bold text-xs">CCREDITS</span>
                  <span className="font-display font-black text-[18px] leading-none">3</span>
                </div>
                <Link href="/request" className="font-text text-sm font-semibold px-4 py-2 rounded-full bg-ink text-paper hover:bg-blue transition-colors duration-[120ms]">
                  Refer &amp; earn
                </Link>
              </div>
            </div>

            {/* Welcome banner */}
            <div className="bg-ink rounded-xl p-6 mb-8 dark-inv-section relative overflow-hidden">
              <div className="absolute -top-8 -right-8 font-display font-black text-[120px] leading-none tracking-[-0.06em] italic select-none pointer-events-none"
                style={{ background: 'linear-gradient(180deg,rgba(31,77,255,0.25) 0%,rgba(123,59,255,0.08) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                e
              </div>
              <p className="font-mono text-xs text-paper/50 uppercase tracking-eyebrow mb-4">Welcome to Comcorpᵉ</p>
              <div className="grid grid-cols-3 gap-4 relative z-10">
                {[
                  { icon: Briefcase,   title: 'Find your next brief',    cta: 'Browse briefs',  href: '/case-studies' },
                  { icon: MessageCircle, title: 'Get growth strategy help', cta: 'Browse advice',  href: '#' },
                  { icon: Users,       title: 'Refer a client or talent', cta: 'Start referring', href: '/request' },
                ].map(({ icon: Icon, title, cta, href }) => (
                  <div key={title} className="bg-paper/[0.08] rounded-lg p-4 flex flex-col gap-3 border border-paper/[0.12] hover:bg-paper/[0.14] transition-colors">
                    <Icon size={20} strokeWidth={1.5} className="text-blue" />
                    <p className="font-display font-black text-[15px] leading-tight text-paper">{title}</p>
                    <Link href={href} className="font-text text-xs font-semibold px-3 py-1.5 bg-paper/[0.12] text-paper rounded-full hover:bg-blue transition-colors duration-[120ms] w-fit">
                      {cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-[1fr_360px] gap-8">

              {/* ── Left column ── */}
              <div className="flex flex-col gap-8">

                {/* Newest matches */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Your newest matches</h2>
                    <Link href="/case-studies" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
                      View all briefs <ChevronRight size={12} />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {briefs.map(b => (
                      <div key={b.id} className="border border-ink-10 rounded-xl p-5 hover:border-ink-20 hover:shadow-sm transition-all duration-150 bg-paper group cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-ink-10 border border-ink-10 flex items-center justify-center font-display font-black text-[13px] text-ink shrink-0">
                              {b.client[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${badgeColour[b.type]}`}>{b.type}</span>
                              </div>
                              <div className="font-display font-black text-[17px] tracking-[-0.01em] text-ink group-hover:text-blue transition-colors leading-tight">{b.client}</div>
                              <div className="font-text text-sm text-ink-60 mt-0.5 truncate">{b.role}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-display font-black text-[16px] tracking-[-0.02em] text-ink">{b.rate}</div>
                            <div className="flex items-center gap-1 text-ink-40 text-xs mt-1 justify-end">
                              <MapPin size={10} /> {b.location}
                            </div>
                            <div className="flex items-center gap-1 text-ink-40 text-xs mt-0.5 justify-end">
                              <Clock size={10} /> {b.time}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex gap-1.5 flex-wrap">
                            {b.tags.map(t => (
                              <span key={t} className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-60 px-2 py-0.5 border border-ink-10 rounded-sm">{t}</span>
                            ))}
                          </div>
                          <button className="font-text text-xs font-semibold text-blue hover:text-blue-hover transition-colors flex items-center gap-1">
                            View brief <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Applied to */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">I've submitted to</h2>
                    <Link href="#" className="font-text text-xs text-blue hover:underline flex items-center gap-1">
                      View all applications <ChevronRight size={12} />
                    </Link>
                  </div>
                  {applied.map(a => (
                    <div key={a.id} className="border border-ink-10 rounded-xl p-4 flex items-center gap-4 bg-paper hover:border-ink-20 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center font-display font-black text-[12px] text-paper shrink-0">
                        {a.client[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-text text-xs text-ink-40">{a.date}</span>
                          <span className="font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-sm">
                            {a.status}
                          </span>
                        </div>
                        <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight mt-0.5">{a.client}</div>
                        <div className="font-text text-xs text-ink-60">{a.role}</div>
                      </div>
                      <ChevronRight size={16} className="text-ink-40 shrink-0" />
                    </div>
                  ))}
                </section>

                {/* Spaces */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Spaces you might like</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {spaces.map(s => {
                      const Icon = s.icon
                      return (
                        <div key={s.id} className="border border-ink-10 rounded-xl p-4 flex items-start gap-4 bg-paper hover:border-ink-20 hover:shadow-sm transition-all duration-150">
                          <div className="w-10 h-10 rounded-lg bg-blue/10 border border-blue/20 flex items-center justify-center text-blue shrink-0">
                            <Icon size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight">{s.name}</div>
                            <div className="font-text text-xs text-ink-60 mt-0.5 line-clamp-2">{s.desc}</div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="font-mono text-[10px] text-ink-40 uppercase tracking-eyebrow">{s.members} members</span>
                              <span className="w-1 h-1 rounded-full bg-ink-20" />
                              <span className="font-mono text-[10px] text-ink-40">{s.posts}</span>
                            </div>
                          </div>
                          <button className="font-text text-xs font-semibold px-3 py-1.5 border border-ink-20 rounded-full text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-[120ms] shrink-0">
                            Join
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Top operators */}
                <section>
                  <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-4">Get inspired by top operators</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {topOperators.map(op => (
                      <div key={op.id} className="border border-ink-10 rounded-xl p-4 flex items-center gap-3 bg-paper hover:border-ink-20 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-full ${op.color} flex items-center justify-center font-display font-black text-[13px] text-paper shrink-0`}>
                          {op.initials}
                        </div>
                        <div>
                          <div className="font-display font-black text-[15px] tracking-[-0.01em] text-ink leading-tight">{op.name}</div>
                          <div className="font-text text-[11px] text-ink-60">{op.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Refer box */}
                <section className="border border-ink-10 rounded-xl p-6 bg-ink-10/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink mb-1">Refer Clients &amp; Talent</h2>
                      <p className="font-text text-sm text-ink-60 max-w-[36ch]">
                        Share your link and earn 3% of client billings for every client hired, and 1% of talent earnings for every brief landed.
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-paper border border-ink-10 rounded-lg font-mono text-xs text-ink-60 truncate">
                          https://app.comcorpe.e/r/jide...
                        </div>
                        <button className="font-text text-xs font-semibold px-3 py-2 bg-ink text-paper rounded-lg hover:bg-blue transition-colors duration-[120ms]">
                          Copy
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {['Email', 'LinkedIn', 'X / Twitter'].map(ch => (
                          <button key={ch} className="font-mono text-[10px] uppercase tracking-eyebrow px-3 py-1.5 border border-ink-20 rounded-full text-ink-60 hover:border-ink hover:text-ink transition-colors">
                            {ch}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Gift size={28} strokeWidth={1.2} className="text-blue shrink-0 mt-1" />
                  </div>
                </section>

              </div>

              {/* ── Right column ── */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-ink">Growth community</h2>
                  <Link href="#" className="font-text text-xs text-blue hover:underline">View all posts</Link>
                </div>

                {/* Post composer */}
                <div className="border border-ink-10 rounded-xl p-4 bg-paper">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center font-display font-black text-[11px] text-paper shrink-0">JP</div>
                    <input
                      className="flex-1 bg-ink-10/60 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-40 focus:outline-none border border-transparent focus:border-ink-20 transition-colors"
                      placeholder="Ask the community for help"
                      value={postText}
                      onChange={e => setPostText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="font-text text-xs font-semibold px-4 py-2 bg-blue text-white rounded-full hover:bg-blue-hover transition-colors duration-[120ms] flex items-center gap-1.5">
                      <Plus size={12} /> Post
                    </button>
                  </div>
                </div>

                {/* Feed */}
                <div className="flex flex-col gap-3">
                  {posts.map(p => (
                    <div key={p.id} className="border border-ink-10 rounded-xl p-4 bg-paper hover:border-ink-20 transition-colors">
                      {/* Author row */}
                      <div className="flex items-start gap-2.5 mb-3">
                        <div className="w-7 h-7 rounded-full bg-ink-20 flex items-center justify-center font-display font-black text-[10px] text-ink shrink-0">
                          {p.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-black text-[13px] text-ink leading-none">{p.author}</span>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue/10 text-blue border border-blue/20 rounded-sm uppercase tracking-eyebrow">{p.badge}</span>
                          </div>
                          <div className="font-text text-[11px] text-ink-40 mt-0.5">{p.role}</div>
                        </div>
                        <button className="text-ink-40 hover:text-ink transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      {/* Content */}
                      <h3 className="font-display font-black text-[14px] tracking-[-0.01em] text-ink leading-snug mb-1.5">{p.title}</h3>
                      <p className="font-text text-[12px] leading-relaxed text-ink-60 line-clamp-3">{p.body}</p>
                      <button className="font-text text-[11px] text-blue hover:underline mt-1">Read more</button>
                      {/* Actions */}
                      <div className="mt-3 pt-3 border-t border-ink-10 flex items-center gap-4">
                        <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors">
                          <TrendingUp size={12} /> {p.likes}
                        </button>
                        <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors">
                          <MessageCircle size={12} /> {p.replies}
                        </button>
                        <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors">
                          <Share2 size={12} />
                        </button>
                        <button className="flex items-center gap-1.5 font-text text-xs text-ink-40 hover:text-ink transition-colors ml-auto">
                          <Bookmark size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load more */}
                <button className="font-text text-sm text-ink-60 hover:text-ink transition-colors flex items-center gap-2 justify-center py-3 border border-ink-10 rounded-xl hover:border-ink-20">
                  <RotateCcw size={13} /> Load more posts
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

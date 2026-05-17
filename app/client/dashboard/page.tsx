'use client'

import { 
  ArrowUpRight, 
  Briefcase, 
  ChevronRight, 
  Clock, 
  CreditCard, 
  LayoutDashboard, 
  MessageSquare, 
  Search,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { pods } from '@/lib/pods'
import GrowthCommunity from '@/components/dashboard/GrowthCommunity'
import { getTalentProfile } from '@/lib/user'
import { jobs, type JobStatus, getJobProgress } from '@/lib/jobs'
import { invoices } from '@/lib/invoices'
import { currentUser, useCurrentUser } from '@/lib/user'
import ClientDashboardLoading from './loading'

export default function ClientDashboardHome() {
  const { user: currentUser, loading } = useCurrentUser()
  
  if (loading) {
    return <ClientDashboardLoading />
  }

  const activeJobs = jobs.filter(j => j.status === 'Active' && j.clientId === currentUser.clientId)
  const primaryPods = pods.slice(0, 2)
  
  const slackMessages = [
    {
      id: 1,
      user: "Wanjiku Mwangi",
      role: "Pod Lead",
      content: "Hey @Jide, I've just uploaded the revised Q3 strategic roadmap for the AI Governance project. Let me know if the milestones align.",
      time: "10:24 AM",
      avatar: "WM",
      color: "bg-primary/10 text-primary"
    },
    {
      id: 2,
      user: "Kwame Mensah",
      role: "Technical Architect",
      content: "The initial security audit for the LLM deployment is complete. No critical vulnerabilities found. Summary is in #project-alpha.",
      time: "9:45 AM",
      avatar: "KM",
      color: "bg-amber-100 text-amber-700"
    },
    {
      id: 3,
      user: "Awa Kone",
      role: "Operator",
      content: "Just a heads up that we're onboarding the two specialist consultants for the data pipeline optimization tomorrow morning.",
      time: "Yesterday",
      avatar: "AK",
      color: "bg-green-600/10 text-green-700"
    },
    {
      id: 4,
      user: "Thandi Mokoena",
      role: "Designer",
      content: "The new UX prototypes for the enterprise dashboard are ready for review. I've incorporated the feedback from our last session.",
      time: "Yesterday",
      avatar: "TM",
      color: "bg-purple-100 text-purple-700"
    },
    {
      id: 5,
      user: "Comcorpe Bot",
      role: "System",
      content: "New milestone reached: 'Initial Scoping' for Supply Chain Optimization has been marked as complete.",
      time: "2 days ago",
      avatar: "CB",
      color: "bg-border text-muted-foreground"
    }
  ]
  
  const companyInvoices = invoices.filter(i => i.clientId === currentUser.clientId)
  
  const totalSpend = companyInvoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, inv) => acc + inv.amountRaw, 0)
  
  const companyJobs = jobs.filter(j => j.clientId === currentUser.clientId)
  const uniqueOperators = new Set(companyJobs.map(j => j.lead).filter(Boolean)).size
  const avgUtilization = Math.round(activeJobs.reduce((acc, j) => acc + getJobProgress(j), 0) / (activeJobs.length || 1))

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-primary mb-2">Dashboard</p>
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-tight">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="font-text text-muted-foreground mt-1">You have {activeJobs.length} active projects and {slackMessages.length} new messages.</p>
          </div>
          <Link 
            href="/client/dashboard/jobs/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-text text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-[120ms] group"
          >
            Create new brief <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Main Content Area */}
        <div className="space-y-10">
          {/* AI Strategic Summary - INTEGRATED */}
          <section className="p-6 bg-primary/5 border border-primary/10 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 text-primary mb-4">
              <Sparkles size={18} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-black">AI Strategic Summary</span>
            </div>
            <h2 className="font-display font-black text-2xl text-foreground mb-2">Hello {currentUser.name.split(' ')[0]}, you have 1 major growth opportunity.</h2>
            <p className="font-text text-muted-foreground text-sm max-w-2xl mb-6 leading-relaxed">
              Claude has analyzed your active pods and project velocity. We suggest expanding your <span className="font-semibold text-foreground">AI Governance</span> pod to include 2 more security specialists based on Q3 projections.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-primary/10 rounded-lg shadow-sm">
                <TrendingUp size={14} className="text-green-600" />
                <span className="font-text text-xs font-semibold text-foreground">+12% Velocity</span>
              </div>
              <button className="font-text text-xs text-primary font-bold hover:underline flex items-center gap-1">
                View full analysis <ArrowUpRight size={12} />
              </button>
            </div>
          </section>

          {/* Slack Messages Feed */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Recent messages</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold italic">Slack Live</span>
              </div>
            </div>
            <div className="bg-background border border-border rounded-2xl divide-y divide-muted overflow-hidden">
              {slackMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className="p-5 hover:bg-muted/30 transition-colors group cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl ${msg.color} flex items-center justify-center font-display font-black text-xs shrink-0 border border-border/10`}>
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-[15px] text-foreground">{msg.user}</span>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/70 px-1.5 py-0.5 bg-muted rounded-sm">{msg.role}</span>
                        </div>
                        <span className="font-text text-[11px] text-muted-foreground/70 whitespace-nowrap">{msg.time}</span>
                      </div>
                      <p className="font-text text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground transition-colors">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 bg-muted/50 hover:bg-muted transition-colors font-text text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 border-t border-muted">
                View thread history in Slack
              </button>
            </div>
          </section>

          {/* Active Work / Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Active work</h2>
              <Link href="/client/dashboard/jobs" className="font-text text-xs text-primary hover:underline flex items-center gap-1">
                View all projects <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {activeJobs.map((job) => {
                const progress = getJobProgress(job)
                return (
                  <div key={job.id} className="p-4 bg-background border border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                        <Briefcase size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-[16px] text-foreground leading-tight">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-text text-xs text-muted-foreground">{job.type}</span>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <span className="font-text text-xs text-muted-foreground">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-muted">
                      <div className="flex flex-col md:items-end">
                        <p className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70">Next review</p>
                        <p className="font-text text-sm text-foreground font-semibold">Tomorrow</p>
                      </div>
                      <div className="w-24 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <Link href={`/client/dashboard/jobs/${job.slug}`} className="p-2 text-input hover:text-primary transition-colors">
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recommended Pods */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-[20px] tracking-[-0.02em] text-foreground">Recommended pods</h2>
              <Link href="/client/dashboard/search" className="font-text text-xs text-primary hover:underline flex items-center gap-1">
                View talent pods <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primaryPods.map((pod) => {
                const lead = getTalentProfile(pod.leadId)
                return (
                  <Link
                    key={pod.id}
                    href={`/client/dashboard/search/${pod.slug}`}
                    className="border border-border rounded-xl p-5 bg-background hover:border-input hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center font-display font-black text-[11px] text-background shrink-0 border border-border overflow-hidden relative">
                          {lead.image ? (
                            <Image src={lead.image} alt={lead.name} fill className="object-cover" />
                          ) : (
                            lead.initials
                          )}
                        </div>
                        <div>
                          <h3 className="font-display font-black text-[15px] text-foreground group-hover:text-primary transition-colors">{pod.name}</h3>
                          <p className="font-text text-[11px] text-muted-foreground/70">{pod.focus}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-eyebrow text-primary px-1.5 py-0.5 bg-primary/5 border border-primary/10 rounded-sm">
                        {pod.fitScore}%
                      </span>
                    </div>
                    
                    {/* Visual squad grid resolved from talent IDs */}
                    <div className="grid grid-cols-4 gap-1.5 mb-4">
                      {pod.memberIds.slice(0, 4).map((memberId) => {
                        const profile = getTalentProfile(memberId)
                        return (
                          <div 
                            key={memberId} 
                            className="aspect-square rounded-md bg-muted flex items-center justify-center text-[10px] font-display font-black text-muted-foreground/70 border border-border overflow-hidden relative"
                          >
                            {profile.image ? (
                              <Image src={profile.image} alt={profile.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                            ) : (
                              profile.initials
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-muted">
                      <span className="font-text text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Clock size={12} strokeWidth={1.5} /> {pod.availability}
                      </span>
                      <ArrowUpRight size={14} className="text-input group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          <GrowthCommunity audience="client" />
        </div>

        {/* Sidebar / Stats Area */}
        <aside className="space-y-8">
          {/* Active Stats */}
          <div className="bg-foreground text-background rounded-2xl p-6">
            <h3 className="font-display font-black text-[18px] mb-6">Commercial health</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-text text-sm opacity-60">Avg. engagement progress</span>
                  <span className="font-mono text-xs font-bold">{avgUtilization}%</span>
                </div>
                <div className="h-1.5 bg-background/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-700" style={{ width: `${avgUtilization}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Total spend</p>
                  <p className="font-display font-black text-lg">${(totalSpend / 1000).toFixed(1)}k</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-eyebrow opacity-40 mb-1">Operators</p>
                  <p className="font-display font-black text-lg">{uniqueOperators}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <section>
            <h3 className="font-display font-black text-[16px] text-foreground mb-4 px-1">Recent activity</h3>
            <div className="space-y-2">
              {companyInvoices.slice(0, 3).map((invoice) => {
                const job = jobs.find(j => j.slug === invoice.jobSlug)
                return (
                  <div key={invoice.id} className="p-3 bg-background border border-border rounded-xl flex items-center justify-between hover:border-input transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground/70">
                        <CreditCard size={14} />
                      </div>
                      <div>
                        <p className="font-text text-xs font-bold text-foreground leading-tight">{invoice.amount}</p>
                        {job && <p className="font-text text-[10px] text-primary font-semibold mt-0.5">{job.title}</p>}
                        <p className="font-text text-[9px] text-muted-foreground/70 uppercase tracking-wider mt-0.5">{invoice.status}</p>
                      </div>
                    </div>
                    <span className="font-text text-[10px] text-muted-foreground/70">{invoice.date}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Help / Resources */}
          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
            <h3 className="font-display font-black text-[16px] text-primary mb-2">Need strategic support?</h3>
            <p className="font-text text-sm text-primary/70 mb-4 leading-relaxed">Schedule a brief review with your account operator to refine your pod requirements.</p>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-text text-sm font-semibold hover:bg-foreground transition-colors">
              Book strategy call
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

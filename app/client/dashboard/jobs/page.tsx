'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Briefcase, Clock, MapPin, Plus, CalendarDays, Users, Flag, Banknote } from 'lucide-react'
import { jobs, getJobProgress } from '@/lib/jobs'
import { currentUser, getClientUser } from '@/lib/user'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-primary/10 text-primary border-primary/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-border text-muted-foreground border-input',
}

export default function JobsPage() {
  const [filter, setFilter] = useState<'all' | 'active'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  
  const clientJobs = jobs.filter(j => j.clientId === currentUser.clientId)
  const displayJobs = filter === 'active' ? clientJobs.filter(j => j.status === 'Active') : clientJobs

  return (
    <div className="px-8 py-8 max-w-[1240px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-foreground leading-none">My Jobs</h1>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70 font-mono text-[10px] uppercase tracking-wider">
              {clientJobs.length} total
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <div className="inline-flex p-1 bg-muted rounded-lg w-fit">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all ${
                  filter === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all flex items-center gap-2 ${
                  filter === 'active' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
                }`}
              >
                Active
                {clientJobs.filter(j => j.status === 'Active').length > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${filter === 'active' ? 'bg-primary' : 'bg-input'}`} />
                )}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-1 bg-muted rounded-lg w-fit border border-border/50">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'grid' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
                }`}
                title="Grid View"
              >
                <Briefcase size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'list' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground/70 hover:text-foreground'
                }`}
                title="List View"
              >
                <Users size={16} />
              </button>
            </div>
          </div>
        </div>

        <Link 
          href="/client/dashboard/jobs/new"
          className="font-text text-sm font-semibold px-6 py-3 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center gap-2 w-fit"
        >
          <Plus size={18} /> New job
        </Link>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => {
            const client = getClientUser(job.clientId)
            return (
            <Link
              key={job.id}
              href={`/client/dashboard/jobs/${job.slug}`}
              className="border border-border rounded-2xl p-6 bg-background hover:border-input hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-input group-hover:text-primary transition-colors shrink-0 overflow-hidden">
                  {client.image ? (
                    <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase size={20} strokeWidth={1.5} />
                  )}
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status as keyof typeof statusStyles]}`}>
                  {job.status}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors leading-tight">
                  {job.title}
                </h2>
                <p className="font-text text-[15px] leading-relaxed text-muted-foreground mt-4 line-clamp-3">{job.summary}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-6 mb-8">
                {job.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-muted-foreground/70 px-2 py-0.5 border border-muted rounded-sm bg-muted/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 border-t border-muted">
                <div className="grid grid-cols-2 gap-4 text-[11px] text-muted-foreground/70 mb-4">
                  <span className="flex items-center gap-2"><Clock size={12} strokeWidth={1.5} /> {job.time}</span>
                  <span className="flex items-center gap-2"><MapPin size={12} strokeWidth={1.5} /> {job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-text text-[10px] text-input uppercase tracking-widest">{job.updatedAt}</span>
                  <ArrowUpRight size={16} className="text-input group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </Link>
          )})}
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-[1040px]">
          {displayJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/client/dashboard/jobs/${job.slug}`}
              className="group block border border-border rounded-xl p-7 bg-background hover:border-primary transition-all duration-300"
            >
              <article>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[job.status as keyof typeof statusStyles]}`}>
                        {job.status}
                      </span>
                      {job.phase && <span className="font-text text-xs text-muted-foreground/70">{job.phase}</span>}
                    </div>
                    <h2 className="font-display font-black text-[24px] tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors">
                      {job.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-[20px] text-foreground leading-none">{getJobProgress(job)}%</div>
                    <div className="font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground/70 mt-1">Progress</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-primary shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-muted-foreground">{job.lead || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag size={18} className="text-primary shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-muted-foreground">
                      {job.milestones?.find(m => m.status === 'pending')?.title || 'Scoping phase'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-muted-foreground">{job.nextReview || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={18} className="text-primary shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-muted-foreground">{job.rate}</span>
                  </div>
                </div>
 
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${getJobProgress(job)}%` }} 
                  />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
      
      {displayJobs.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="font-text text-muted-foreground/70">No {filter} jobs found.</p>
        </div>
      )}
    </div>
  )
}

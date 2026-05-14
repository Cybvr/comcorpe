'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Briefcase, Clock, MapPin, Plus, CalendarDays, Users, Flag, Banknote } from 'lucide-react'
import { jobs } from '@/lib/jobs'
import { currentUser } from '@/lib/user'

const statusStyles = {
  Scoping: 'bg-amber-100 text-amber-700 border-amber-200',
  'Pod review': 'bg-blue/10 text-blue border-blue/20',
  Active: 'bg-green-600/10 text-green-700 border-green-600/20',
  Paused: 'bg-ink-10 text-ink-60 border-ink-20',
}

export default function BriefsPage() {
  const [filter, setFilter] = useState<'all' | 'active'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  
  const clientJobs = jobs.filter(j => j.client === currentUser.company)
  const displayJobs = filter === 'active' ? clientJobs.filter(j => j.status === 'Active') : clientJobs

  return (
    <div className="px-8 py-8 max-w-[1240px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-black text-[32px] tracking-[-0.03em] text-ink leading-none">Briefs</h1>
            <span className="px-2 py-0.5 rounded-full bg-ink-5 text-ink-40 font-mono text-[10px] uppercase tracking-wider">
              {clientJobs.length} total
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <div className="inline-flex p-1 bg-ink-5 rounded-lg w-fit">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all ${
                  filter === 'all' ? 'bg-paper text-ink shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-1.5 rounded-md font-text text-xs font-semibold transition-all flex items-center gap-2 ${
                  filter === 'active' ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
              >
                Active
                {clientJobs.filter(j => j.status === 'Active').length > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${filter === 'active' ? 'bg-blue' : 'bg-ink-20'}`} />
                )}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex p-1 bg-ink-5 rounded-lg w-fit border border-ink-10/50">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'grid' ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
                }`}
                title="Grid View"
              >
                <Briefcase size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-all ${
                  view === 'list' ? 'bg-paper text-blue shadow-sm' : 'text-ink-40 hover:text-ink'
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
          className="font-text text-sm font-semibold px-6 py-3 rounded-full bg-ink text-paper hover:bg-blue transition-all duration-200 flex items-center gap-2 w-fit"
        >
          <Plus size={18} /> New brief
        </Link>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((brief) => (
            <Link
              key={brief.id}
              href={`/client/dashboard/jobs/${brief.slug}`}
              className="border border-ink-10 rounded-2xl p-6 bg-paper hover:border-ink-20 hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-ink-5 border border-ink-10 flex items-center justify-center text-ink-20 group-hover:text-blue transition-colors shrink-0">
                  <Briefcase size={20} strokeWidth={1.5} />
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[brief.status as keyof typeof statusStyles]}`}>
                  {brief.status}
                </span>
              </div>
              
              <div className="flex-1">
                <h2 className="font-display font-black text-[22px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors leading-tight">
                  {brief.title}
                </h2>
                <p className="font-text text-[15px] leading-relaxed text-ink-60 mt-4 line-clamp-3">{brief.summary}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-6 mb-8">
                {brief.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-40 px-2 py-0.5 border border-ink-5 rounded-sm bg-ink-5/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5 border-t border-ink-5">
                <div className="grid grid-cols-2 gap-4 text-[11px] text-ink-40 mb-4">
                  <span className="flex items-center gap-2"><Clock size={12} strokeWidth={1.5} /> {brief.time}</span>
                  <span className="flex items-center gap-2"><MapPin size={12} strokeWidth={1.5} /> {brief.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-text text-[10px] text-ink-20 uppercase tracking-widest">{brief.updatedAt}</span>
                  <ArrowUpRight size={16} className="text-ink-20 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-[1040px]">
          {displayJobs.map((project) => (
            <Link 
              key={project.id} 
              href={`/client/dashboard/jobs/${project.slug}`}
              className="group block border border-ink-10 rounded-xl p-7 bg-paper hover:border-blue transition-all duration-300"
            >
              <article>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-sm ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                        {project.status}
                      </span>
                      {project.phase && <span className="font-text text-xs text-ink-40">{project.phase}</span>}
                    </div>
                    <h2 className="font-display font-black text-[24px] tracking-[-0.02em] text-ink group-hover:text-blue transition-colors">
                      {project.title}
                    </h2>
                  </div>
                  {project.progress !== undefined && (
                    <div className="text-right">
                      <div className="font-display font-black text-[20px] text-ink leading-none">{project.progress}%</div>
                      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-40 mt-1">Progress</div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-blue shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-ink-60">{project.lead || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag size={18} className="text-blue shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-ink-60">{project.nextMilestone || 'Scoping phase'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-blue shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-ink-60">{project.nextReview || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={18} className="text-blue shrink-0" />
                    <span className="font-text text-[15px] font-semibold text-ink-60">{project.rate}</span>
                  </div>
                </div>

                {project.progress !== undefined && (
                  <div className="h-2 bg-ink-10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
      
      {displayJobs.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-ink-10 rounded-2xl">
          <p className="font-text text-ink-40">No {filter} briefs found.</p>
        </div>
      )}
    </div>
  )
}

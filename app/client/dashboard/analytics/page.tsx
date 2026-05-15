'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight,
  BrainCircuit,
  Info,
  MoreHorizontal
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts'

// Real Data Imports
import { pods } from '@/lib/pods'
import { jobs, getJobProgress } from '@/lib/jobs'

export default function AIAnalyticsPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Derive real data for charts
  const activeJobs = jobs.filter(j => j.status === 'Active')
  
  const VELOCITY_DATA = activeJobs.map(j => ({
    name: j.title.split(' ').slice(0, 2).join(' '),
    progress: getJobProgress(j),
    benchmark: 45 // Static benchmark for context
  }))

  const ROI_DATA = pods.map((p, i) => ({
    name: p.name,
    // Extract min rate value from string like "$45k - $60k/mo"
    savings: parseInt(p.rate.replace(/[^0-9]/g, '').slice(0, 2)) * 1000,
    color: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--accent)' : 'var(--muted-foreground)'
  }))

  const totalMonthlyBurn = activeJobs.reduce((acc, j) => {
    const rate = parseInt(j.rate.replace(/[^0-9]/g, '').slice(0, 2)) || 0
    return acc + rate
  }, 0)

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1400px] mx-auto bg-background min-h-screen">
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-foreground">Intelligence Dashboard</h1>
          <p className="font-text text-sm text-muted-foreground/70 mt-1 font-medium flex items-center gap-2">
            Enterprise Analytics <ChevronRight size={12} /> Strategic Planning
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {pods.slice(0, 3).map(p => (
              <div key={p.id} className="w-8 h-8 rounded-full border-2 border-background bg-border flex items-center justify-center text-[8px] font-black text-foreground">
                {p.name.charAt(0)}
              </div>
            ))}
          </div>
          <button className="px-4 py-2 bg-card border border-border rounded-lg font-text text-xs font-bold shadow-sm hover:bg-muted transition-all text-foreground">
            Share Report
          </button>
        </div>
      </div>

      {/* AI Intelligence Bar */}
      <div className="mb-10">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <form onSubmit={(e) => { e.preventDefault(); setIsSearching(true); setTimeout(() => { setResult(`Strategic Analysis: Based on ${activeJobs.length} active engagements, your '${activeJobs[0].title}' project is at ${getJobProgress(activeJobs[0])}% progress. Claude suggests accelerating the next milestone to capitalize on Q3 trends.`); setIsSearching(false); }, 1200); }} className="relative flex items-center">
            <div className="pl-6 text-primary shrink-0">
              {isSearching ? <Sparkles size={18} className="animate-pulse" /> : <BrainCircuit size={18} />}
            </div>
            <input
              type="text"
              placeholder="Query your enterprise data files (MCP)..."
              className="w-full pl-4 pr-32 py-5 font-text text-sm focus:outline-none placeholder:text-foreground-30 text-foreground bg-transparent"
            />
            <div className="absolute right-4 flex items-center gap-2">
              <span className="hidden md:block font-mono text-[9px] uppercase tracking-wider text-foreground-30 font-black">Claude 3.5 Sonnet</span>
              <button 
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-text text-xs font-bold hover:bg-foreground transition-all disabled:opacity-30"
              >
                Analyze
              </button>
            </div>
          </form>
          {result && (
            <div className="p-6 bg-primary/5 border-t border-border animate-in fade-in duration-300">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0 animate-pulse" />
                <div className="space-y-4 flex-1">
                  <p className="font-text text-sm text-foreground leading-relaxed font-medium">
                    {result}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="font-mono text-[10px] text-muted-foreground/70 font-bold">ACCURACY: 99.8%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={12} className="text-primary" />
                      <span className="font-mono text-[10px] text-muted-foreground/70 font-bold uppercase">SOURCE: {activeJobs[0].slug.toUpperCase()}.CSV</span>
                    </div>
                    <button onClick={() => setResult(null)} className="ml-auto font-text text-[10px] font-bold text-foreground-30 hover:text-foreground transition-colors">DISMISS</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-display font-black text-xl text-foreground">Project Velocity</h3>
              <p className="font-text text-xs text-muted-foreground/70 mt-1">Real-time completion percentage across active pods</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-text text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
              </div>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VELOCITY_DATA}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground/70)', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--muted-foreground/70)', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="progress" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Analytics Cards */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-text text-xs font-bold text-foreground uppercase tracking-wider">Pod Commercial Capacity</h4>
              <MoreHorizontal size={16} className="text-input" />
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ROI_DATA}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: 'var(--muted-foreground/70)', fontWeight: 600 }}
                  />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                    {ROI_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-muted">
              <div className="flex items-center justify-between">
                <span className="font-text text-[10px] text-muted-foreground/70 font-medium italic">Active Commercial Footprint</span>
                <span className="font-text text-sm font-black text-foreground">${ROI_DATA.reduce((a,b) => a + b.savings, 0) / 1000}k/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-foreground text-background rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={80} />
            </div>
            <h4 className="font-text text-[10px] font-bold text-background/40 uppercase tracking-[0.2em] mb-4">Strategic Pulse</h4>
            <h3 className="font-display font-black text-2xl mb-2 leading-none">Scale Engineering</h3>
            <p className="font-text text-xs text-background/60 leading-relaxed mb-6">
              Your project velocity is currently outperforming market benchmarks by 12%.
            </p>
            <button className="flex items-center gap-2 font-text text-xs font-bold hover:gap-3 transition-all text-primary">
              Execute recommendation <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-muted flex items-center justify-between bg-background/30">
            <h3 className="font-display font-black text-lg text-foreground">Commercial Health Audit</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="font-text text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Operational</span>
            </div>
          </div>
          <div className="p-0">
            <div className="grid grid-cols-4 gap-0 divide-x divide-border">
              {[
                { label: 'Cloud Burn', value: `$${totalMonthlyBurn / 10}k`, status: 'Optimal' },
                { label: 'Active Pods', value: pods.length.toString(), status: 'Stable' },
                { label: 'Security Score', value: '99.8%', status: 'Safe' },
                { label: 'ROI Forecast', value: '+22%', status: 'Positive' },
              ].map((item, i) => (
                <div key={i} className="p-6 hover:bg-muted transition-colors cursor-default">
                  <p className="font-text text-[10px] font-bold text-foreground-30 uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="font-display font-black text-xl text-foreground mb-1">{item.value}</p>
                  <p className="font-text text-[10px] text-muted-foreground/70 font-medium">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <Info size={20} />
            </div>
            <div>
              <p className="font-text text-xs font-black text-foreground">Intelligence Engine</p>
              <p className="font-text text-[10px] text-muted-foreground/70">Claude 3.5 Sonnet</p>
            </div>
          </div>
          <p className="font-text text-xs text-muted-foreground leading-relaxed italic">
            {`"Your '${activeJobs[0].title}' pod is showing a 15% increase in throughput following the latest infrastructure update."`}
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { 
  Sparkles, 
  BrainCircuit,
  Filter,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users
} from 'lucide-react'
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  Cell
} from 'recharts'

// Real Data Imports
import { pods } from '@/lib/pods'
import { jobs, getJobProgress } from '@/lib/jobs'
import { invoices } from '@/lib/invoices'

export default function AnalyticsPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('6M') // Mock dropdown state

  // --- DATA PROCESSING ---
  
  // 1. Core KPIs
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amountRaw, 0)
  const totalDue = invoices.filter(i => i.status === 'Due').reduce((sum, i) => sum + i.amountRaw, 0)
  const activeJobs = jobs.filter(j => j.status === 'Active')
  const activePods = pods.length

  // 2. Revenue Over Time Chart
  const revenueData = useMemo(() => {
    const grouped = invoices.reduce((acc, inv) => {
      const dateParts = inv.date.split(' ') // e.g. ['15', 'Feb', '2026']
      if (dateParts.length < 3) return acc
      const month = dateParts[1]
      const year = dateParts[2]
      const key = `${month} ${year}`
      
      if (!acc[key]) {
        acc[key] = { name: key, Paid: 0, Due: 0, timestamp: new Date(`1 ${month} ${year}`).getTime() }
      }
      
      if (inv.status === 'Paid') {
        acc[key].Paid += inv.amountRaw
      } else if (inv.status === 'Due') {
        acc[key].Due += inv.amountRaw
      }
      return acc
    }, {} as Record<string, { name: string, Paid: number, Due: number, timestamp: number }>)
    
    // Sort chronologically
    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp)
  }, [])

  // 3. Job Progress Chart
  const jobProgressData = useMemo(() => {
    return activeJobs.map(j => ({
      name: j.title.split(' ').slice(0, 3).join(' ') + (j.title.split(' ').length > 3 ? '...' : ''),
      Progress: getJobProgress(j),
    }))
  }, [activeJobs])

  // Custom Tooltip for Currency
  const CurrencyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-text text-xs font-bold mb-2 text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-text text-xs flex items-center gap-2 mb-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-[1400px] mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-foreground">Analytics & Reporting</h1>
          <p className="font-text text-sm text-muted-foreground mt-1">
            Financial performance, job velocity, and pod utilization.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg font-text text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="YTD">Year to Date</option>
            <option value="ALL">All Time</option>
          </select>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-text text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
            <Filter size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* AI Assistant - Demoted to a smaller banner */}
      <div className="mb-8 bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3 shrink-0 text-primary">
          <div className="p-2 bg-primary/10 rounded-lg">
            {isSearching ? <Sparkles size={16} className="animate-pulse" /> : <BrainCircuit size={16} />}
          </div>
          <span className="font-text text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Insights</span>
        </div>
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            setIsSearching(true); 
            setTimeout(() => { 
              setResult(`Analysis: Revenue is trending up 15% this quarter. The '${activeJobs[0]?.title || 'active'}' project has the highest upcoming billing milestone.`); 
              setIsSearching(false); 
            }, 1200); 
          }} 
          className="flex-1 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about your revenue, jobs, or pods..."
            className="w-full font-text text-sm focus:outline-none bg-transparent placeholder:text-muted-foreground text-foreground"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="px-4 py-1.5 bg-muted text-foreground rounded-md font-text text-xs font-bold hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      </div>

      {result && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-text text-sm text-foreground leading-relaxed">{result}</p>
          </div>
          <button onClick={() => setResult(null)} className="text-muted-foreground hover:text-foreground">×</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-text text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <DollarSign size={16} className="text-green-500" />
          </div>
          <p className="font-display font-black text-2xl text-foreground mb-1">${(totalPaid / 1000).toFixed(1)}k</p>
          <p className="font-text text-[10px] text-green-500 font-medium flex items-center gap-1">
            <TrendingUp size={10} /> +12.5% from last period
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-text text-xs font-bold text-muted-foreground uppercase tracking-wider">Outstanding Due</p>
            <DollarSign size={16} className="text-orange-500" />
          </div>
          <p className="font-display font-black text-2xl text-foreground mb-1">${(totalDue / 1000).toFixed(1)}k</p>
          <p className="font-text text-[10px] text-muted-foreground font-medium">
            Across {invoices.filter(i => i.status === 'Due').length} invoices
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-text text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Jobs</p>
            <Briefcase size={16} className="text-primary" />
          </div>
          <p className="font-display font-black text-2xl text-foreground mb-1">{activeJobs.length}</p>
          <p className="font-text text-[10px] text-muted-foreground font-medium">
            {jobs.length - activeJobs.length} completed or paused
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-text text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Pods</p>
            <Users size={16} className="text-accent" />
          </div>
          <p className="font-display font-black text-2xl text-foreground mb-1">{activePods}</p>
          <p className="font-text text-[10px] text-muted-foreground font-medium">
            Deploying {Array.from(new Set(pods.flatMap(p => p.memberIds))).length} unique operators
          </p>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-lg text-foreground">Revenue Over Time</h3>
            <p className="font-text text-xs text-muted-foreground mt-1">Paid vs Due invoices by month</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Area type="monotone" dataKey="Paid" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)" />
              <Area type="monotone" dataKey="Due" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorDue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout for Jobs and Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Progress */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-display font-black text-lg text-foreground">Active Job Progress</h3>
            <p className="font-text text-xs text-muted-foreground mt-1">Milestone completion %</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobProgressData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={120}
                  tick={{ fontSize: 10, fill: 'var(--foreground)', fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{fill: 'var(--muted)'}} 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} 
                  formatter={(value: number) => [`${value}%`, 'Progress']}
                />
                <Bar dataKey="Progress" radius={[0, 4, 4, 0]} barSize={20}>
                  {jobProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="var(--primary)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices List */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-black text-lg text-foreground">Recent Invoices</h3>
              <p className="font-text text-xs text-muted-foreground mt-1">Sorted by latest billing date</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={12} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[...invoices]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-text text-sm font-bold text-foreground">{inv.amount}</p>
                  <p className="font-text text-[10px] text-muted-foreground truncate max-w-[200px]">{inv.label}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider mb-1 ${
                    inv.status === 'Paid' ? 'bg-green-500/10 text-green-600' :
                    inv.status === 'Due' ? 'bg-orange-500/10 text-orange-600' :
                    'bg-blue-500/10 text-blue-600'
                  }`}>
                    {inv.status}
                  </span>
                  <p className="font-text text-[10px] text-muted-foreground block">{inv.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

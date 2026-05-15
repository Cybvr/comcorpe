'use client'
import { useEffect, useState } from 'react'

const PHRASES = [
  'INITIALIZING SYSTEM CORE...',
  'ESTABLISHING SECURE PROTOCOLS...',
  'ARTICULATING DASHBOARD NODES...',
  'RETRIEVING OPERATIONAL DATA...',
  'SYNCING CLOUD REPOSITORIES...',
  'DECRYPTING TEAM BRIEFS...',
  'OPTIMIZING GROWTH ENGINE...',
  'FINALIZING AUTHENTICATION...',
]

export default function HighTechLoading() {
  const [index, setIndex] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (index < PHRASES.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1)
      }, 400 + Math.random() * 800)
      return () => clearTimeout(timer)
    }
  }, [index])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-foreground flex flex-col items-center justify-center p-6 text-background selection:bg-primary">
      <div className="w-full max-w-lg">
        {/* Top bar */}
        <div className="flex justify-between items-end mb-8 border-b border-foreground/80 pb-4">
          <div>
            <p className="font-mono text-[10px] tracking-eyebrow text-muted-foreground/70 mb-1">ACCESS STATUS</p>
            <p className="font-display text-2xl tracking-hero uppercase">Authenticated</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] tracking-eyebrow text-muted-foreground/70 mb-1">SYSTEM_VERSION</p>
            <p className="font-mono text-sm">v4.0.26_GOLD</p>
          </div>
        </div>

        {/* Terminals */}
        <div className="space-y-4 font-mono text-[13px] leading-relaxed">
          {PHRASES.slice(0, index).map((phrase, i) => (
            <div key={i} className="text-muted-foreground/70 flex items-start gap-3">
              <span className="text-primary shrink-0">[OK]</span>
              <span>{phrase}</span>
            </div>
          ))}
          
          <div className="flex items-start gap-3 text-background">
            <span className="text-primary animate-pulse shrink-0">{'>'}</span>
            <span className="uppercase">
              {PHRASES[index]}
              <span className="inline-block w-2 h-4 bg-primary ml-1 align-middle animate-pulse" />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-12">
          <div className="flex justify-between font-mono text-[10px] tracking-eyebrow text-muted-foreground/70 mb-2">
            <span>BITSTREAM_DECODE</span>
            <span>{Math.round(((index + 1) / PHRASES.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-foreground/80 w-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((index + 1) / PHRASES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Glitch footer */}
        <div className="mt-8 flex justify-center opacity-20">
          <p className="font-display text-[60px] tracking-[-0.1em] leading-none uppercase select-none pointer-events-none">
            COMCORP<span className="text-primary">E</span>
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="fixed top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-foreground/80" />
      <div className="fixed top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-foreground/80" />
      <div className="fixed bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-foreground/80" />
      <div className="fixed bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-foreground/80" />
    </div>
  )
}

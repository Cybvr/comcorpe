'use client'

import { useState } from 'react'
import {
    ArrowUpRight,
    Target,
    TrendingUp,
    Layers,
    Scale,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Info,
    ChevronRight,
    Zap,
    Building2,
    Cpu,
} from 'lucide-react'

// ─── Nav sections ────────────────────────────────────────────────────────────
const nav = [
    { id: 'colors', label: 'Colors' },
    { id: 'neutrals', label: 'Neutral Scale' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'radii', label: 'Corner Radii' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'motion', label: 'Motion' },
    { id: 'grid', label: 'Grid' },
    { id: 'iconography', label: 'Iconography' },
    { id: 'voice', label: 'Voice & Tone' },
    { id: 'neverdo', label: 'Never Do' },
    { id: 'onoff', label: 'On / Off Brand' },
    { id: 'components', label: 'Components' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
            {children}
        </p>
    )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-bold text-foreground mb-8">{children}</h2>
    )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl border border-border bg-card p-6 ${className}`}>
            {children}
        </div>
    )
}

function TokenLabel({ name, value }: { name: string; value: string }) {
    return (
        <div className="mt-2">
            <p className="text-xs font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{value}</p>
        </div>
    )
}

export default function DesignSystemPage() {
    const [activeSection, setActiveSection] = useState('colors')

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveSection(id)
    }

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <header className="border-b border-border px-6 lg:px-12 py-8 max-w-[1440px] mx-auto">
                <SectionLabel>Internal Reference</SectionLabel>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-display">
                    Design System
                </h1>
                <p className="text-base text-muted-foreground mt-2 max-w-xl leading-lede">
                    Tokens, patterns and copy rules that define how COMCORPᵉ looks, speaks and moves.
                </p>
            </header>

            <div className="max-w-[1440px] mx-auto flex gap-0">

                {/* ── Sticky left nav ──────────────────────────────────────────────── */}
                <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border py-10 px-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
                    <nav className="space-y-1">
                        {nav.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                className={`w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${activeSection === item.id
                                        ? 'bg-muted text-foreground font-semibold'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── Main content ─────────────────────────────────────────────────── */}
                <main className="flex-1 px-6 lg:px-12 py-12 space-y-24 min-w-0">


                    {/* ════════════════════════════════════════════════════════════════
              COLORS
          ════════════════════════════════════════════════════════════════ */}
                    <section id="colors">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Color Tokens</SectionHeading>

                        {/* Core tokens */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Core</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                            {[
                                { name: 'Background', token: '--background', style: 'var(--background)', text: 'var(--foreground)' },
                                { name: 'Foreground', token: '--foreground', style: 'var(--foreground)', text: 'white' },
                                { name: 'Primary', token: '--primary', style: 'var(--primary)', text: 'white' },
                                { name: 'Muted', token: '--muted', style: 'var(--muted)', text: 'var(--muted-foreground)' },
                                { name: 'Border', token: '--border', style: 'var(--border)', text: 'var(--foreground)' },
                            ].map((c) => (
                                <div key={c.name}>
                                    <div
                                        className="h-20 rounded-xl border border-border"
                                        style={{ backgroundColor: c.style }}
                                    />
                                    <TokenLabel name={c.name} value={c.token} />
                                </div>
                            ))}
                        </div>

                        {/* Semantic tokens */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Semantic</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { name: 'Success', bg: '#0F8A55', label: '#0F8A55' },
                                { name: 'Warning', bg: '#C97A1B', label: '#C97A1B' },
                                { name: 'Danger', bg: 'var(--destructive)', label: '--destructive' },
                                { name: 'Primary (accent)', bg: 'var(--primary)', label: '--primary' },
                                { name: 'Card', bg: 'var(--card)', label: '--card' },
                                { name: 'Muted fg', bg: 'var(--muted-foreground)', label: '--muted-foreground' },
                            ].map((c) => (
                                <div key={c.name}>
                                    <div className="h-14 rounded-xl border border-border" style={{ backgroundColor: c.bg }} />
                                    <TokenLabel name={c.name} value={c.label} />
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              NEUTRAL SCALE
          ════════════════════════════════════════════════════════════════ */}
                    <section id="neutrals">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Neutral Scale</SectionHeading>
                        <p className="text-sm text-muted-foreground mb-6">Foreground at stepped opacity toward background. Use the token, never a raw hex.</p>
                        <div className="flex gap-2 items-end">
                            {[
                                { label: 'Ink', opacity: 1 },
                                { label: 'Ink-80', opacity: 0.8 },
                                { label: 'Ink-60', opacity: 0.6 },
                                { label: 'Ink-40', opacity: 0.4 },
                                { label: 'Ink-20', opacity: 0.2 },
                                { label: 'Ink-10', opacity: 0.1 },
                                { label: 'Paper', opacity: 0, bg: 'var(--background)' },
                            ].map((step, i) => (
                                <div key={step.label} className="flex-1 text-center">
                                    <div
                                        className="rounded-lg border border-border mb-2"
                                        style={{
                                            height: `${80 - i * 8}px`,
                                            backgroundColor: step.bg || `color-mix(in oklch, var(--foreground) ${Math.round(step.opacity * 100)}%, var(--background))`,
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground font-mono">{step.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              TYPOGRAPHY
          ════════════════════════════════════════════════════════════════ */}
                    <section id="typography">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Typography Scale</SectionHeading>

                        {/* Typefaces */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Display / Body</p>
                                <p className="text-3xl font-bold text-foreground leading-tight">Inter Tight</p>
                                <p className="text-sm text-muted-foreground mt-2">400 · 500 · 600</p>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">Google Fonts · font-text</p>
                            </Card>
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Monospace</p>
                                <p className="text-3xl font-bold text-foreground font-mono leading-tight">JetBrains Mono</p>
                                <p className="text-sm text-muted-foreground mt-2">400 · 500</p>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">Google Fonts · font-mono</p>
                            </Card>
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Wordmark</p>
                                <p className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">COMCORPᵉ</p>
                                <p className="text-sm text-muted-foreground mt-2">Inter Tight 700 · tracking-tight</p>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">Never sentence-case the wordmark</p>
                            </Card>
                        </div>

                        {/* Type scale */}
                        <div className="space-y-6 border-t border-border pt-8">
                            {[
                                { role: 'Hero', size: 'text-5xl lg:text-6xl', weight: 'font-bold', tracking: 'tracking-[-0.04em]', sample: 'The Operating Layer for High-Velocity Growth' },
                                { role: 'H1', size: 'text-4xl lg:text-5xl', weight: 'font-bold', tracking: 'tracking-[-0.04em]', sample: 'Architect. Assemble. Operate.' },
                                { role: 'H2', size: 'text-3xl lg:text-4xl', weight: 'font-bold', tracking: 'tracking-[-0.02em]', sample: 'Growth is architecture, not effort.' },
                                { role: 'H3', size: 'text-2xl', weight: 'font-bold', tracking: '', sample: 'Technology & Fintech' },
                                { role: 'H4', size: 'text-xl', weight: 'font-semibold', tracking: '', sample: 'Collapsing the gap between strategy and execution' },
                                { role: 'Lede', size: 'text-lg', weight: 'font-normal', tracking: '', sample: 'Comcorpᵉ orchestrates data, creativity, technology and strategy into unified growth systems.' },
                                { role: 'Body', size: 'text-base', weight: 'font-normal', tracking: '', sample: 'We focus on high-impact sectors across Pan-Africa: Fintech, Infrastructure, and Consumer Ecosystems.' },
                                { role: 'Small', size: 'text-sm', weight: 'font-normal', tracking: '', sample: 'Built to perform in complex markets.' },
                                { role: 'Eyebrow', size: 'text-xs', weight: 'font-semibold', tracking: 'tracking-widest uppercase', sample: 'Growth Systems' },
                            ].map((t) => (
                                <div key={t.role} className="flex items-baseline gap-8 border-b border-border pb-6 last:border-0">
                                    <div className="w-20 flex-shrink-0">
                                        <p className="text-xs font-semibold text-muted-foreground">{t.role}</p>
                                        <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">{t.size.split(' ')[0]}</p>
                                    </div>
                                    <p className={`${t.size} ${t.weight} ${t.tracking} text-foreground leading-tight flex-1 min-w-0`}>
                                        {t.sample}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              SPACING
          ════════════════════════════════════════════════════════════════ */}
                    <section id="spacing">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Spacing Scale</SectionHeading>
                        <p className="text-sm text-muted-foreground mb-8">4 px base. Every step doubles or follows a 1.5× rhythm. Use Tailwind spacing utilities.</p>
                        <div className="space-y-3">
                            {[
                                { token: '1', px: 4, tw: 'p-1' },
                                { token: '2', px: 8, tw: 'p-2' },
                                { token: '3', px: 12, tw: 'p-3' },
                                { token: '4', px: 16, tw: 'p-4' },
                                { token: '6', px: 24, tw: 'p-6' },
                                { token: '8', px: 32, tw: 'p-8' },
                                { token: '10', px: 40, tw: 'p-10' },
                                { token: '12', px: 48, tw: 'p-12' },
                                { token: '16', px: 64, tw: 'p-16' },
                                { token: '20', px: 80, tw: 'p-20' },
                                { token: '24', px: 96, tw: 'p-24' },
                            ].map((s) => (
                                <div key={s.token} className="flex items-center gap-4">
                                    <div className="w-16 text-right">
                                        <span className="text-xs font-mono text-muted-foreground">{s.tw}</span>
                                    </div>
                                    <div
                                        className="h-5 bg-primary/20 rounded"
                                        style={{ width: `${Math.min(s.px * 3, 480)}px` }}
                                    />
                                    <span className="text-xs text-muted-foreground font-mono">{s.px}px</span>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              RADII
          ════════════════════════════════════════════════════════════════ */}
                    <section id="radii">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Corner Radii</SectionHeading>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[
                                { name: 'None', cls: 'rounded-none', px: '0px', use: 'Dividers, rule lines' },
                                { name: 'SM', cls: 'rounded-sm', px: '4px', use: 'Inputs, form fields' },
                                { name: 'Default', cls: 'rounded-lg', px: '8px', use: 'Buttons, dropdowns' },
                                { name: 'XL', cls: 'rounded-2xl', px: '16px', use: 'Cards, panels' },
                                { name: '3XL', cls: 'rounded-3xl', px: '24px', use: 'Feature banners' },
                                { name: 'Full', cls: 'rounded-full', px: '999px', use: 'Primary CTA, badges, pills' },
                            ].map((r) => (
                                <div key={r.name} className="text-center">
                                    <div className={`h-16 w-full border-2 border-foreground ${r.cls} mb-3`} />
                                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{r.px}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{r.use}</p>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              ELEVATION
          ════════════════════════════════════════════════════════════════ */}
                    <section id="elevation">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Elevation</SectionHeading>
                        <p className="text-sm text-muted-foreground mb-8">Two elevation levels. Prefer borders over shadows wherever possible — use shadow only for floating UI.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                {
                                    name: 'Flat',
                                    cls: 'border border-border',
                                    shadow: 'none',
                                    use: 'Default cards, sections, inputs',
                                },
                                {
                                    name: 'Elev-1 — Hairline',
                                    cls: 'shadow-sm border border-border',
                                    shadow: '0 1px 2px rgb(0 0 0 / 0.05)',
                                    use: 'Subtle lift: hover states, active items',
                                },
                                {
                                    name: 'Elev-2 — Floating',
                                    cls: 'shadow-lg',
                                    shadow: '0 10px 30px rgb(0 0 0 / 0.10)',
                                    use: 'Dropdowns, modals, popovers',
                                },
                            ].map((e) => (
                                <div key={e.name}>
                                    <div className={`h-24 rounded-2xl bg-card ${e.cls} mb-3`} />
                                    <p className="text-sm font-semibold text-foreground">{e.name}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{e.shadow}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{e.use}</p>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              MOTION
          ════════════════════════════════════════════════════════════════ */}
                    <section id="motion">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Motion Tokens</SectionHeading>
                        <p className="text-sm text-muted-foreground mb-8">One easing curve. Three durations. Anything outside this set needs sign-off.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Easing — ease-out</p>
                                <p className="text-2xl font-bold text-foreground font-mono leading-none">[0.25, 0.46, 0.45, 0.94]</p>
                                <p className="text-xs text-muted-foreground mt-2">cubic-bezier — use for every entrance and exit</p>
                            </Card>
                            <Card>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Stagger children</p>
                                <p className="text-2xl font-bold text-foreground font-mono leading-none">0.1s delay · 0.05s offset</p>
                                <p className="text-xs text-muted-foreground mt-2">For lists and grid items; never stagger more than 6 items</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { name: 'Fast', duration: '0.25s', use: 'Micro-interactions: hover, toggle, focus ring' },
                                { name: 'Default', duration: '0.5s', use: 'Fade-in, fade-up for body content' },
                                { name: 'Slow', duration: '0.6s', use: 'Hero entrances, large image reveals' },
                            ].map((m) => (
                                <Card key={m.name}>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{m.name}</p>
                                    <p className="text-3xl font-bold text-foreground font-mono">{m.duration}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{m.use}</p>
                                </Card>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              GRID
          ════════════════════════════════════════════════════════════════ */}
                    <section id="grid">
                        <SectionLabel>Layout</SectionLabel>
                        <SectionHeading>Grid & Containers</SectionHeading>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {[
                                { label: 'Max width', value: '1280px', note: 'max-w-7xl — use on every section' },
                                { label: 'Gutter (mobile)', value: '24px', note: 'px-6 — sides only' },
                                { label: 'Gutter (desktop)', value: '48px', note: 'lg:px-12 — sides only' },
                                { label: 'Column base', value: '12-col CSS grid', note: 'gap-6 between cells' },
                                { label: 'Common splits', value: '1:1 · 2:1 · 3:2 · 3:1', note: 'Prefer asymmetric at desktop' },
                                { label: 'Vertical rhythm', value: 'py-16 · py-20 · py-24', note: 'Section padding; never less than py-12' },
                            ].map((g) => (
                                <Card key={g.label}>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{g.label}</p>
                                    <p className="text-xl font-bold text-foreground">{g.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{g.note}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Visual grid preview */}
                        <div className="border border-border rounded-2xl p-4 overflow-hidden">
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">12-column preview</p>
                            <div className="grid grid-cols-12 gap-1">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="h-8 bg-primary/10 rounded text-center flex items-center justify-center">
                                        <span className="text-[10px] text-primary/60 font-mono">{i + 1}</span>
                                    </div>
                                ))}
                                <div className="col-span-8 h-8 bg-foreground/10 rounded" />
                                <div className="col-span-4 h-8 bg-primary/20 rounded" />
                                <div className="col-span-6 h-8 bg-foreground/10 rounded" />
                                <div className="col-span-6 h-8 bg-foreground/10 rounded" />
                                <div className="col-span-4 h-8 bg-foreground/10 rounded" />
                                <div className="col-span-4 h-8 bg-foreground/10 rounded" />
                                <div className="col-span-4 h-8 bg-primary/20 rounded" />
                            </div>
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              ICONOGRAPHY
          ════════════════════════════════════════════════════════════════ */}
                    <section id="iconography">
                        <SectionLabel>Foundation</SectionLabel>
                        <SectionHeading>Iconography</SectionHeading>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            {[
                                { label: 'Library', value: 'Lucide React', note: 'Only icon library approved for use' },
                                { label: 'Stroke width', value: '1.5px', note: 'strokeWidth={1.5} always — never fill icons' },
                                { label: 'Color', value: 'currentColor', note: 'Inherit from parent text color' },
                                { label: 'Sizes', value: '16 · 24 · 32', note: '16 = inline, 24 = default, 32 = feature' },
                                { label: 'Never', value: 'Custom SVG', note: 'Only add custom SVG for logos/wordmarks' },
                                { label: 'In buttons', value: 'ArrowUpRight / ChevronRight', note: 'Right-movement always implies navigation' },
                            ].map((g) => (
                                <Card key={g.label}>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{g.label}</p>
                                    <p className="text-base font-semibold text-foreground">{g.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{g.note}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Size preview */}
                        <Card>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Size specimens · strokeWidth 1.5</p>
                            <div className="flex flex-wrap gap-8 items-end">
                                {[
                                    { size: 16, label: 'size-16 — inline' },
                                    { size: 24, label: 'size-24 — default' },
                                    { size: 32, label: 'size-32 — feature' },
                                ].map((s) => (
                                    <div key={s.size} className="flex flex-col items-center gap-2">
                                        <div className="flex gap-3 items-center">
                                            <Layers size={s.size} strokeWidth={1.5} className="text-foreground" />
                                            <TrendingUp size={s.size} strokeWidth={1.5} className="text-primary" />
                                            <Cpu size={s.size} strokeWidth={1.5} className="text-muted-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              VOICE & TONE
          ════════════════════════════════════════════════════════════════ */}
                    <section id="voice">
                        <SectionLabel>Content</SectionLabel>
                        <SectionHeading>Voice & Tone</SectionHeading>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            {[
                                {
                                    title: 'Authoritative, not arrogant',
                                    body: 'We state things. We do not hedge with "we think" or "we believe". We have the expertise — the copy should reflect that without lecturing.',
                                },
                                {
                                    title: 'Specific, not vague',
                                    body: 'Concrete nouns beat adjectives. "Unified growth systems across 3 continents" beats "comprehensive growth solutions".',
                                },
                                {
                                    title: 'Direct, not blunt',
                                    body: 'We lead with the benefit, then the mechanism. Short sentences. Active voice. Subject + verb + object.',
                                },
                                {
                                    title: 'Warm, not casual',
                                    body: 'We work with senior decision-makers. Copy is serious but not cold. No slang. No overfamiliarity.',
                                },
                            ].map((v) => (
                                <Card key={v.title}>
                                    <p className="text-sm font-bold text-foreground mb-2">{v.title}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Casing rules */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Casing Rules</h3>
                        <div className="space-y-3">
                            {[
                                { rule: 'Wordmark', example: 'COMCORPᵉ', note: 'All-caps + superscript e always. Never "Comcorpe" in display contexts.' },
                                { rule: 'Headlines', example: 'The operating layer for high-velocity growth', note: 'Sentence case. Capitalise proper nouns only.' },
                                { rule: 'Eyebrows', example: 'GROWTH SYSTEMS', note: 'All-caps, tracked wide, no bold.' },
                                { rule: 'Numbers', example: '3 continents · 6 arenas · $40M+', note: 'Numerals always — never "three continents".' },
                                { rule: 'CTA text', example: 'Build with us', note: 'Sentence case. No full stops inside a button.' },
                            ].map((c) => (
                                <div key={c.rule} className="grid grid-cols-[100px_1fr_1fr] gap-4 py-3 border-b border-border text-sm">
                                    <p className="font-semibold text-muted-foreground">{c.rule}</p>
                                    <p className="font-bold text-foreground">{c.example}</p>
                                    <p className="text-muted-foreground">{c.note}</p>
                                </div>
                            ))}
                        </div>

                        {/* Structural patterns */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-10 mb-4">Copy Structure Patterns</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    name: 'Triplet',
                                    example: 'Architect the system.\nAssemble the capability.\nOperate at full velocity.',
                                    note: 'Three parallel clauses. Power of three. Use for hero bodies and feature lists.',
                                },
                                {
                                    name: 'Binary contrast',
                                    example: 'Not a consultancy —\nan operating layer that\nbuilds, runs, and scales.',
                                    note: '"Not X — Y" frames differentiation cleanly. Use sparingly: one per page.',
                                },
                                {
                                    name: 'Anaphora',
                                    example: 'Data that sharpens decisions.\nCreativity that moves markets.\nTechnology that compresses time.',
                                    note: 'Parallel lead-word structure in lists. Keeps bullets punchy and scannable.',
                                },
                            ].map((p) => (
                                <Card key={p.name}>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">{p.name}</p>
                                    <p className="text-sm font-semibold text-foreground whitespace-pre-line leading-relaxed mb-3">{p.example}</p>
                                    <p className="text-xs text-muted-foreground">{p.note}</p>
                                </Card>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              NEVER DO
          ════════════════════════════════════════════════════════════════ */}
                    <section id="neverdo">
                        <SectionLabel>Content</SectionLabel>
                        <SectionHeading>Things Never To Do</SectionHeading>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { rule: 'No emoji in any copy', reason: 'They undermine executive credibility. No exceptions, including social posts.' },
                                { rule: 'No exclamation marks', reason: 'If the copy needs a "!" to feel exciting, rewrite the copy.' },
                                { rule: 'No CTA tropes', reason: '"Discover more", "Learn more", "Find out how" — replace with specific action text.' },
                                { rule: 'No passive voice', reason: '"Growth systems are built by us" → "We build growth systems." Always.' },
                                { rule: 'No vague superlatives', reason: '"Best-in-class", "world-class", "innovative" — cut without replacement.' },
                                { rule: 'No unexplained jargon', reason: 'If the reader needs Google, rephrase. Sector terms are fine; buzzwords are not.' },
                                { rule: 'Do not headline-case body text', reason: 'Sentence case for everything below H1. Headline-case looks like a corporate template.' },
                                { rule: 'Never write "solutions" as a standalone noun', reason: '"We provide solutions" says nothing. Name the actual growth system or capability.' },
                                { rule: 'Never write the wordmark in sentence case', reason: 'It is always COMCORPᵉ. The superscript e is part of the identity — never drop it.' },
                                { rule: 'Never animate on every element', reason: 'Motion has a budget. If everything moves, nothing feels intentional.' },
                            ].map((item) => (
                                <div key={item.rule} className="flex gap-3 p-4 rounded-xl border border-border">
                                    <XCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{item.rule}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              ON / OFF BRAND
          ════════════════════════════════════════════════════════════════ */}
                    <section id="onoff">
                        <SectionLabel>Content</SectionLabel>
                        <SectionHeading>On-Brand / Off-Brand Copy</SectionHeading>

                        <div className="space-y-6">
                            {[
                                {
                                    context: 'Hero headline',
                                    off: "We're excited to offer innovative growth solutions that will transform your business!",
                                    on: 'The operating layer for high-velocity growth.',
                                },
                                {
                                    context: 'CTA button',
                                    off: 'Discover our amazing growth services today',
                                    on: 'Build with us',
                                },
                                {
                                    context: 'What we do',
                                    off: 'Our world-class team delivers best-in-class growth strategies to help you scale faster.',
                                    on: 'We orchestrate data, creativity, technology and strategy into unified growth systems built for complex markets.',
                                },
                                {
                                    context: 'Stats callout',
                                    off: 'Many years helping many companies grow across Africa',
                                    on: '6 arenas · 3 continents · growth systems, not guesswork',
                                },
                                {
                                    context: 'Contact section',
                                    off: "Ready to grow? We'd love to hear from you! 🚀",
                                    on: "Let's architect your next growth system.",
                                },
                                {
                                    context: 'Model description',
                                    off: 'Check out how our unique approach helps clients achieve their growth goals.',
                                    on: 'We build growth engines by collapsing the gap between strategy and execution — one system at a time.',
                                },
                            ].map((item) => (
                                <div key={item.context} className="grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr] gap-4 items-start">
                                    <p className="text-xs font-semibold text-muted-foreground pt-1">{item.context}</p>
                                    <div className="flex gap-2 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                                        <XCircle size={14} className="text-destructive flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <p className="text-sm text-foreground">{item.off}</p>
                                    </div>
                                    <div className="flex gap-2 p-4 rounded-xl bg-[#0F8A55]/5 border border-[#0F8A55]/20">
                                        <CheckCircle2 size={14} className="text-[#0F8A55] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <p className="text-sm text-foreground font-semibold">{item.on}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* ════════════════════════════════════════════════════════════════
              COMPONENTS
          ════════════════════════════════════════════════════════════════ */}
                    <section id="components">
                        <SectionLabel>Components</SectionLabel>
                        <SectionHeading>Core Component Previews</SectionHeading>

                        {/* ── Buttons ── */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Buttons</h3>
                        <Card className="mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Primary */}
                                <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-foreground/80 transition-colors">
                                    Build with us
                                    <span className="h-1.5 w-1.5 rounded-full bg-background" />
                                </button>
                                {/* Primary accent */}
                                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    Start a project
                                </button>
                                {/* Ghost */}
                                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all group">
                                    Explore arenas
                                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </button>
                                {/* Outline pill */}
                                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-muted transition-colors">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Growth Systems
                                </button>
                                {/* Icon button */}
                                <button className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors">
                                    <ChevronRight size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                                {['Primary pill', 'Primary accent', 'Ghost / text', 'Outline badge', 'Icon'].map((l) => (
                                    <p key={l} className="text-xs text-muted-foreground">{l}</p>
                                ))}
                            </div>
                        </Card>

                        {/* ── Inputs ── */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-8">Form Inputs</h3>
                        <Card className="mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-muted-foreground">Full name</label>
                                    <input
                                        type="text"
                                        placeholder="Adaeze Okonkwo"
                                        className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-muted-foreground">Work email</label>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-xs font-semibold text-muted-foreground">Growth challenge</label>
                                    <textarea
                                        rows={3}
                                        placeholder="We're looking to scale into new markets across Pan-Africa..."
                                        className="w-full rounded-xl border border-border bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 font-mono">rounded-xl · bg-transparent · border-border · ring-primary/30 on focus</p>
                        </Card>

                        {/* ── Cards ── */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-8">Cards</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {/* Solution card */}
                            <div className="relative rounded-2xl overflow-hidden h-64 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-foreground/80 to-foreground" />
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                                        <Layers size={18} className="text-white" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-white font-bold text-base">Growth Architecture</p>
                                    <p className="text-white/60 text-xs">Design the system before running the play. Strategy meets execution.</p>
                                </div>
                            </div>
                            {/* Arena card */}
                            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                                    <Zap size={18} className="text-white" strokeWidth={1.5} />
                                </div>
                                <p className="text-base font-bold text-foreground">Technology & Fintech</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">High-velocity growth plays in digital infrastructure and financial systems.</p>
                                <p className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-auto group cursor-pointer">
                                    Explore arena <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </p>
                            </div>
                            {/* Stat / quote card */}
                            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">From a partner</p>
                                    <p className="text-sm italic text-muted-foreground leading-relaxed">"Comcorpᵉ didn't just advise — they built the engine alongside us."</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-xs font-semibold text-foreground">— A portfolio company founder</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-8">Left: image-overlay solution card · Centre: bordered arena card · Right: testimonial / stat card</p>

                        {/* ── Badges & Tags ── */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-2">Badges & Tags</h3>
                        <Card className="mb-6">
                            <div className="flex flex-wrap gap-3 items-center">
                                {/* Pill outline */}
                                {['Growth Architecture', 'Specialist Pods', 'International Board', 'Growth Plays'].map((t) => (
                                    <span key={t} className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
                                        {t}
                                    </span>
                                ))}
                                {/* Dark pill with dot */}
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    On dark
                                </span>
                                {/* Semantic */}
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F8A55]/10 px-3 py-1 text-xs font-semibold text-[#0F8A55]">
                                    <CheckCircle2 size={12} strokeWidth={1.5} /> Success
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C97A1B]/10 px-3 py-1 text-xs font-semibold text-[#C97A1B]">
                                    <AlertCircle size={12} strokeWidth={1.5} /> Warning
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                                    <XCircle size={12} strokeWidth={1.5} /> Danger
                                </span>
                            </div>
                        </Card>

                        {/* ── Eyebrow + Section Header ── */}
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-2">Eyebrow & Section Header</h3>
                        <Card>
                            <div className="space-y-8">
                                {/* Standard */}
                                <div>
                                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                        <span className="text-primary">●</span> Growth Systems
                                    </p>
                                    <h2 className="text-3xl font-bold text-foreground leading-tight">
                                        Growth is architecture, not effort.
                                    </h2>
                                    <p className="text-base text-muted-foreground mt-3 max-w-lg leading-relaxed">
                                        From data and creativity to technology and strategy — we build unified systems that perform in complex markets.
                                    </p>
                                </div>
                                <div className="border-t border-border pt-6">
                                    <p className="text-xs text-muted-foreground font-mono">
                                        Pattern: <span className="font-mono">● EYEBROW</span> → <span className="font-mono">H2 (sentence case, bold)</span> → <span className="font-mono">Lede (muted, max-w-lg)</span>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </section>


                    {/* ── Footer pad ── */}
                    <div className="h-24" />

                </main>
            </div>
        </div>
    )
}

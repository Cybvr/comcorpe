type ImagePlaceholderProps = {
  label: string
  className?: string
  tone?: 'light' | 'dark'
}

export default function ImagePlaceholder({
  label,
  className = '',
  tone = 'light',
}: ImagePlaceholderProps) {
  const isDark = tone === 'dark'
  const frame = isDark
    ? 'bg-background/[0.06] border-background/[0.18] text-background/50'
    : 'bg-border border-border text-muted-foreground/70'
  const line = isDark ? 'border-background/[0.12]' : 'border-input'
  const marker = isDark ? 'bg-primary' : 'bg-primary'

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden border ${frame} flex items-center justify-center ${className}`}
    >
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i === 0 ? '' : `border-l ${line}`} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 grid grid-rows-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i === 0 ? '' : `border-t ${line}`} />
        ))}
      </div>
      <div aria-hidden="true" className={`absolute left-6 right-6 top-6 border-t ${line}`} />
      <div aria-hidden="true" className={`absolute bottom-6 left-6 right-6 border-t ${line}`} />
      <div className="relative z-10 flex max-w-[24ch] flex-col items-center gap-3 px-5 text-center">
        <span className={`h-2 w-2 rounded-full ${marker}`} />
        <span className="font-mono text-[10px] uppercase tracking-widest italic leading-relaxed">
          {label}
        </span>
      </div>
    </div>
  )
}

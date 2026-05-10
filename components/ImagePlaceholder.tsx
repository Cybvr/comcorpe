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
    ? 'bg-paper/[0.06] border-paper/[0.18] text-paper/50'
    : 'bg-ink-10 border-ink-10 text-ink-40'
  const line = isDark ? 'border-paper/[0.12]' : 'border-ink-20'
  const marker = isDark ? 'bg-blue' : 'bg-blue'

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

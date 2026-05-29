const GRADIENTS = [
  'from-indigo-600 to-violet-600',
  'from-emerald-600 to-teal-600',
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-violet-600 to-fuchsia-600',
  'from-slate-800 to-slate-900',
  'from-cyan-600 to-blue-600',
]

function gradientIndex(id?: string | number) {
  if (id == null) return 0
  const n =
    typeof id === 'number'
      ? id
      : id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return n % GRADIENTS.length
}

export default function PostThumbnail({
  src,
  alt,
  category,
  id,
  className = 'aspect-video w-full',
  showBadge = true,
}: {
  src?: string | null
  alt: string
  category?: string
  id?: string | number
  className?: string
  showBadge?: boolean
}) {
  const gradient = GRADIENTS[gradientIndex(id)]

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-6 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[1px]" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="relative z-10 font-display font-black text-xl tracking-tight text-white/90 select-none uppercase truncate">
            {category || 'Insights'}
          </div>
        </div>
      )}
      {showBadge && category && (
        <div className="absolute top-3 left-3 z-20">
          <span className="font-mono text-[9px] px-2 py-0.5 bg-background/90 backdrop-blur-sm border border-border rounded-full uppercase tracking-eyebrow text-foreground">
            {category}
          </span>
        </div>
      )}
    </div>
  )
}

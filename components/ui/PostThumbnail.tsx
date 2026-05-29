import Image from 'next/image'

export default function PostThumbnail({
  src,
  alt,
  category,
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
  return (
    <div className={`relative overflow-hidden bg-background ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="relative z-10 font-display font-black text-xl tracking-tight text-foreground/30 select-none uppercase truncate">
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

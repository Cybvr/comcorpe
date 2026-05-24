import { Zap } from 'lucide-react'

interface SLABadgeProps {
  variant?: 'chip' | 'banner'
  className?: string
}

export default function SLABadge({ variant = 'chip', className = '' }: SLABadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`flex items-center gap-3 px-5 py-3 bg-foreground text-background rounded-xl ${className}`}>
        <Zap size={15} className="text-primary shrink-0" strokeWidth={2.5} />
        <p className="font-text text-sm font-semibold">
          Senior talent matched in{' '}
          <span className="text-primary">48 hours</span>
          {' '}— or we escalate personally.
        </p>
      </div>
    )
  }

  return null
}

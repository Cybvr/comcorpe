'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  imageClassName?: string
  strength?: number
  priority?: boolean
}

export default function ParallaxImage({ src, alt, imageClassName = '', strength = 25, priority }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    let rafId: number

    const update = () => {
      const rect = container.getBoundingClientRect()
      const viewportH = window.innerHeight
      const progress = 1 - rect.bottom / (viewportH + rect.height)
      const offset = (progress - 0.5) * strength * 2
      inner.style.transform = `translateY(${offset}px)`
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [strength])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        className="absolute left-0 right-0"
        style={{ top: `-${strength}px`, bottom: `-${strength}px` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${imageClassName}`}
          priority={priority}
        />
      </div>
    </div>
  )
}

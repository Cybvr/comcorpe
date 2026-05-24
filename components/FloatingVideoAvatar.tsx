'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const VIDEO_SRC = '/video/elizabeth.mp4'

export default function FloatingVideoAvatar() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const video = videoRef.current

    if (!video) return

    if (isOpen) {
      void video.play().catch(() => {})
      return
    }

    video.pause()
    video.currentTime = 0
  }, [isMounted, isOpen])

  if (!isMounted) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[90] sm:right-5 sm:bottom-5">
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {isOpen && (
          <section className="relative w-[min(15rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1rem] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close video"
              className="absolute top-2 right-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <X size={13} />
            </button>

            <div className="bg-black">
              <video
                ref={videoRef}
                className="aspect-[9/14] w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/elizabeth.png"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            </div>
          </section>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Elizabeth video' : 'Open Elizabeth video'}
          className="group relative h-14 w-14 overflow-hidden rounded-[0.8rem] bg-white shadow-[0_14px_36px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Image
            src="/images/elizabeth.png"
            alt="Elizabeth"
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
        </button>
      </div>
    </div>
  )
}

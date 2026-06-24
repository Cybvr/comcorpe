'use client'

import { useEffect, useState } from 'react'

export default function HomeVideoDemoButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="border border-white/40 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white/80 transition-colors duration-200 hover:border-white hover:text-white md:px-5 md:text-[11px]"
      >
        Demo
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl border border-white/20 bg-black p-3 md:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mb-3 ml-auto block text-[10px] uppercase tracking-[0.14em] text-white/70 transition-opacity duration-200 hover:opacity-70 md:text-[11px]"
            >
              Close
            </button>
            <video
              className="block aspect-video w-full bg-black"
              src="/video/africasnext.mp4"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </>
  )
}

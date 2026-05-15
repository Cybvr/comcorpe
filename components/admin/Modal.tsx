'use client'
import React, { useEffect } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-paper border border-ink-20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-paper border-b border-ink-10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-lg tracking-h3 text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-40 hover:text-ink transition-colors duration-100 font-mono text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

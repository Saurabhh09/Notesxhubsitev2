'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  preview1: string | null
  preview2: string | null
}

export function PreviewViewer({ preview1, preview2 }: Props) {
  const [active, setActive] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const pages = [preview1, preview2].filter(Boolean) as string[]

  if (pages.length === 0) return null

  return (
    <>
      {/* Thumbnail strip */}
      <div className="flex gap-3">
        {pages.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i)
              setModalOpen(true)
            }}
            className={`relative w-24 sm:w-28 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200
                         ${active === i ? 'border-ink-500 shadow-md' : 'border-paper-200 hover:border-ink-300'}`}
          >
            <Image src={src} alt={`Preview page ${i + 1}`} fill className="object-cover" sizes="120px" />
            <div className="absolute inset-0 bg-ink-900/0 hover:bg-ink-900/10 transition-colors flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
            </div>
            <span className="absolute bottom-1 right-1.5 text-[10px] font-medium text-white bg-ink-700/70 rounded px-1">
              {i + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Full-screen preview modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink-900/90 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-2 -right-2 z-10 w-10 h-10 rounded-full bg-white text-ink-700 shadow-lg flex items-center justify-center hover:bg-paper-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Page tabs */}
            <div className="flex gap-2 mb-4 justify-center">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active === i
                      ? 'bg-white text-ink-700'
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                  Page {i + 1}
                </button>
              ))}
            </div>

            {/* Preview image */}
            <div className="rounded-xl overflow-hidden bg-white shadow-2xl">
              <Image
                src={pages[active]}
                alt={`Preview page ${active + 1}`}
                width={900}
                height={1200}
                className="w-full h-auto"
              />
            </div>

            <p className="text-center text-sm text-paper-300 mt-4">
              Free preview — {pages.length} of total pages shown
            </p>
          </div>
        </div>
      )}
    </>
  )
}

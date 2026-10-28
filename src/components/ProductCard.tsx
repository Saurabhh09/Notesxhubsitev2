'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { formatPrice, discountPercent } from '@/lib/constants'

export interface ProductCardProps {
  slug: string
  name: string
  coverUrl: string | null
  category?: string
  subject?: string
  priceInPaise: number
  compareAtPaise?: number | null
}

// Pastel theme mapping based on subject / category
function getPastelTheme(subject?: string, category?: string) {
  const s = (subject || '').toLowerCase()
  const c = (category || '').toLowerCase()

  if (s.includes('physics') || c.includes('12')) {
    return {
      bg: 'bg-[#F2ECFE]',
      border: 'border-[#E2D6FC]',
      badge: 'bg-[#E3D4FB] text-[#552AA3]',
      tagBg: 'bg-[#EADEFC]',
      accent: '#6E3BB8',
      icon: '🪐',
    }
  }
  if (s.includes('chem') || c.includes('jee')) {
    return {
      bg: 'bg-[#E4F7EC]',
      border: 'border-[#C5EED6]',
      badge: 'bg-[#CEF2DC] text-[#186D3A]',
      tagBg: 'bg-[#D2F2DF]',
      accent: '#186D3A',
      icon: '⚗️',
    }
  }
  if (s.includes('bio') || c.includes('neet')) {
    return {
      bg: 'bg-[#FFEBE8]',
      border: 'border-[#FFD7D0]',
      badge: 'bg-[#FED5CE] text-[#A33426]',
      tagBg: 'bg-[#FEDBD5]',
      accent: '#B03322',
      icon: '🌿',
    }
  }
  if (s.includes('math') || c.includes('10')) {
    return {
      bg: 'bg-[#E3F0FF]',
      border: 'border-[#CCE3FE]',
      badge: 'bg-[#CCE4FF] text-[#155FA8]',
      tagBg: 'bg-[#D3E8FF]',
      accent: '#1867B8',
      icon: '📐',
    }
  }
  return {
    bg: 'bg-[#FFF4D3]',
    border: 'border-[#FFE7A3]',
    badge: 'bg-[#FEE398] text-[#8C6404]',
    tagBg: 'bg-[#FEE8AC]',
    accent: '#8C6404',
    icon: '📚',
  }
}

export function ProductCard({
  slug,
  name,
  coverUrl,
  category,
  subject,
  priceInPaise,
  compareAtPaise,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const discount = compareAtPaise ? discountPercent(compareAtPaise, priceInPaise) : 0
  const theme = getPastelTheme(subject, category)

  return (
    <div className="group relative flex flex-col rounded-3xl bg-white border border-[#EAE4D5] shadow-card hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      {/* Top Playful Header Banner (Notebook Style) */}
      <div className={`${theme.bg} ${theme.border} border-b px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-base select-none">{theme.icon}</span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {category || 'CBSE / Board'}
            </p>
            <p className="text-sm font-extrabold text-ink-900 leading-none">
              {subject || 'Complete Notes'}
            </p>
          </div>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setLiked(!liked)
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            liked
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Main Cover Image */}
      <Link href={`/notes/${slug}`} className="block relative aspect-[4/3] bg-cream-50 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-104"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pattern-lined">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-xs mt-2 font-medium">Handwritten Notes</span>
          </div>
        )}

        {/* Floating Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm">
            {discount}% OFF
          </span>
        )}

        {/* Free Preview hover pill */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-ink-900/90 text-white shadow-md backdrop-blur-xs flex items-center gap-1.5">
            <span>👁️</span> Free 2-Page Preview
          </span>
        </div>
      </Link>

      {/* Info & Pricing */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/notes/${slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-ink-900 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            Handwritten diagrams • Formulas • Previous Years Qs
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg text-ink-900">
              {formatPrice(priceInPaise)}
            </span>
            {compareAtPaise && compareAtPaise > priceInPaise && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(compareAtPaise)}
              </span>
            )}
          </div>

          <Link
            href={`/notes/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-ink-800 hover:bg-sky-500 hover:text-white transition-colors"
          >
            <span>View</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

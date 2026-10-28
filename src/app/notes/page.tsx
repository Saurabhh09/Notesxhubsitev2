'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  priceInPaise: number
  compareAtPaise: number | null
  subject: string | null
  subjectSlug: string | null
  categories: { name: string; slug: string }[]
  coverUrl: string | null
}

function NotesContent() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialQ)
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('q', search)
    if (sort) params.set('sort', sort)

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        {/* Playful Header Banner */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE959] text-ink-900 text-xs font-bold mb-3 border border-[#F2DE44]">
            <span>📖</span> Explore Study Resources
          </div>
          <h1 className="section-heading">Browse Handwritten Notes</h1>
          <p className="section-subheading mx-auto">
            Find high-scoring, concept-clearing notes for Class 10, 11, 12 CBSE & JEE Main preparation.
          </p>
        </div>

        {/* Quick Filter Pill Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none justify-start sm:justify-center">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === ''
                ? 'bg-ink-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Notes
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(category === c.slug ? '' : c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                category === c.slug
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={() => setCategory(category === 'quick-revision' ? '' : 'quick-revision')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              category === 'quick-revision'
                ? 'bg-amber-400 text-ink-900 shadow-sm'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ⚡ Quick Revision
          </button>
        </div>

        {/* Search & Sort Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 p-3 sm:p-4 rounded-3xl bg-white border border-[#E9DFCB] shadow-card">
          {/* Search Input */}
          <div className="flex-1 relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search by topic, chapter, formula, or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Category Dropdown (for precision) */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field sm:w-48 text-xs font-semibold"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field sm:w-44 text-xs font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="h-10 bg-slate-100" />
                <div className="aspect-[4/3] bg-slate-50" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-6 bg-slate-100 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#E9DFCB] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-extrabold text-ink-900 mb-2">No notes match your filter</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
              We couldn&apos;t find notes matching &ldquo;{search}&rdquo;. Try resetting filters or searching for Physics, Electrostatics, etc.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setCategory('')
              }}
              className="btn-primary !text-xs !py-2.5 !px-6"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                coverUrl={p.coverUrl}
                category={p.categories[0]?.name}
                subject={p.subject ?? undefined}
                priceInPaise={p.priceInPaise}
                compareAtPaise={p.compareAtPaise}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center font-bold text-slate-400">Loading marketplace...</div>}>
      <NotesContent />
    </Suspense>
  )
}

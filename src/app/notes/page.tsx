'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/lib/constants'
import { ProductCard, type ProductCardProps } from '@/components/ProductCard'

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

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
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
    <div className="py-10 lg:py-16">
      <div className="container-page">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="section-heading">Browse Notes</h1>
          <p className="section-subheading">
            Discover quality handwritten notes for your class or entrance exam.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-xl bg-white border border-paper-200 shadow-card">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-paper-200 bg-white overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-paper-100" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-paper-200 rounded w-1/3" />
                  <div className="h-4 bg-paper-200 rounded w-3/4" />
                  <div className="h-5 bg-paper-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-graphite-400 mb-4">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h3 className="text-lg font-semibold text-ink-700 mb-2">No notes found</h3>
            <p className="text-sm text-graphite-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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

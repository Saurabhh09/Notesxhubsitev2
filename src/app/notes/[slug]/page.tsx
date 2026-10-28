import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice, discountPercent } from '@/lib/constants'
import { getSession } from '@/lib/auth'
import { BuyButton } from './BuyButton'
import { PreviewViewer } from './PreviewViewer'
import { ProductCard } from '@/components/ProductCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { name: true, description: true },
  })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Handwritten Notes | NotesXhub`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      subject: true,
      categories: { include: { category: true } },
      files: true,
    },
  })

  if (!product) notFound()

  // Related products
  const related = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: product.id },
    },
    take: 4,
    include: {
      subject: true,
      categories: { include: { category: true } },
      files: { where: { type: 'COVER' }, select: { storageKey: true } },
    },
  })

  const session = await getSession()
  let hasAccess = false
  if (session) {
    const ent = await prisma.entitlement.findUnique({
      where: { userId_productId: { userId: session.userId, productId: product.id } },
    })
    hasAccess = !!ent
  }

  const cover = product.files.find((f) => f.type === 'COVER')
  const preview1 = product.files.find((f) => f.type === 'PREVIEW_1')
  const preview2 = product.files.find((f) => f.type === 'PREVIEW_2')
  const discount = product.compareAtPaise
    ? discountPercent(product.compareAtPaise, product.priceInPaise)
    : 0

  const topics: string[] = (() => {
    try { return JSON.parse(product.topics) } catch { return [] }
  })()
  const includes: string[] = (() => {
    try { return JSON.parse(product.includes) } catch { return [] }
  })()

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/notes" className="hover:text-sky-600 transition-colors">Notes</Link>
          {product.categories[0] && (
            <>
              <span>/</span>
              <Link href={`/category/${product.categories[0].category.slug}`} className="hover:text-sky-600 transition-colors">
                {product.categories[0].category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-ink-900 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Cover + Interactive Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#E9DFCB] bg-white shadow-card p-3 sm:p-4">
              <div className="relative rounded-2xl overflow-hidden bg-cream-50 border border-slate-100">
                {cover ? (
                  <Image
                    src={cover.storageKey}
                    alt={product.name}
                    width={cover.width || 600}
                    height={cover.height || 800}
                    className="w-full h-auto object-cover"
                    priority
                  />
                ) : (
                  <div className="aspect-[3/4] bg-cream-50 flex items-center justify-center text-slate-400">
                    No cover preview
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm">
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* 2-page Free Interactive Preview */}
            {(preview1 || preview2) && (
              <div className="rounded-3xl bg-white border border-[#E9DFCB] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>👁️</span> Free Sample Pages
                  </h3>
                  <span className="text-[11px] font-semibold text-sky-600">Click page to expand</span>
                </div>
                <PreviewViewer
                  preview1={preview1?.storageKey || null}
                  preview2={preview2?.storageKey || null}
                />
              </div>
            )}
          </div>

          {/* Right Column: Note Title, Highlights, Price & Checkout */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category / Subject Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.categories.map((c) => (
                <span
                  key={c.categoryId}
                  className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-800 border border-sky-100"
                >
                  {c.category.name}
                </span>
              ))}
              {product.subject && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                  {product.subject.name}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                ✓ Verified Topper Notes
              </span>
            </div>

            {/* Note Name */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>

            {product.longDescription && (
              <p className="text-sm text-slate-500 leading-relaxed">
                {product.longDescription}
              </p>
            )}

            {/* Price Box */}
            <div className="rounded-3xl bg-gradient-to-r from-[#FFF8E7] to-[#F0F8FF] border border-[#FFE7A5] p-5 sm:p-6 shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-ink-900">
                  {formatPrice(product.priceInPaise)}
                </span>
                {product.compareAtPaise && product.compareAtPaise > product.priceInPaise && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through">
                      {formatPrice(product.compareAtPaise)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                One-time payment • Lifetime access • Free updates
              </p>

              {/* Buy / Download Button */}
              <div className="mt-5">
                <BuyButton
                  productId={product.id}
                  productName={product.name}
                  priceInPaise={product.priceInPaise}
                  hasAccess={hasAccess}
                  isLoggedIn={!!session}
                />
              </div>

              {/* Guarantee row */}
              <div className="mt-4 pt-3 border-t border-amber-200/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500">🛡️</span> Secure UPI & Card checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sky-500">⚡</span> Instant download to Library
                </span>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg shrink-0">
                  ✍️
                </div>
                <div>
                  <p className="font-bold text-xs text-ink-900">Neat Handwriting</p>
                  <p className="text-[11px] text-slate-500">Structured layout for fast recall</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                  🎯
                </div>
                <div>
                  <p className="font-bold text-xs text-ink-900">Exam-Oriented</p>
                  <p className="text-[11px] text-slate-500">Formula lists & solved PYQs</p>
                </div>
              </div>
            </div>

            {/* What's included */}
            {includes.length > 0 && (
              <div className="rounded-3xl bg-white border border-[#E9DFCB] p-6 shadow-xs">
                <h3 className="text-sm font-extrabold text-ink-900 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📦</span> What&apos;s Included In This PDF
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  {includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics covered */}
            {topics.length > 0 && (
              <div className="rounded-3xl bg-white border border-[#E9DFCB] p-6 shadow-xs">
                <h3 className="text-sm font-extrabold text-ink-900 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📌</span> Key Concepts & Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              {product.pageCount && (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pages</p>
                  <p className="text-base font-extrabold text-ink-900 mt-0.5">{product.pageCount} Pages</p>
                </div>
              )}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">File Type</p>
                <p className="text-base font-extrabold text-ink-900 mt-0.5">{product.fileFormat} File</p>
              </div>
              {product.audience && (
                <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white border border-slate-200/80 p-3.5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Level</p>
                  <p className="text-base font-extrabold text-ink-900 mt-0.5">{product.audience}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Notes */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-heading">More Notes You Might Need</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Complementary study material for your revisions.
                </p>
              </div>
              <Link href="/notes" className="text-xs font-bold text-sky-600 hover:text-sky-700">
                Browse All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  coverUrl={p.files[0]?.storageKey ?? null}
                  category={p.categories[0]?.category.name}
                  subject={p.subject?.name}
                  priceInPaise={p.priceInPaise}
                  compareAtPaise={p.compareAtPaise}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 truncate font-medium">{product.name}</p>
            <p className="text-lg font-black text-ink-900">{formatPrice(product.priceInPaise)}</p>
          </div>
          <div className="shrink-0">
            <BuyButton
              productId={product.id}
              productName={product.name}
              priceInPaise={product.priceInPaise}
              hasAccess={hasAccess}
              isLoggedIn={!!session}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  )
}

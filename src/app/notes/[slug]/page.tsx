import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice, discountPercent } from '@/lib/constants'
import { getSession } from '@/lib/auth'
import { BuyButton } from './BuyButton'
import { PreviewViewer } from './PreviewViewer'
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
    title: product.name,
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
    <div className="py-10 lg:py-16">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Cover + Preview */}
          <div>
            <div className="rounded-2xl overflow-hidden border border-paper-200 bg-white shadow-card">
              {cover ? (
                <Image
                  src={cover.storageKey}
                  alt={product.name}
                  width={cover.width || 600}
                  height={cover.height || 800}
                  className="w-full h-auto"
                  priority
                />
              ) : (
                <div className="aspect-[3/4] bg-paper-100 flex items-center justify-center text-graphite-400">
                  No cover available
                </div>
              )}
            </div>

            {/* 2-page preview */}
            {(preview1 || preview2) && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-ink-700 mb-3">Free Preview</h3>
                <PreviewViewer
                  preview1={preview1?.storageKey || null}
                  preview2={preview2?.storageKey || null}
                />
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category breadcrumb */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.categories.map((c) => (
                <span key={c.categoryId} className="badge-category">{c.category.name}</span>
              ))}
              {product.subject && (
                <span className="text-xs text-graphite-400">· {product.subject.name}</span>
              )}
            </div>

            <h1 className="font-display text-2xl lg:text-3xl font-bold text-ink-800 tracking-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-graphite-500 leading-relaxed">{product.description}</p>
            {product.longDescription && (
              <p className="mt-3 text-sm text-graphite-400 leading-relaxed">{product.longDescription}</p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-ink-700">
                {formatPrice(product.priceInPaise)}
              </span>
              {product.compareAtPaise && product.compareAtPaise > product.priceInPaise && (
                <>
                  <span className="text-lg text-graphite-400 line-through">
                    {formatPrice(product.compareAtPaise)}
                  </span>
                  <span className="badge-discount">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Buy / Download button */}
            <div className="mt-6">
              <BuyButton
                productId={product.id}
                productName={product.name}
                priceInPaise={product.priceInPaise}
                hasAccess={hasAccess}
                isLoggedIn={!!session}
              />
            </div>

            {/* Product details */}
            <div className="mt-8 space-y-6">
              {/* What's included */}
              {includes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink-700 mb-2">What&apos;s Included</h3>
                  <ul className="space-y-1.5">
                    {includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-graphite-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600 mt-0.5 shrink-0">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics */}
              {topics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-ink-700 mb-2">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-paper-100 text-xs text-graphite-600 border border-paper-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-paper-200">
                {product.pageCount && (
                  <div>
                    <p className="text-xs text-graphite-400">Pages</p>
                    <p className="text-sm font-semibold text-ink-700">{product.pageCount}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-graphite-400">Format</p>
                  <p className="text-sm font-semibold text-ink-700">{product.fileFormat}</p>
                </div>
                {product.audience && (
                  <div className="col-span-2">
                    <p className="text-xs text-graphite-400">Best For</p>
                    <p className="text-sm font-semibold text-ink-700">{product.audience}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-paper-200 p-4 shadow-lift">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-graphite-400">{product.name}</p>
            <p className="text-lg font-bold text-ink-700">{formatPrice(product.priceInPaise)}</p>
          </div>
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
  )
}

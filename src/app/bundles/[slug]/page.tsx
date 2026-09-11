import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, discountPercent } from '@/lib/constants'
import { getSession } from '@/lib/auth'
import { BundleBuyButton } from './BundleBuyButton'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bundle = await prisma.bundle.findUnique({ where: { slug }, select: { name: true, description: true } })
  if (!bundle) return { title: 'Bundle Not Found' }
  return { title: bundle.name, description: bundle.description }
}

export default async function BundlePage({ params }: Props) {
  const { slug } = await params
  const bundle = await prisma.bundle.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      items: {
        include: {
          product: {
            include: {
              subject: true,
              categories: { include: { category: true } },
              files: { where: { type: 'COVER' }, select: { storageKey: true } },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!bundle) notFound()

  const session = await getSession()
  const totalValue = bundle.items.reduce((s, i) => s + i.product.priceInPaise, 0)
  const savingsPercent = discountPercent(totalValue, bundle.priceInPaise)

  return (
    <div className="py-10 lg:py-16">
      <div className="container-page max-w-4xl">
        <div className="badge-price mb-4">Bundle Offer</div>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-ink-800 tracking-tight">
          {bundle.name}
        </h1>
        <p className="mt-3 text-graphite-500 leading-relaxed max-w-2xl">{bundle.description}</p>

        {/* Included products */}
        <div className="mt-10 space-y-4">
          <h2 className="text-sm font-semibold text-graphite-400 uppercase tracking-wider">
            3 Notes Included
          </h2>
          {bundle.items.map((item, i) => (
            <Link
              key={item.productId}
              href={`/notes/${item.product.slug}`}
              className="card !hover:translate-y-0 overflow-hidden flex flex-row group"
            >
              <div className="w-20 sm:w-24 shrink-0 bg-paper-100">
                {item.product.files[0]?.storageKey ? (
                  <Image
                    src={item.product.files[0].storageKey}
                    alt={item.product.name}
                    width={96}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-graphite-400">
                    {i + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 flex items-center justify-between min-w-0 gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.product.categories[0] && (
                      <span className="badge-category text-[10px]">
                        {item.product.categories[0].category.name}
                      </span>
                    )}
                    {item.product.subject && (
                      <span className="text-xs text-graphite-400">{item.product.subject.name}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-ink-700 truncate group-hover:text-ink-500 transition-colors">
                    {item.product.name}
                  </h3>
                </div>
                <p className="text-sm font-bold text-graphite-400 line-through shrink-0">
                  {formatPrice(item.product.priceInPaise)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pricing summary */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-ink-50 to-paper-100 border border-ink-100 p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-graphite-400 mb-1">Individual total</p>
              <p className="text-xl text-graphite-400 line-through">{formatPrice(totalValue)}</p>
              <p className="text-3xl font-bold text-ink-700 mt-1">{formatPrice(bundle.priceInPaise)}</p>
              <span className="badge-discount mt-2">
                Save {savingsPercent}% — {formatPrice(totalValue - bundle.priceInPaise)} off
              </span>
            </div>

            <BundleBuyButton
              bundleId={bundle.id}
              bundleName={bundle.name}
              priceInPaise={bundle.priceInPaise}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

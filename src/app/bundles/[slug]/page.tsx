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
  return { title: `${bundle.name} | NotesXhub`, description: bundle.description }
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
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/notes" className="hover:text-sky-600 transition-colors">Bundles</Link>
          <span>/</span>
          <span className="text-ink-900 font-bold">{bundle.name}</span>
        </div>

        {/* Bundle Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF4D3] via-[#FFF8E7] to-[#E8F3FF] border border-[#FFE7A5] p-6 sm:p-10 mb-10 shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
              ⚡ Special Value Bundle
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-xs">
              Save {savingsPercent}% ({formatPrice(totalValue - bundle.priceInPaise)})
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight leading-tight">
            {bundle.name}
          </h1>
          <p className="mt-3 text-base text-slate-700 font-medium max-w-2xl leading-relaxed">
            {bundle.description}
          </p>
        </div>

        {/* Included products */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              {bundle.items.length} Notes Included in this Bundle
            </h2>
            <span className="text-xs font-bold text-emerald-600">
              ✓ All 3 instant unlocked together
            </span>
          </div>

          {bundle.items.map((item, i) => (
            <Link
              key={item.productId}
              href={`/notes/${item.product.slug}`}
              className="group flex rounded-2xl bg-white border border-[#E9DFCB] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all p-3 sm:p-4 items-center gap-4"
            >
              <div className="w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden bg-cream-50 border border-slate-100 shrink-0">
                {item.product.files[0]?.storageKey ? (
                  <Image
                    src={item.product.files[0].storageKey}
                    alt={item.product.name}
                    width={80}
                    height={106}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    #{i + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.product.categories[0] && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                      {item.product.categories[0].category.name}
                    </span>
                  )}
                  {item.product.subject && (
                    <span className="text-xs font-medium text-slate-400">
                      {item.product.subject.name}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-ink-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {item.product.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(item.product.priceInPaise)}
                </p>
                <span className="text-xs font-bold text-sky-600 group-hover:underline">
                  Inspect →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pricing & Checkout Summary Box */}
        <div className="rounded-3xl bg-white border border-[#E9DFCB] p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bundle Deal Price
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-ink-900">
                {formatPrice(bundle.priceInPaise)}
              </span>
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(totalValue)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Save {savingsPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Full lifetime download access for all included items.
            </p>
          </div>

          <div className="w-full sm:w-auto shrink-0">
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

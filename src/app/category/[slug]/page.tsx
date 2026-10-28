import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CATEGORIES } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.slug === slug)
  if (!cat) return { title: 'Category Not Found' }
  return {
    title: `${cat.name} Handwritten Notes | NotesXhub`,
    description: `High-scoring handwritten notes for ${cat.name}. Preview before you buy, instant PDF download.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const catInfo = CATEGORIES.find((c) => c.slug === slug)
  if (!catInfo) notFound()

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            include: {
              subject: true,
              categories: { include: { category: true } },
              files: { where: { type: 'COVER' }, select: { storageKey: true } },
            },
          },
        },
      },
    },
  })

  const products = category?.products
    .map((pc) => pc.product)
    .filter((p) => p.status === 'PUBLISHED') ?? []

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/notes" className="hover:text-sky-600 transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-ink-900">{catInfo.name}</span>
        </div>

        {/* Category Header Banner (Playful Pastel Design) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF4D3] via-[#FFF8E7] to-[#F0F8FF] border border-[#FFE7A5] p-6 sm:p-10 mb-10 shadow-xs relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/90 border border-amber-300 text-amber-900 shadow-xs mb-3">
              🎓 {catInfo.name} Curriculum
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-900 tracking-tight">
              {catInfo.name} Notes
            </h1>
            {category?.tagline && (
              <p className="mt-2 text-base sm:text-lg text-slate-700 font-semibold">
                {category.tagline}
              </p>
            )}
            {category?.intro && (
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {category.intro}
              </p>
            )}
          </div>
          <div className="absolute right-4 bottom-2 text-6xl sm:text-8xl opacity-30 select-none pointer-events-none">
            📖
          </div>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-700">
                Available Notes ({products.length})
              </span>
              <Link href="/notes" className="text-xs font-bold text-sky-600 hover:text-sky-700">
                Browse All Subjects →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  coverUrl={p.files[0]?.storageKey ?? null}
                  category={catInfo.name}
                  subject={p.subject?.name}
                  priceInPaise={p.priceInPaise}
                  compareAtPaise={p.compareAtPaise}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#E9DFCB] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-3xl mx-auto mb-4">
              📚
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-2">No notes uploaded for {catInfo.name} yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
              We are constantly digitizing and verifying topper notes. Check our Class 12 or JEE Main notes in the meantime!
            </p>
            <Link href="/notes" className="btn-primary !text-xs !py-2.5 !px-6">
              Browse All Notes
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

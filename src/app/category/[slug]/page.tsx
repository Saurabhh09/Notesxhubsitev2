import { notFound } from 'next/navigation'
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
    title: `${cat.name} Notes`,
    description: `Premium handwritten notes for ${cat.name}. Preview before you buy, instant PDF download.`,
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
    <div className="py-10 lg:py-16">
      <div className="container-page">
        {/* Category header */}
        <div className="mb-10">
          <div className="badge-category mb-3">{catInfo.name}</div>
          <h1 className="section-heading">{catInfo.name} Notes</h1>
          {category?.tagline && (
            <p className="section-subheading">{category.tagline}</p>
          )}
          {category?.intro && (
            <p className="mt-3 text-sm text-graphite-400 leading-relaxed max-w-2xl">{category.intro}</p>
          )}
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
        ) : (
          <div className="text-center py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-graphite-400 mb-4">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="text-lg font-semibold text-ink-700 mb-2">No notes yet</h3>
            <p className="text-sm text-graphite-500">Notes for {catInfo.name} will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

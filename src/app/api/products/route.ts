import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const subject = url.searchParams.get('subject')
  const search = url.searchParams.get('q')
  const sort = url.searchParams.get('sort') || 'newest'
  const featured = url.searchParams.get('featured')

  const where: Record<string, unknown> = { status: 'PUBLISHED' }

  if (category) {
    where.categories = { some: { category: { slug: category } } }
  }
  if (subject) {
    where.subject = { slug: subject }
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }
  if (featured === 'true') {
    where.featured = true
  }

  const orderBy: Record<string, string> =
    sort === 'price-asc' ? { priceInPaise: 'asc' } :
    sort === 'price-desc' ? { priceInPaise: 'desc' } :
    { createdAt: 'desc' }

  const products = await prisma.product.findMany({
    where: where as any,
    orderBy: orderBy as any,
    include: {
      subject: true,
      categories: { include: { category: true } },
      files: { where: { type: 'COVER' }, select: { storageKey: true } },
    },
  })

  const result = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    priceInPaise: p.priceInPaise,
    compareAtPaise: p.compareAtPaise,
    featured: p.featured,
    subject: p.subject?.name ?? null,
    subjectSlug: p.subject?.slug ?? null,
    categories: p.categories.map((c) => ({
      name: c.category.name,
      slug: c.category.slug,
    })),
    coverUrl: p.files[0]?.storageKey ?? null,
  }))

  return NextResponse.json({ products: result })
}

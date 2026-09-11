import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Products' }

export default async function AdminProductsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/login')

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      subject: true,
      categories: { include: { category: true } },
      files: { where: { type: 'COVER' }, select: { storageKey: true } },
      _count: { select: { entitlements: true, orderItems: true } },
    },
  })

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products', active: true },
    { href: '/admin/bundles', label: 'Bundles' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/customers', label: 'Customers' },
  ]

  return (
    <div className="py-10 lg:py-16">
      <div className="container-page">
        <div className="flex flex-wrap gap-2 mb-10">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                n.active
                  ? 'bg-ink-700 text-white'
                  : 'bg-white text-graphite-600 border border-paper-200 hover:bg-ink-50'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="section-heading">Products ({products.length})</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Subject</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Price</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Sales</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-paper-100 hover:bg-paper-50">
                  <td className="py-3 px-4">
                    <Link href={`/notes/${p.slug}`} className="font-medium text-ink-700 hover:text-ink-500 transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-graphite-600">
                    {p.categories.map((c) => c.category.name).join(', ') || '—'}
                  </td>
                  <td className="py-3 px-4 text-graphite-600">{p.subject?.name || '—'}</td>
                  <td className="py-3 px-4 text-right font-semibold text-ink-700">
                    {formatPrice(p.priceInPaise)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`badge ${
                        p.status === 'PUBLISHED'
                          ? 'bg-green-50 text-green-700'
                          : p.status === 'DRAFT'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-graphite-400/10 text-graphite-500'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-graphite-600">{p._count.entitlements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

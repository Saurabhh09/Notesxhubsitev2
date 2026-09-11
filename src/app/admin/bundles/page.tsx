import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Bundles' }

export default async function AdminBundlesPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/login')

  const bundles = await prisma.bundle.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { name: true, priceInPaise: true } } } },
    },
  })

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/bundles', label: 'Bundles', active: true },
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
                n.active ? 'bg-ink-700 text-white' : 'bg-white text-graphite-600 border border-paper-200 hover:bg-ink-50'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <h1 className="section-heading mb-8">Bundles ({bundles.length})</h1>

        <div className="space-y-4">
          {bundles.map((bundle) => {
            const totalValue = bundle.items.reduce((s, i) => s + i.product.priceInPaise, 0)
            return (
              <div key={bundle.id} className="card p-6 !hover:translate-y-0">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-ink-700">{bundle.name}</h3>
                      <span className={`badge ${
                        bundle.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {bundle.status}
                      </span>
                    </div>
                    <p className="text-sm text-graphite-500">{bundle.description}</p>
                    <div className="mt-3 space-y-1">
                      {bundle.items.map((item) => (
                        <p key={item.productId} className="text-xs text-graphite-400">
                          • {item.product.name} ({formatPrice(item.product.priceInPaise)})
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-graphite-400 line-through">{formatPrice(totalValue)}</p>
                    <p className="text-xl font-bold text-ink-700">{formatPrice(bundle.priceInPaise)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

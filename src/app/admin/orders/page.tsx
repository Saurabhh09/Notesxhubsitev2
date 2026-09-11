import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Orders' }

export default async function AdminOrdersPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  })

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/bundles', label: 'Bundles' },
    { href: '/admin/orders', label: 'Orders', active: true },
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

        <h1 className="section-heading mb-8">Orders ({orders.length})</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Products</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Amount</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-paper-100 hover:bg-paper-50">
                  <td className="py-3 px-4 font-medium text-ink-700">{order.reference}</td>
                  <td className="py-3 px-4">
                    <p className="text-graphite-700">{order.user.name}</p>
                    <p className="text-xs text-graphite-400">{order.user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-graphite-600 max-w-xs truncate">
                    {order.items.map((i) => i.titleSnapshot).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-ink-700">
                    {formatPrice(order.amountInPaise)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`badge ${
                      order.status === 'PAID' ? 'bg-green-50 text-green-700'
                      : order.status === 'FAILED' ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-graphite-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

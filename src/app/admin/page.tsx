import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/login')

  const [totalProducts, totalOrders, totalCustomers, totalRevenue, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { amountInPaise: true } }),
      prisma.order.findMany({
        where: { status: 'PAID' },
        orderBy: { paidAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
    ])

  const revenue = totalRevenue._sum.amountInPaise || 0

  const navItems = [
    { href: '/admin', label: 'Dashboard', active: true },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/bundles', label: 'Bundles' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/customers', label: 'Customers' },
  ]

  return (
    <div className="py-10 lg:py-16">
      <div className="container-page">
        {/* Admin nav */}
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

        <h1 className="section-heading mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Revenue', value: formatPrice(revenue), color: 'text-green-700' },
            { label: 'Total Orders', value: totalOrders.toString(), color: 'text-ink-700' },
            { label: 'Total Products', value: totalProducts.toString(), color: 'text-ink-700' },
            { label: 'Total Customers', value: totalCustomers.toString(), color: 'text-ink-700' },
          ].map((s) => (
            <div key={s.label} className="card p-6 !hover:translate-y-0">
              <p className="text-xs text-graphite-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <h2 className="text-lg font-semibold text-ink-700 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Products</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Amount</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-paper-100 hover:bg-paper-50">
                  <td className="py-3 px-4 font-medium text-ink-700">{order.reference}</td>
                  <td className="py-3 px-4">
                    <p className="text-graphite-700">{order.user.name}</p>
                    <p className="text-xs text-graphite-400">{order.user.email}</p>
                  </td>
                  <td className="py-3 px-4 text-graphite-600">
                    {order.items.map((i) => i.titleSnapshot).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-ink-700">
                    {formatPrice(order.amountInPaise)}
                  </td>
                  <td className="py-3 px-4 text-right text-graphite-400">
                    {order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-IN') : '—'}
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

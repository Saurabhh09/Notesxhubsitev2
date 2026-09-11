import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Customers' }

export default async function AdminCustomersPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/login')

  const customers = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true, entitlements: true } },
    },
  })

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/bundles', label: 'Bundles' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/customers', label: 'Customers', active: true },
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

        <h1 className="section-heading mb-8">Customers ({customers.length})</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Email</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Products</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-graphite-400 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-paper-100 hover:bg-paper-50">
                  <td className="py-3 px-4 font-medium text-ink-700">{c.name}</td>
                  <td className="py-3 px-4 text-graphite-600">{c.email}</td>
                  <td className="py-3 px-4 text-right text-graphite-600">{c._count.orders}</td>
                  <td className="py-3 px-4 text-right text-graphite-600">{c._count.entitlements}</td>
                  <td className="py-3 px-4 text-right text-graphite-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
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

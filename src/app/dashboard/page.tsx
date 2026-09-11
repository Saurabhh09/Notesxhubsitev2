import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import { LogoutButton } from './LogoutButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [entitlementCount, orderCount, recentOrders] = await Promise.all([
    prisma.entitlement.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id, status: 'PAID' } }),
    prisma.order.findMany({
      where: { userId: user.id, status: 'PAID' },
      orderBy: { paidAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ])

  return (
    <div className="py-10 lg:py-16">
      <div className="container-page max-w-4xl">
        {/* Profile header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="section-heading">Hi, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-sm text-graphite-500 mt-1">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="card p-6 !hover:translate-y-0">
            <p className="text-sm text-graphite-400 mb-1">Products Owned</p>
            <p className="text-3xl font-bold text-ink-700">{entitlementCount}</p>
          </div>
          <div className="card p-6 !hover:translate-y-0">
            <p className="text-sm text-graphite-400 mb-1">Orders</p>
            <p className="text-3xl font-bold text-ink-700">{orderCount}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link href="/library" className="card p-5 !hover:translate-y-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-ink-50 flex items-center justify-center group-hover:bg-ink-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-600">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink-700">My Library</span>
          </Link>
          <Link href="/orders" className="card p-5 !hover:translate-y-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-ink-50 flex items-center justify-center group-hover:bg-ink-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-600">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink-700">My Orders</span>
          </Link>
          <Link href="/notes" className="card p-5 !hover:translate-y-0 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-ink-50 flex items-center justify-center group-hover:bg-ink-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-600">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink-700">Browse Notes</span>
          </Link>
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-ink-700 mb-4">Recent Purchases</h2>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="card p-4 !hover:translate-y-0 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-700">{order.reference}</p>
                    <p className="text-xs text-graphite-400 mt-0.5">
                      {order.items.map((i) => i.titleSnapshot).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink-700">{formatPrice(order.amountInPaise)}</p>
                    <p className="text-xs text-graphite-400">
                      {order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-IN') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

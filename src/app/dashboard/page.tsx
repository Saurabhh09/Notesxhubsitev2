import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import { LogoutButton } from './LogoutButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Dashboard | NotesXhub',
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
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page max-w-4xl">
        {/* Profile header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 flex-wrap gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFE959] text-ink-900 border border-[#F2DE44] mb-2">
              👋 Active Student
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">
              Welcome, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Quick stats with pastel cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-3xl bg-[#FFF4D3] border border-[#FFE7A5] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-900">Notes Owned</p>
              <span className="text-xl">📚</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-ink-900">{entitlementCount}</p>
            <Link href="/library" className="inline-block text-xs font-bold text-amber-800 mt-2 hover:underline">
              View in Library →
            </Link>
          </div>
          <div className="rounded-3xl bg-[#E3F0FF] border border-[#CCE3FE] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-sky-900">Completed Orders</p>
              <span className="text-xl">🧾</span>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-ink-900">{orderCount}</p>
            <Link href="/orders" className="inline-block text-xs font-bold text-sky-800 mt-2 hover:underline">
              Order Receipts →
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            href="/library"
            className="group rounded-2xl bg-white border border-[#E9DFCB] p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
              📖
            </div>
            <div>
              <p className="text-xs font-extrabold text-ink-900">My Library</p>
              <p className="text-[11px] text-slate-500">Download purchased notes</p>
            </div>
          </Link>
          <Link
            href="/orders"
            className="group rounded-2xl bg-white border border-[#E9DFCB] p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
              🏷️
            </div>
            <div>
              <p className="text-xs font-extrabold text-ink-900">My Orders</p>
              <p className="text-[11px] text-slate-500">Transaction history</p>
            </div>
          </Link>
          <Link
            href="/notes"
            className="group rounded-2xl bg-white border border-[#E9DFCB] p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
              🔍
            </div>
            <div>
              <p className="text-xs font-extrabold text-ink-900">Browse Notes</p>
              <p className="text-[11px] text-slate-500">Find new study resources</p>
            </div>
          </Link>
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white border border-[#E9DFCB] p-4 shadow-xs flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <span className="text-xs font-extrabold text-ink-900">{order.reference}</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.items.map((i) => i.titleSnapshot).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-ink-900">{formatPrice(order.amountInPaise)}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">
                      Paid • {order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-IN') : ''}
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

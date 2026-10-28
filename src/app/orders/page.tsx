import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order History | NotesXhub',
}

export default async function OrdersPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-sky-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-ink-900 font-bold">Orders</span>
        </div>

        <div className="mb-8 pb-4 border-b border-slate-200">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-2">
            🧾 Receipt Records
          </span>
          <h1 className="section-heading">My Purchase History</h1>
          <p className="section-subheading">Track all your completed orders and receipts.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#E9DFCB] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-3xl mx-auto mb-4">
              🧾
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-2">No orders recorded</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">Your purchase receipts and invoices will appear here.</p>
            <Link href="/notes" className="btn-primary !text-xs !py-3 !px-6">
              Browse Notes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl bg-white border border-[#E9DFCB] p-5 sm:p-6 shadow-xs">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-ink-900">{order.reference}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-ink-900">{formatPrice(order.amountInPaise)}</p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                        order.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : order.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.status === 'PAID' ? '✓ Successful' : order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Items Purchased</p>
                  <ul className="space-y-1.5">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between">
                        <span>• {item.titleSnapshot}</span>
                        <span className="font-extrabold text-ink-900">{formatPrice(item.priceInPaise)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

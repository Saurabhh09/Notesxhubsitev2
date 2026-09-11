import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders',
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
    <div className="py-10 lg:py-16">
      <div className="container-page max-w-4xl">
        <h1 className="section-heading mb-2">My Orders</h1>
        <p className="section-subheading mb-10">Your complete purchase history.</p>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-ink-700 mb-2">No orders yet</h3>
            <p className="text-sm text-graphite-500">Your purchases will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-5 !hover:translate-y-0">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-700">{order.reference}</p>
                    <p className="text-xs text-graphite-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-ink-700">{formatPrice(order.amountInPaise)}</p>
                    <span
                      className={`badge mt-1 ${
                        order.status === 'PAID'
                          ? 'bg-green-50 text-green-700'
                          : order.status === 'FAILED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-paper-200">
                  <p className="text-xs text-graphite-400 mb-1">Products</p>
                  <ul className="space-y-1">
                    {order.items.map((item) => (
                      <li key={item.id} className="text-sm text-graphite-600">
                        {item.titleSnapshot} — {formatPrice(item.priceInPaise)}
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

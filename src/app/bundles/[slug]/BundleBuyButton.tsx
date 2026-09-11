'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/constants'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Props {
  bundleId: string
  bundleName: string
  priceInPaise: number
  isLoggedIn: boolean
}

export function BundleBuyButton({ bundleId, bundleName, priceInPaise, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundleId }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      if (orderData.keyId && orderData.razorpayOrderId) {
        if (!window.Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve()
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'NotesXhub',
          description: bundleName,
          order_id: orderData.razorpayOrderId,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            })
            if (verifyRes.ok) {
              router.push('/library?purchased=true')
            } else {
              alert('Payment verification failed')
            }
          },
          theme: { color: '#17457A' },
          modal: { ondismiss: () => setLoading(false) },
        })
        rzp.open()
      } else {
        // Demo mode
        const verifyRes = await fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: '',
            razorpay_payment_id: `demo_${Date.now()}`,
            razorpay_signature: '',
            orderId: orderData.orderId,
          }),
        })
        if (verifyRes.ok) router.push('/library?purchased=true')
        else alert('Purchase failed')
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleBuy} disabled={loading} className="btn-primary !py-3.5 !px-8 !text-base">
      {loading ? 'Processing…' : `Buy Bundle — ${formatPrice(priceInPaise)}`}
    </button>
  )
}

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
  productId: string
  productName: string
  priceInPaise: number
  hasAccess: boolean
  isLoggedIn: boolean
  compact?: boolean
}

export function BuyButton({
  productId,
  productName,
  priceInPaise,
  hasAccess,
  isLoggedIn,
  compact,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const router = useRouter()

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch('/api/download/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Trigger download
      const link = document.createElement('a')
      link.href = `/api/download/${data.token}`
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err: any) {
      alert(err.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        if (orderData.error === 'You already own this product') {
          window.location.reload()
          return
        }
        throw new Error(orderData.error)
      }

      // Step 2: If Razorpay keys configured, open checkout
      if (orderData.keyId && orderData.razorpayOrderId) {
        // Load Razorpay script if needed
        if (!window.Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve()
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'NotesXhub',
          description: productName,
          order_id: orderData.razorpayOrderId,
          handler: async function (response: any) {
            // Step 3: Verify payment
            try {
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
              const verifyData = await verifyRes.json()
              if (verifyRes.ok) {
                router.push('/library?purchased=true')
              } else {
                alert(verifyData.error || 'Payment verification failed')
              }
            } catch {
              alert('Payment verification failed. Please check your orders.')
              router.push('/orders')
            }
          },
          prefill: {},
          theme: { color: '#17457A' },
          modal: {
            ondismiss: () => setLoading(false),
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Demo mode (no Razorpay keys): directly verify
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
        if (verifyRes.ok) {
          router.push('/library?purchased=true')
        } else {
          alert('Purchase failed')
        }
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (hasAccess) {
    return (
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={compact ? 'btn-accent !py-2.5 !px-6 !text-sm' : 'btn-accent w-full !py-3.5 !text-base'}
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Downloading…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={compact ? 'btn-primary !py-2.5 !px-6 !text-sm' : 'btn-primary w-full !py-3.5 !text-base'}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing…
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
          </svg>
          Buy Now — {formatPrice(priceInPaise)}
        </span>
      )}
    </button>
  )
}

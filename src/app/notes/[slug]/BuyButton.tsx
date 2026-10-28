'use client'

import { useState } from 'react'
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/constants'

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
  compact,
}: Props) {
  const [downloading, setDownloading] = useState(false)

  // Format phone number for WhatsApp wa.me link (standard 10-digit Indian numbers need country code 91)
  const rawDigits = (WHATSAPP_NUMBER || '9711483875').replace(/\D/g, '')
  const phone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits

  // Construct in-draft message with product basic details
  const draftMessage = `Hello NotesXhub! 👋

I would like to purchase these handwritten notes:
📚 *Product:* ${productName}
💰 *Price:* ${formatPrice(priceInPaise)}

Please share the UPI QR / payment details so I can complete the purchase and get instant PDF access. Thank you!`

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(draftMessage)}`

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

  if (hasAccess) {
    return (
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={
          compact
            ? 'btn-primary !py-2.5 !px-5 !text-xs font-bold'
            : 'btn-primary w-full !py-3.5 !text-base font-bold shadow-md'
        }
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
          <span className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </span>
        )}
      </button>
    )
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={
        compact
          ? 'btn-primary !py-2.5 !px-5 !text-xs font-bold !bg-[#25D366] hover:!bg-[#20bd5a] text-white shadow-sm flex items-center gap-2'
          : 'btn-primary w-full !py-3.5 !text-base font-extrabold !bg-[#25D366] hover:!bg-[#20bd5a] text-white shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01]'
      }
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span>Buy via WhatsApp — {formatPrice(priceInPaise)}</span>
    </a>
  )
}

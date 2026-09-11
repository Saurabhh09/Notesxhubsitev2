import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, discountPercent } from '@/lib/constants'

export interface ProductCardProps {
  slug: string
  name: string
  coverUrl: string | null
  category?: string
  subject?: string
  priceInPaise: number
  compareAtPaise?: number | null
}

export function ProductCard({
  slug,
  name,
  coverUrl,
  category,
  subject,
  priceInPaise,
  compareAtPaise,
}: ProductCardProps) {
  const discount = compareAtPaise ? discountPercent(compareAtPaise, priceInPaise) : 0

  return (
    <Link href={`/notes/${slug}`} className="card group block overflow-hidden">
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-paper-100 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-graphite-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 badge-discount">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {(category || subject) && (
          <div className="flex items-center gap-2 mb-2">
            {category && <span className="badge-category">{category}</span>}
            {subject && (
              <span className="text-xs text-graphite-400">{subject}</span>
            )}
          </div>
        )}

        <h3 className="font-semibold text-sm text-ink-800 leading-snug line-clamp-2 group-hover:text-ink-600 transition-colors">
          {name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-bold text-lg text-ink-700">
            {formatPrice(priceInPaise)}
          </span>
          {compareAtPaise && compareAtPaise > priceInPaise && (
            <span className="text-sm text-graphite-400 line-through">
              {formatPrice(compareAtPaise)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Site-wide constants derived from .env and brand spec.

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'NotesXhub'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9711483875'
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'notesxhub09@gmail.com'

export const CATEGORIES = [
  { name: 'Class 10', slug: 'class-10' },
  { name: 'Class 11', slug: 'class-11' },
  { name: 'Class 12', slug: 'class-12' },
  { name: 'JEE Main', slug: 'jee-main' },
  { name: 'JEE Advanced', slug: 'jee-advanced' },
] as const

export const CURRENCY = 'INR'
export const CURRENCY_SYMBOL = '₹'

/** Format paise → ₹X,XXX */
export function formatPrice(paise: number): string {
  return `${CURRENCY_SYMBOL}${(paise / 100).toLocaleString('en-IN')}`
}

/** Compute discount percentage */
export function discountPercent(original: number, sale: number): number {
  if (!original || original <= sale) return 0
  return Math.round(((original - sale) / original) * 100)
}

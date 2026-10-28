import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ScrollReveal } from '@/components/ScrollReveal'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const handwriting = Caveat({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NotesXhub — Your next study breakthrough starts here',
    template: '%s | NotesXhub',
  },
  description:
    'Discover and buy high-quality handwritten notes, or find exam-focused summaries for Class 10, 11, 12, JEE Main & Advanced.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    siteName: 'NotesXhub',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/brand/og-default.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${handwriting.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-cream-100 text-ink-800 antialiased selection:bg-sky-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollReveal />
      </body>
    </html>
  )
}

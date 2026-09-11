import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ScrollReveal } from '@/components/ScrollReveal'

export const metadata: Metadata = {
  title: {
    default: 'NotesXhub — Premium Handwritten Notes for Board & JEE',
    template: '%s | NotesXhub',
  },
  description:
    'High-quality handwritten notes for Class 10, 11, 12, JEE Main & JEE Advanced. Preview before you buy, instant PDF download after purchase.',
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
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollReveal />
      </body>
    </html>
  )
}

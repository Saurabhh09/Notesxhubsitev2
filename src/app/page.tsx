import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { CATEGORIES, formatPrice } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: 'PUBLISHED', featured: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      subject: true,
      categories: { include: { category: true } },
      files: { where: { type: 'COVER' }, select: { storageKey: true } },
    },
  })
}

async function getActiveBundle() {
  return prisma.bundle.findFirst({
    where: { status: 'PUBLISHED' },
    include: {
      items: {
        include: {
          product: {
            include: {
              files: { where: { type: 'COVER' }, select: { storageKey: true } },
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
}

export default async function HomePage() {
  const [featured, bundle] = await Promise.all([
    getFeaturedProducts(),
    getActiveBundle(),
  ])

  const bundleTotalValue = bundle
    ? bundle.items.reduce((sum, i) => sum + i.product.priceInPaise, 0)
    : 0

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-800 via-ink-700 to-ink-900 text-white">
        <div className="absolute inset-0 bg-paper-grain opacity-[0.03]" />
        <div className="container-page relative py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium text-paper-100 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Class 10 · 11 · 12 · JEE Main · JEE Advanced
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Handwritten notes that
              <span className="block text-brass-300"> actually get you marks.</span>
            </h1>

            <p className="mt-6 text-lg text-paper-200 leading-relaxed max-w-xl">
              Premium study notes crafted for board exams and competitive entrances. 
              Preview before you buy, download instantly after purchase.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/notes" className="btn-accent !px-8 !py-3.5 !text-base">
                Browse Notes
              </Link>
              <Link
                href="#preview-showcase"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/90 rounded-lg
                           border border-white/20 hover:bg-white/10 transition-all duration-200"
              >
                See Preview
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" className="w-full">
            <path d="M0 56h1440V28C1280 4 1160 0 960 16 760 32 600 48 360 40S80 8 0 28v28z" fill="var(--color-paper-50, #FCFBF8)" />
          </svg>
        </div>
      </section>

      {/* ── Explore by Category ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="container-page">
          <div className="text-center animate-on-scroll">
            <h2 className="section-heading">Explore by Category</h2>
            <p className="section-subheading mx-auto">
              Find the right notes for your class or exam preparation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`animate-on-scroll stagger-${i + 1} group relative overflow-hidden rounded-xl border border-paper-200 bg-white p-6 text-center
                           shadow-card transition-all duration-300 hover:shadow-lift hover:-translate-y-1 hover:border-ink-200`}
              >
                <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-ink-50 flex items-center justify-center
                               group-hover:bg-ink-100 transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-600">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-ink-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 lg:py-24 bg-paper-100/50">
          <div className="container-page">
            <div className="flex items-end justify-between mb-10 animate-on-scroll">
              <div>
                <h2 className="section-heading">Featured Notes</h2>
                <p className="section-subheading">Handpicked for quality and relevance.</p>
              </div>
              <Link href="/notes" className="hidden sm:inline-flex btn-secondary !text-xs">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((p) => (
                <div key={p.id} className="animate-on-scroll">
                  <ProductCard
                    slug={p.slug}
                    name={p.name}
                    coverUrl={p.files[0]?.storageKey ?? null}
                    category={p.categories[0]?.category.name}
                    subject={p.subject?.name}
                    priceInPaise={p.priceInPaise}
                    compareAtPaise={p.compareAtPaise}
                  />
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link href="/notes" className="btn-secondary !text-xs">
                View All Notes →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Bundle Offer ────────────────────────────────────────────────── */}
      {bundle && (
        <section className="py-16 lg:py-24">
          <div className="container-page">
            <div className="animate-on-scroll rounded-2xl border border-brass-300/30 bg-gradient-to-br from-paper-50 via-white to-paper-100 p-8 lg:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-price">Bundle Offer</span>
                <span className="badge-discount">
                  Save {formatPrice(bundleTotalValue - bundle.priceInPaise)}
                </span>
              </div>

              <h2 className="font-display text-2xl lg:text-3xl font-bold text-ink-800">
                {bundle.name}
              </h2>
              <p className="mt-2 text-graphite-500 max-w-xl">{bundle.description}</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bundle.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 rounded-xl bg-white p-4 border border-paper-200">
                    <div className="w-16 h-20 rounded-lg bg-paper-100 overflow-hidden shrink-0">
                      {item.product.files[0]?.storageKey && (
                        <Image
                          src={item.product.files[0].storageKey}
                          alt={item.product.name}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-700 truncate">{item.product.name}</p>
                      <p className="text-xs text-graphite-400 mt-0.5">
                        {formatPrice(item.product.priceInPaise)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-graphite-400 line-through">
                    {formatPrice(bundleTotalValue)}
                  </p>
                  <p className="text-3xl font-bold text-ink-700">
                    {formatPrice(bundle.priceInPaise)}
                  </p>
                </div>
                <Link href={`/bundles/${bundle.slug}`} className="btn-accent !px-8 !py-3.5">
                  Get the Bundle →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Why These Notes ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-paper-100/50">
        <div className="container-page">
          <div className="text-center animate-on-scroll">
            <h2 className="section-heading">Why NotesXhub Notes?</h2>
            <p className="section-subheading mx-auto">
              More than just PDFs — these are study tools designed to help you score.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '✍️',
                title: 'Handwritten for Clarity',
                desc: 'Written by hand with care — diagrams, formulas, and explanations are easy to follow.',
              },
              {
                icon: '🎯',
                title: 'Exam-Focused Content',
                desc: 'Covers important topics, previous year questions, and high-scoring concepts.',
              },
              {
                icon: '⚡',
                title: 'Instant PDF Download',
                desc: 'Pay once, download immediately. Access your notes anytime, on any device.',
              },
              {
                icon: '👀',
                title: 'Preview Before Buying',
                desc: 'Check the first 2 pages free before purchasing — no surprises.',
              },
              {
                icon: '📱',
                title: 'Study Anywhere',
                desc: 'PDF format works on phones, tablets, and laptops — study on the go.',
              },
              {
                icon: '💰',
                title: 'Affordable Pricing',
                desc: 'Quality notes at student-friendly prices. Bundle deals for extra savings.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`animate-on-scroll stagger-${i + 1} rounded-xl bg-white p-6 border border-paper-200 shadow-card`}
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-ink-700 mb-2">{item.title}</h3>
                <p className="text-sm text-graphite-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="container-page max-w-3xl">
          <div className="text-center animate-on-scroll mb-12">
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What format are the notes in?',
                a: 'All notes are delivered as high-quality PDF files that you can view on any device.',
              },
              {
                q: 'Can I preview before buying?',
                a: 'Yes! Every product has a free 2-page preview so you can check the quality before purchasing.',
              },
              {
                q: 'How do I download after payment?',
                a: 'After successful payment via Razorpay, the notes appear in your Library instantly. You can download the PDF from there.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'We support UPI, credit/debit cards, net banking, and wallets through Razorpay\'s secure checkout.',
              },
              {
                q: 'What if my payment fails?',
                a: 'If a payment fails, no amount is deducted. You can try again. If money was debited, it will be auto-refunded within 5-7 business days.',
              },
              {
                q: 'How does the bundle work?',
                a: 'A bundle includes 3 selected notes at a discounted price. After purchase, all 3 notes become available in your Library.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="animate-on-scroll group rounded-xl border border-paper-200 bg-white"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-semibold text-ink-700 hover:text-ink-600">
                  {item.q}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="shrink-0 ml-4 text-graphite-400 transition-transform group-open:rotate-180"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm text-graphite-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-ink-800 text-white">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4 animate-on-scroll">
            Ready to boost your exam preparation?
          </h2>
          <p className="text-paper-200 mb-8 max-w-lg mx-auto animate-on-scroll">
            Join students who trust NotesXhub for quality handwritten notes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-on-scroll">
            <Link href="/notes" className="btn-accent !px-8 !py-3.5 !text-base">
              Browse Notes
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/90 rounded-lg border border-white/20 hover:bg-white/10 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

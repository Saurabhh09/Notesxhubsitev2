import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { CATEGORIES, formatPrice } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'
import { HeroDoodles, DevicePreview } from '@/components/HeroIllustrations'

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
    <div className="overflow-x-hidden">
      {/* ── Sky-Blue Hero Section ────────────────────────────────────────── */}
      <section className="relative bg-[#2598F5] pt-28 sm:pt-32 lg:pt-36 pb-24 sm:pb-36 lg:pb-44 text-white overflow-hidden">
        {/* Soft atmospheric cloud puffs in top background */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-25">
          <svg viewBox="0 0 1440 200" fill="none" className="w-full h-full object-cover">
            <path
              d="M0 80C120 40 280 90 400 50C520 10 680 80 800 40C920 0 1080 70 1200 40C1320 10 1400 60 1440 70V0H0V80Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Paper texture overlay */}
        <div className="absolute inset-0 bg-paper-grain opacity-10 pointer-events-none" />

        {/* Left & Right Interactive Notebook Doodles */}
        <HeroDoodles />

        {/* Hero Center Content */}
        <div className="container-page relative z-20 text-center max-w-4xl mx-auto pt-4 sm:pt-8">
          {/* Top Pill Tag: "✏️ Notes for a brighter you" */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE959] text-ink-900 text-xs sm:text-sm font-bold shadow-sm mb-6 border border-[#F2DE44] animate-fade-in">
            <span>✏️</span>
            <span className="tracking-wide">Notes for a brighter you</span>
            <span className="text-xs">✦</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Your next study
            <br />
            <span className="text-[#FFE959] relative inline-block drop-shadow-sm">
              breakthrough
            </span>{' '}
            starts here.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-white/95 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover and buy high-quality notes, or find exam-focused summaries
            to help you learn faster and score higher.
          </p>

          {/* Primary Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <form
              action="/notes"
              method="GET"
              className="relative flex items-center rounded-full bg-white p-1.5 sm:p-2 shadow-[0_12px_32px_rgba(16,27,61,0.22)] border border-white/60"
            >
              <div className="pl-4 sm:pl-5 text-slate-400 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="search"
                name="q"
                placeholder="Search for notes (e.g. Class 12 Physics, JEE, Biology...)"
                className="w-full px-3 py-2 text-xs sm:text-base text-ink-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="btn-primary !py-2.5 sm:!py-3 !px-6 sm:!px-8 !text-xs sm:!text-sm shrink-0 font-bold tracking-wide shadow-none"
              >
                Search
              </button>
            </form>
          </div>

          {/* Micro Trust Indicators Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-white/90">
            <span className="flex items-center gap-1.5">
              <span className="text-sunshine-300">✦</span> High-quality notes
            </span>
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> Verified creators
            </span>
            <span className="flex items-center gap-1.5">
              <span>👥</span> Trusted by students
            </span>
            <span className="flex items-center gap-1.5">
              <span>⚡</span> Learn faster
            </span>
          </div>
        </div>

        {/* Large Overlapping Device Preview */}
        <div className="relative pt-10 sm:pt-14">
          <DevicePreview />
        </div>

        {/* Billowing Cloud Bottom Cutout Transition */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 lg:h-28 text-[#FFFDF6]"
          >
            <path
              d="M0 120H1440V70C1360 40 1280 60 1200 40C1100 15 1000 50 900 30C800 10 700 45 600 25C500 5 400 40 300 20C200 0 100 35 0 65V120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ── Warm Cream Content Section ──────────────────────────────────── */}
      <div className="bg-[#FFFDF6] pt-20 sm:pt-28 pb-16 lg:pb-24">
        {/* ── 3 Pastel Category Panels ──────────────────────────────────── */}
        <section className="container-page mb-16 sm:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {/* Panel 1: Board Notes (Pastel Yellow) */}
            <Link
              href="/category/class-12"
              className="card-pastel-yellow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 border border-pastel-yellow-border flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                    📚
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border border-pastel-yellow-border flex items-center justify-center text-ink-900 group-hover:bg-ink-900 group-hover:text-white transition-colors shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 tracking-tight">
                  Board Notes
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                  Class 10, 11, 12 notes, chapter-wise summaries, handwritten diagrams, and important board formulas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-pastel-yellow-border/60 flex items-center text-xs font-bold text-amber-800">
                <span>Explore Class 10 • 11 • 12 Notes</span>
              </div>
            </Link>

            {/* Panel 2: Competitive Exams (Pastel Blue) */}
            <Link
              href="/category/jee-main"
              className="card-pastel-blue group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 border border-pastel-blue-border flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                    🎯
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border border-pastel-blue-border flex items-center justify-center text-ink-900 group-hover:bg-ink-900 group-hover:text-white transition-colors shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 tracking-tight">
                  Competitive Exams
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                  JEE Main, JEE Advanced, and entrance-focused notes, PYQs, quick formula sheets, and scoring strategies.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-pastel-blue-border/60 flex items-center text-xs font-bold text-sky-800">
                <span>Explore JEE Main & Advanced Notes</span>
              </div>
            </Link>

            {/* Panel 3: Quick Revision (Pastel Peach) */}
            <Link
              href="/notes?category=quick-revision"
              className="card-pastel-peach group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 border border-pastel-peach-border flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform">
                    📝
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/90 border border-pastel-peach-border flex items-center justify-center text-ink-900 group-hover:bg-ink-900 group-hover:text-white transition-colors shadow-xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink-900 tracking-tight">
                  Quick Revision
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                  One-page revision sheets, formula maps, competency-based questions, and last-minute exam recall material.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-pastel-peach-border/60 flex items-center text-xs font-bold text-rose-800">
                <span>Explore Fast Revision Material</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Featured / Popular Notes This Week ──────────────────────────── */}
        <section className="container-page mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE959] text-ink-900 text-xs font-bold mb-2">
                <span>★</span> Featured Notes
              </div>
              <h2 className="section-heading">Popular notes this week</h2>
              <p className="section-subheading">
                Handpicked by our community of learners for quality and exam impact.
              </p>
            </div>
            <Link
              href="/notes"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              <span>View all</span>
              <span>→</span>
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  coverUrl={p.files[0]?.storageKey ?? null}
                  category={p.categories[0]?.category.name}
                  subject={p.subject?.name}
                  priceInPaise={p.priceInPaise}
                  compareAtPaise={p.compareAtPaise}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-[#ECE6D8] p-12 text-center">
              <span className="text-4xl">📚</span>
              <p className="mt-3 font-bold text-ink-800">Notes currently being curated.</p>
              <Link href="/notes" className="btn-primary mt-4">
                Browse Marketplace
              </Link>
            </div>
          )}
        </section>

        {/* ── Active Bundle Highlight ────────────────────────────────────── */}
        {bundle && (
          <section className="container-page mb-20">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#FFF8E7] via-white to-[#F0F7FF] border border-[#E9DFCB] p-6 sm:p-10 lg:p-12 shadow-card overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-sunshine-200/40 pointer-events-none blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      ⚡ Special Bundle Offer
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Save {formatPrice(bundleTotalValue - bundle.priceInPaise)}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-900 tracking-tight">
                    {bundle.name}
                  </h2>
                  <p className="mt-3 text-slate-600 leading-relaxed font-medium">
                    {bundle.description}
                  </p>

                  {/* Included items */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {bundle.items.map((item) => (
                      <div
                        key={item.productId}
                        className="rounded-2xl bg-white/95 p-3.5 border border-slate-200/80 shadow-xs flex items-center gap-3"
                      >
                        <div className="w-12 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          {item.product.files[0]?.storageKey ? (
                            <Image
                              src={item.product.files[0].storageKey}
                              alt={item.product.name}
                              width={48}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                              📄
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {formatPrice(item.product.priceInPaise)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-md shrink-0 w-full lg:w-72 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Value
                  </p>
                  <p className="text-sm text-slate-400 line-through mt-0.5">
                    {formatPrice(bundleTotalValue)}
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-ink-900 mt-1">
                    {formatPrice(bundle.priceInPaise)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    Instant access to all 3 notes
                  </p>
                  <Link
                    href={`/bundles/${bundle.slug}`}
                    className="btn-primary w-full mt-5 !py-3 !text-sm font-bold"
                  >
                    Get This Bundle →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Category Browser Matrix ─────────────────────────────────────── */}
        <section className="container-page mb-20">
          <div className="text-center mb-10">
            <h2 className="section-heading">Browse Notes by Category</h2>
            <p className="section-subheading mx-auto">
              Find exactly what you need for your upcoming school exams and entrance tests.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => {
              const bgColors = [
                'bg-[#FFF4D3] border-[#FFE7A5]',
                'bg-[#E4F7EC] border-[#C5EED6]',
                'bg-[#F2ECFE] border-[#E2D6FC]',
                'bg-[#E3F0FF] border-[#CCE3FE]',
                'bg-[#FFEBE8] border-[#FFD7D0]',
              ]
              const icons = ['📖', '🔬', '🎓', '⚡', '🏆']
              const colorClass = bgColors[i % bgColors.length]

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group rounded-3xl border ${colorClass} p-5 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col items-center justify-center`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-110 transition-transform">
                    {icons[i % icons.length]}
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-ink-900">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-slate-600 mt-1 font-medium">
                    View Notes →
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Why NotesXhub Section (Playful Educational Highlights) ──────── */}
        <section className="container-page mb-20">
          <div className="rounded-3xl bg-white border border-[#E9DFCB] p-8 sm:p-12 shadow-card">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Created For Real Marks
              </span>
              <h2 className="section-heading mt-3">Why Students Choose NotesXhub</h2>
              <p className="section-subheading mx-auto">
                Clean, organized notes written with exam strategy in mind.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '✍️',
                  title: 'Handwritten Clarity',
                  desc: 'Crafted with neat handwriting, clear flowcharts, and color-coded key formulas for easy recall.',
                  bg: 'bg-[#FFF9EC]',
                },
                {
                  icon: '🎯',
                  title: 'Exam & PYQ Focused',
                  desc: 'Contains highlighted previous year questions and high-weightage topics directly aligned with syllabi.',
                  bg: 'bg-[#F0F9FF]',
                },
                {
                  icon: '⚡',
                  title: 'Instant PDF Download',
                  desc: 'Once purchased, your notes are immediately added to your Library for fast download on any device.',
                  bg: 'bg-[#F2FDF5]',
                },
                {
                  icon: '👁️',
                  title: 'Free 2-Page Previews',
                  desc: 'Every single resource lets you inspect the first 2 pages before buying so you know the exact quality.',
                  bg: 'bg-[#FFF0F5]',
                },
                {
                  icon: '📱',
                  title: 'Mobile & Tablet Ready',
                  desc: 'Optimized high-resolution PDF formatting that renders crisply on phones, iPads, and laptops.',
                  bg: 'bg-[#F6F3FF]',
                },
                {
                  icon: '🏷️',
                  title: 'Pocket-Friendly Pricing',
                  desc: 'Affordable pricing designed for students, with bundle discounts for whole semester preparation.',
                  bg: 'bg-[#FFFDF0]',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-6 border border-slate-100 ${item.bg} transition-all duration-300 hover:shadow-sm`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-xs mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-base text-ink-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ──────────────────────────────────────────────────── */}
        <section className="container-page max-w-3xl mb-20">
          <div className="text-center mb-10">
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="section-subheading mx-auto">
              Everything you need to know about buying and studying with NotesXhub.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: 'What format are the notes delivered in?',
                a: 'All notes are delivered as high-resolution PDF files that you can read, zoom into, and download on any smartphone, tablet, or PC.',
              },
              {
                q: 'Can I preview the handwriting before buying?',
                a: 'Yes! Every product has a free interactive 2-page preview viewer so you can verify handwriting clarity and content depth.',
              },
              {
                q: 'How quickly do I get access after payment?',
                a: 'Access is instantaneous. As soon as your Razorpay payment succeeds, the notes are unlocked in your My Library dashboard for immediate download.',
              },
              {
                q: 'Which payment methods are accepted?',
                a: 'We accept Google Pay, PhonePe, Paytm, UPI, Debit Cards, Credit Cards, and Net Banking via Razorpay secure checkout.',
              },
              {
                q: 'What is included in the Physics Essentials Bundle?',
                a: 'The bundle contains complete Class 12 and entrance notes for Electrostatics, Electric Charges & Fields, and Semiconductors at a significant discount.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-[#E9DFCB] bg-white p-5 transition-all shadow-xs open:shadow-md"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-sm sm:text-base text-ink-900 select-none">
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:bg-sky-500 group-open:text-white transition-colors shrink-0 ml-4">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="group-open:rotate-180 transition-transform"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Bottom Creative CTA Banner ─────────────────────────────────── */}
        <section className="container-page">
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#2191F4] via-[#2598F5] to-[#1A82DC] p-8 sm:p-14 text-white text-center shadow-[0_20px_50px_rgba(37,152,245,0.3)] overflow-hidden">
            {/* Background clouds in CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sunshine-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4 backdrop-blur-xs">
                Boost Your Marks Today
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready for your next study breakthrough?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                Get handwritten notes trusted by board toppers and entrance aspirants across India.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/notes"
                  className="btn-sunshine !py-3.5 !px-8 !text-sm font-extrabold shadow-md hover:shadow-lg"
                >
                  Browse All Notes
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur-xs border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/25 transition-all"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => {})
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/notes?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header
      className={`z-50 transition-all duration-300 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 ${
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      }`}
    >
      <div
        className={`mx-auto max-w-6xl rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-200/80'
            : 'bg-white shadow-[0_4px_24px_rgba(16,27,61,0.08)] border border-slate-100'
        }`}
      >
        {/* Real Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 pr-2 group">
          <Image
            src="/brand/logo-full.webp"
            alt="NotesXhub"
            width={200}
            height={60}
            priority
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-102"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/notes"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-ink-900 transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/category/class-12"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-ink-900 transition-colors"
          >
            Board Notes
          </Link>
          <Link
            href="/category/jee-main"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-ink-900 transition-colors"
          >
            Competitive Exams
          </Link>
          <Link
            href="/bundles/physics-essentials-bundle"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-ink-900 transition-colors"
          >
            Bundles
          </Link>
          <Link
            href="/notes?category=quick-revision"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 hover:text-ink-900 transition-colors"
          >
            Quick Revision
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Quick Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-full border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 bg-slate-50"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-ink-900 transition-colors"
                aria-label="Search notes"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/library"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-ink-900 transition-colors"
              >
                My Library
              </Link>
              <Link
                href="/dashboard"
                className="btn-dark !py-2 !px-4 !text-xs"
              >
                {user.name.split(' ')[0]}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-ink-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-dark !py-2 !px-5 !text-xs font-semibold shadow-sm hover:shadow"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu and search toggle */}
        <div className="flex lg:hidden items-center gap-1.5">
          <Link
            href="/notes"
            className="p-2 text-slate-600 hover:text-sky-600"
            aria-label="Search notes"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {open && (
        <div className="lg:hidden mx-auto max-w-6xl mt-2 rounded-3xl bg-white/98 backdrop-blur-md border border-slate-200/80 shadow-xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="search"
              placeholder="Search notes (Physics, Class 12, JEE...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </form>

          <nav className="flex flex-col space-y-1 font-medium text-slate-700 text-sm">
            <Link
              href="/notes"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Explore All Notes</span>
              <span className="text-xs text-sky-600 font-semibold">Browse →</span>
            </Link>
            <Link
              href="/category/class-12"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Board Notes (Class 10, 11, 12)
            </Link>
            <Link
              href="/category/jee-main"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Competitive Exams (JEE & NEET)
            </Link>
            <Link
              href="/bundles/physics-essentials-bundle"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Bundle Offers
            </Link>
            <Link
              href="/notes?category=quick-revision"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl hover:bg-slate-100"
            >
              Quick Revision & Formula Sheets
            </Link>
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/library"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 rounded-full font-semibold text-sm bg-slate-100 text-ink-800"
                >
                  My Library
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 rounded-full font-semibold text-sm btn-dark"
                >
                  Dashboard ({user.name.split(' ')[0]})
                </Link>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 rounded-full font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-2.5 rounded-full font-semibold text-sm btn-dark"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

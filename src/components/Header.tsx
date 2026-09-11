'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/lib/constants'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user ?? null))
      .catch(() => {})
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-paper-200'
          : 'bg-white border-b border-paper-100'
      }`}
    >
      <div className="container-page flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 py-1">
          <Image
            src="/brand/logo-full.webp"
            alt="NotesXhub - Your Hub for Handwritten Notes"
            width={260}
            height={80}
            priority
            className="h-9 sm:h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/notes"
            className="px-3 py-2 text-sm font-medium text-graphite-600 rounded-lg hover:bg-ink-50 hover:text-ink-700 transition-colors"
          >
            Browse Notes
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="px-3 py-2 text-sm font-medium text-graphite-500 rounded-lg hover:bg-ink-50 hover:text-ink-700 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm text-brass-600 font-medium hover:text-brass-500 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/library" className="text-sm text-graphite-600 font-medium hover:text-ink-700 transition-colors">
                My Library
              </Link>
              <Link href="/dashboard" className="btn-secondary !py-2 !px-4 !text-xs">
                {user.name.split(' ')[0]}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-graphite-600 font-medium hover:text-ink-700 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !px-4 !text-xs">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg text-graphite-600 hover:bg-ink-50 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden border-t border-paper-200 bg-white animate-fade-in">
          <nav className="container-page py-4 flex flex-col gap-1">
            <Link
              href="/notes"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-graphite-700 rounded-lg hover:bg-ink-50 transition-colors"
            >
              Browse Notes
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-graphite-600 rounded-lg hover:bg-ink-50 transition-colors"
              >
                {c.name}
              </Link>
            ))}

            <hr className="my-2 border-paper-200" />

            {user ? (
              <>
                <Link href="/library" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-graphite-700 rounded-lg hover:bg-ink-50 transition-colors">
                  My Library
                </Link>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-graphite-700 rounded-lg hover:bg-ink-50 transition-colors">
                  Dashboard
                </Link>
                <Link href="/orders" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-graphite-700 rounded-lg hover:bg-ink-50 transition-colors">
                  My Orders
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-brass-600 rounded-lg hover:bg-brass-300/10 transition-colors">
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <div className="flex gap-3 mt-2 px-3">
                <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1 !text-xs">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1 !text-xs">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

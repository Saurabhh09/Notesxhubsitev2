import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES, SUPPORT_EMAIL } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-ink-900 text-paper-200 mt-auto">
      <div className="container-page py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/brand/logo-full.webp"
                alt="NotesXhub"
                width={200}
                height={60}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-paper-300 leading-relaxed max-w-xs">
              Your hub for premium handwritten notes. Quality study material for board exams and competitive entrances.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm text-paper-300 hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/notes" className="text-sm text-paper-300 hover:text-white transition-colors">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-sm text-paper-300 hover:text-white transition-colors">
                  My Library
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-paper-300 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-paper-300 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-paper-400 mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-paper-300 hover:text-white transition-colors"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/9711483875"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-paper-300 hover:text-white transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper-400">
            © {new Date().getFullYear()} NotesXhub. All rights reserved.
          </p>
          <p className="text-xs text-paper-400">
            Handwritten notes that actually get you marks.
          </p>
        </div>
      </div>
    </footer>
  )
}

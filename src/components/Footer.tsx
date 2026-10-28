import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES, SUPPORT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-[#101B3D] text-slate-300 border-t border-slate-800">
      <div className="container-page py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo-full.webp"
                alt="NotesXhub"
                width={190}
                height={55}
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
              Your destination for high-scoring handwritten study notes. Crafted for Class 10, 11, 12 CBSE boards and JEE Main entrance exams.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant PDF Delivery Guaranteed</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Categories
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>›</span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/notes?category=quick-revision"
                  className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>Quick Revision Notes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Student Hub
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/notes" className="text-slate-400 hover:text-white transition-colors">
                  Browse All Notes
                </Link>
              </li>
              <li>
                <Link href="/bundles/physics-essentials-bundle" className="text-slate-400 hover:text-white transition-colors">
                  Physics Bundle Offer
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-slate-400 hover:text-white transition-colors">
                  My Library & Downloads
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-slate-400 hover:text-white transition-colors">
                  Track Past Orders
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Need Help?
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              Questions regarding downloads or payments? We are available daily to assist students.
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-semibold transition-colors w-full justify-center"
              >
                <span>💬</span>
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium transition-colors w-full justify-center"
              >
                <span>✉️</span>
                <span className="truncate">{SUPPORT_EMAIL}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} NotesXhub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Handmade with care for exam aspirants</span>
            <span>•</span>
            <span className="text-slate-400">100% Secure Razorpay Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

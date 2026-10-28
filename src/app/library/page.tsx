import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Student Library | NotesXhub',
}

export default async function LibraryPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const entitlements = await prisma.entitlement.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          subject: true,
          categories: { include: { category: true } },
          files: { where: { type: 'COVER' }, select: { storageKey: true } },
        },
      },
    },
    orderBy: { grantedAt: 'desc' },
  })

  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <div className="container-page">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 inline-block mb-2">
              🎓 Student Vault
            </span>
            <h1 className="section-heading">My Learning Library</h1>
            <p className="section-subheading">
              Your purchased handwritten study notes. Access and download anytime.
            </p>
          </div>
          <Link href="/notes" className="btn-secondary !text-xs self-start sm:self-auto font-bold">
            + Discover More Notes
          </Link>
        </div>

        {entitlements.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border border-[#E9DFCB] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-4">
              📚
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-2">Your library is empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
              You haven&apos;t unlocked any notes yet. Browse our verified handwritten notes for Class 10, 11, 12, or JEE Main!
            </p>
            <Link href="/notes" className="btn-primary !text-xs !py-3 !px-6">
              Browse Notes Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entitlements.map((ent) => (
              <div
                key={ent.id}
                className="group rounded-3xl bg-white border border-[#E9DFCB] shadow-card hover:shadow-lift transition-all p-4 flex gap-4 overflow-hidden"
              >
                {/* Cover thumbnail */}
                <div className="w-24 sm:w-28 aspect-[3/4] rounded-2xl overflow-hidden bg-cream-50 border border-slate-100 shrink-0">
                  {ent.product.files[0]?.storageKey ? (
                    <Image
                      src={ent.product.files[0].storageKey}
                      alt={ent.product.name}
                      width={112}
                      height={150}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      📄
                    </div>
                  )}
                </div>

                {/* Info & Download Button */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      {ent.product.categories[0] && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                          {ent.product.categories[0].category.name}
                        </span>
                      )}
                      {ent.product.subject && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {ent.product.subject.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-ink-900 line-clamp-2 leading-snug">
                      {ent.product.name}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <span>✓</span> Unlocked for you
                    </p>
                  </div>

                  <Link
                    href={`/notes/${ent.product.slug}`}
                    className="btn-primary !py-2 !px-4 !text-xs mt-3 self-start flex items-center gap-1.5 font-bold shadow-none"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    <span>Download PDF</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

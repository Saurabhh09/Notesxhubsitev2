import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Library',
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
    <div className="py-10 lg:py-16">
      <div className="container-page">
        <h1 className="section-heading mb-2">My Library</h1>
        <p className="section-subheading mb-10">
          All your purchased notes in one place. Download anytime.
        </p>

        {entitlements.length === 0 ? (
          <div className="text-center py-20">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-graphite-400 mb-4">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="text-lg font-semibold text-ink-700 mb-2">Your library is empty</h3>
            <p className="text-sm text-graphite-500 mb-6">Purchase notes to see them here.</p>
            <Link href="/notes" className="btn-primary">Browse Notes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {entitlements.map((ent) => (
              <div key={ent.id} className="card overflow-hidden flex flex-row">
                {/* Cover thumbnail */}
                <div className="w-24 sm:w-28 shrink-0 bg-paper-100">
                  {ent.product.files[0]?.storageKey ? (
                    <Image
                      src={ent.product.files[0].storageKey}
                      alt={ent.product.name}
                      width={112}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-graphite-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {ent.product.categories[0] && (
                        <span className="badge-category text-[10px]">
                          {ent.product.categories[0].category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-ink-700 truncate">{ent.product.name}</h3>
                    {ent.product.subject && (
                      <p className="text-xs text-graphite-400 mt-0.5">{ent.product.subject.name}</p>
                    )}
                  </div>
                  <Link
                    href={`/notes/${ent.product.slug}`}
                    className="btn-accent !py-2 !px-4 !text-xs mt-3 self-start"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download
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

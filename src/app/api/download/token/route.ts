import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createDownloadToken } from '@/lib/download'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
    }

    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check entitlement
    const entitlement = await prisma.entitlement.findUnique({
      where: { userId_productId: { userId: session.userId, productId } },
    })

    if (!entitlement) {
      return NextResponse.json({ error: 'You do not have access to this product' }, { status: 403 })
    }

    const token = await createDownloadToken(session.userId, productId)

    return NextResponse.json({ token })
  } catch (err) {
    console.error('[download-token]', err)
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
  }
}

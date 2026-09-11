import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { Readable } from 'node:stream'
import { prisma } from '@/lib/prisma'
import { verifyDownloadToken, resolveStoragePath } from '@/lib/download'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params
    const claims = await verifyDownloadToken(token)
    if (!claims) {
      return NextResponse.json({ error: 'Download link expired or invalid' }, { status: 403 })
    }

    // Find the full PDF file record
    const file = await prisma.productFile.findFirst({
      where: { productId: claims.productId, type: 'FULL_PDF' },
      include: { product: true },
    })

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const absPath = resolveStoragePath(file.storageKey)
    if (!existsSync(absPath)) {
      return NextResponse.json({ error: 'File missing from storage' }, { status: 404 })
    }

    // Record download
    await prisma.downloadRecord.create({
      data: {
        userId: claims.userId,
        productId: claims.productId,
        userAgent: req.headers.get('user-agent')?.slice(0, 200) || null,
      },
    })

    // Stream the file
    const stat = statSync(absPath)
    const stream = Readable.toWeb(createReadStream(absPath)) as ReadableStream

    const safeName = `${file.product.slug}.pdf`.replace(/[^a-zA-Z0-9._-]/g, '_')

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    })
  } catch (err) {
    console.error('[download]', err)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}

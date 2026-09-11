import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRazorpay } from '@/lib/razorpay'
import crypto from 'node:crypto'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Please sign in to purchase' }, { status: 401 })
    }

    const { productId, bundleId } = await req.json()

    if (!productId && !bundleId) {
      return NextResponse.json({ error: 'Product or bundle required' }, { status: 400 })
    }

    let amountInPaise: number
    let titleSnapshot: string
    let itemProductId: string | null = null
    let itemBundleId: string | null = null

    if (bundleId) {
      const bundle = await prisma.bundle.findUnique({
        where: { id: bundleId, status: 'PUBLISHED' },
        include: { items: { include: { product: true } } },
      })
      if (!bundle) {
        return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
      }
      amountInPaise = bundle.priceInPaise
      titleSnapshot = bundle.name
      itemBundleId = bundle.id
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId, status: 'PUBLISHED' },
      })
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      // Check if user already owns this product
      const existing = await prisma.entitlement.findUnique({
        where: { userId_productId: { userId: session.userId, productId: product.id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'You already own this product' }, { status: 409 })
      }

      amountInPaise = product.priceInPaise
      titleSnapshot = product.name
      itemProductId = product.id
    }

    // Create order reference
    const ref = `NXH-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`

    // Create Razorpay order
    const rzpKeyId = process.env.RAZORPAY_KEY_ID
    let razorpayOrderId: string | null = null

    if (rzpKeyId) {
      const rzp = getRazorpay()
      const rzpOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: ref,
        notes: { userId: session.userId },
      })
      razorpayOrderId = rzpOrder.id
    }

    // Create local order
    const order = await prisma.order.create({
      data: {
        reference: ref,
        userId: session.userId,
        amountInPaise,
        currency: 'INR',
        status: 'CREATED',
        razorpayOrderId,
        items: {
          create: {
            productId: itemProductId,
            bundleId: itemBundleId,
            titleSnapshot,
            priceInPaise: amountInPaise,
          },
        },
      },
    })

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      reference: ref,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[create-order]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

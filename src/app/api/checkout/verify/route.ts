import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { formatPrice } from '@/lib/constants'
import { sendOrderConfirmation, notifyOwnerNewOrder } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json()

    // If Razorpay keys are configured, verify cryptographic signature
    if (process.env.RAZORPAY_KEY_ID && razorpay_signature) {
      const valid = verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      if (!valid) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.userId },
      include: {
        items: {
          include: {
            product: true,
            bundle: { include: { items: { include: { product: true } } } },
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ ok: true, message: 'Already processed' })
    }

    // Record payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        razorpayPaymentId: razorpay_payment_id || `demo_${Date.now()}`,
        razorpayOrderId: razorpay_order_id || order.razorpayOrderId || '',
        razorpaySignature: razorpay_signature || null,
        amountInPaise: order.amountInPaise,
        status: 'CAPTURED',
        verifiedVia: razorpay_signature ? 'CHECKOUT_SIGNATURE' : 'DEMO',
      },
    })

    // Mark order as paid
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID', paidAt: new Date() },
    })

    // Grant entitlements
    const productIds: string[] = []

    for (const item of order.items) {
      if (item.bundleId && item.bundle) {
        // Bundle: grant entitlements for all products in bundle
        for (const bi of item.bundle.items) {
          productIds.push(bi.productId)
        }
      } else if (item.productId) {
        productIds.push(item.productId)
      }
    }

    for (const pid of productIds) {
      await prisma.entitlement.upsert({
        where: {
          userId_productId: { userId: session.userId, productId: pid },
        },
        create: {
          userId: session.userId,
          productId: pid,
          sourceOrderId: order.id,
        },
        update: {}, // Already entitled
      })
    }

    // Send emails (fire-and-forget)
    const productNames = order.items.map((i) => i.titleSnapshot)
    const amountStr = formatPrice(order.amountInPaise)

    sendOrderConfirmation(order.user.email, {
      customerName: order.user.name,
      orderId: order.reference,
      products: productNames,
      amount: amountStr,
    }).catch((e) => console.error('[email:customer]', e))

    notifyOwnerNewOrder({
      customerName: order.user.name,
      customerEmail: order.user.email,
      orderId: order.reference,
      products: productNames,
      amount: amountStr,
    }).catch((e) => console.error('[email:owner]', e))

    // Analytics event
    await prisma.analyticsEvent.create({
      data: {
        name: 'purchase_completed',
        userId: session.userId,
        meta: JSON.stringify({ orderId: order.id, amount: order.amountInPaise }),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[verify-payment]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const eventId = req.headers.get('x-razorpay-event-id') || event.event || `${Date.now()}`

    // Idempotency: skip if already processed
    const existing = await prisma.webhookEvent.findUnique({ where: { eventId } })
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Already processed' })
    }

    // Store the event
    await prisma.webhookEvent.create({
      data: {
        eventId,
        eventType: event.event,
        payload: rawBody,
      },
    })

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      if (payment) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: payment.order_id },
          include: {
            items: {
              include: {
                bundle: { include: { items: true } },
              },
            },
          },
        })

        if (order && order.status !== 'PAID') {
          // Record payment
          await prisma.payment.upsert({
            where: { razorpayPaymentId: payment.id },
            create: {
              orderId: order.id,
              razorpayPaymentId: payment.id,
              razorpayOrderId: payment.order_id,
              amountInPaise: payment.amount,
              status: 'CAPTURED',
              verifiedVia: 'WEBHOOK',
              rawEvent: rawBody,
            },
            update: { status: 'CAPTURED', verifiedVia: 'WEBHOOK' },
          })

          // Mark order paid
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'PAID', paidAt: new Date() },
          })

          // Grant entitlements
          for (const item of order.items) {
            if (item.bundleId && item.bundle) {
              for (const bi of item.bundle.items) {
                await prisma.entitlement.upsert({
                  where: {
                    userId_productId: { userId: order.userId, productId: bi.productId },
                  },
                  create: {
                    userId: order.userId,
                    productId: bi.productId,
                    sourceOrderId: order.id,
                  },
                  update: {},
                })
              }
            } else if (item.productId) {
              await prisma.entitlement.upsert({
                where: {
                  userId_productId: { userId: order.userId, productId: item.productId },
                },
                create: {
                  userId: order.userId,
                  productId: item.productId,
                  sourceOrderId: order.id,
                },
                update: {},
              })
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

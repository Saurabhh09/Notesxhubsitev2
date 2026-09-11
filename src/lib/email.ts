import nodemailer from 'nodemailer'

let _transport: nodemailer.Transporter | null = null

function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return _transport
}

const from = process.env.MAIL_FROM || 'NotesXhub <notesxhub09@gmail.com>'
const ownerEmail = process.env.OWNER_EMAIL || 'notesxhub09@gmail.com'

/** Send order confirmation to customer. */
export async function sendOrderConfirmation(to: string, data: {
  customerName: string
  orderId: string
  products: string[]
  amount: string
}) {
  if (!process.env.SMTP_PASS) {
    console.warn('[email] SMTP_PASS not set — skipping order confirmation')
    return
  }
  await getTransport().sendMail({
    from,
    to,
    subject: `🎉 Your NotesXhub order is confirmed — ${data.orderId}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #17457A;">Thanks for your purchase, ${data.customerName}!</h2>
        <p>Your order <strong>${data.orderId}</strong> has been confirmed.</p>
        <h3 style="color: #58595B;">Products</h3>
        <ul>${data.products.map((p) => `<li>${p}</li>`).join('')}</ul>
        <p><strong>Total paid: ${data.amount}</strong></p>
        <p>You can download your notes anytime from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/library" style="color: #17457A;">Library</a>.</p>
        <hr style="border: none; border-top: 1px solid #EDE8DE; margin: 24px 0;" />
        <p style="font-size: 13px; color: #8A8B8E;">NotesXhub — Your Hub for Handwritten Notes</p>
      </div>
    `,
  })
}

/** Notify owner about a new order. */
export async function notifyOwnerNewOrder(data: {
  customerName: string
  customerEmail: string
  orderId: string
  products: string[]
  amount: string
}) {
  if (!process.env.SMTP_PASS) {
    console.warn('[email] SMTP_PASS not set — skipping owner notification')
    return
  }
  await getTransport().sendMail({
    from,
    to: ownerEmail,
    subject: `💰 New order ${data.orderId} — ${data.amount}`,
    html: `
      <div style="font-family: system-ui, sans-serif;">
        <h2>New Order Received</h2>
        <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
        <p><strong>Order:</strong> ${data.orderId}</p>
        <p><strong>Amount:</strong> ${data.amount}</p>
        <h3>Products</h3>
        <ul>${data.products.map((p) => `<li>${p}</li>`).join('')}</ul>
      </div>
    `,
  })
}

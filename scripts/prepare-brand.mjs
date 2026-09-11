// Derives clean transparent web-ready brand assets from the supplied NotesXhub logo
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'

const SRC = process.env.LOGO_SRC || 'C:/Users/saura/OneDrive/Documents/NotesXhub/NotesXhub Logo.png'
const OUT = path.resolve('public/brand')
const PAPER = '#F6F5F2'
const NAVY = '#17457A'
const GRAPHITE = '#58595B'

const pickFont = (candidates, fallback) => {
  const families = new Set(GlobalFonts.families.map((f) => f.family))
  return candidates.find((c) => families.has(c)) || fallback
}

function trim(ctx, w, h, region = [0, 0, 1, 1], inkBelow = 220) {
  const [rx, ry, rw, rh] = [
    Math.floor(region[0] * w),
    Math.floor(region[1] * h),
    Math.ceil(region[2] * w),
    Math.ceil(region[3] * h),
  ]
  const { data } = ctx.getImageData(rx, ry, rw, rh)
  let minX = rw, minY = rh, maxX = 0, maxY = 0, found = false
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      const i = (y * rw + x) * 4
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (data[i + 3] > 8 && lum < inkBelow) {
        found = true
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (!found) return { x: rx, y: ry, w: rw, h: rh }
  return { x: rx + minX, y: ry + minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

/**
 * Crops a box and makes the off-white/paper background completely transparent
 * with smooth alpha edge feathering for crystal clear rendering on white / colored headers.
 */
function cropTransparent(img, box, pad = 12, bgLumThreshold = 242) {
  const canvas = createCanvas(box.w + pad * 2, box.h + pad * 2)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, box.x, box.y, box.w, box.h, pad, pad, box.w, box.h)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imgData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = (r + g + b) / 3

    if (lum >= bgLumThreshold) {
      // Pure transparent for background paper
      data[i + 3] = 0
    } else if (lum > bgLumThreshold - 40) {
      // Smooth alpha ramp at edges
      const factor = (bgLumThreshold - lum) / 40
      data[i + 3] = Math.round(data[i + 3] * factor)
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas
}

async function emit(canvas, base) {
  await writeFile(path.join(OUT, `${base}.png`), await canvas.encode('png'))
  await writeFile(path.join(OUT, `${base}.webp`), await canvas.encode('webp', 95))
}

const img = await loadImage(SRC)
await mkdir(OUT, { recursive: true })

const probe = createCanvas(img.width, img.height)
const pctx = probe.getContext('2d')
pctx.drawImage(img, 0, 0)

const fullBox = trim(pctx, img.width, img.height)
console.log('Full box:', fullBox)
await emit(cropTransparent(img, fullBox, 16), 'logo-full')

const markBox = trim(pctx, img.width, img.height, [0, 0, 1, 0.45])
console.log('Mark box:', markBox)
await emit(cropTransparent(img, markBox, 12), 'logo-mark')

// App icons (square with paper background)
for (const [size, file] of [[512, '../icon.png'], [180, '../apple-icon.png']]) {
  const c = createCanvas(size, size)
  const x = c.getContext('2d')
  x.fillStyle = PAPER
  x.fillRect(0, 0, size, size)
  const scale = (size * 0.76) / Math.max(markBox.w, markBox.h)
  const dw = markBox.w * scale
  const dh = markBox.h * scale
  x.drawImage(img, markBox.x, markBox.y, markBox.w, markBox.h, (size - dw) / 2, (size - dh) / 2, dw, dh)
  await writeFile(path.join(OUT, file), await c.encode('png'))
}

// Social card
const serif = pickFont(['Georgia', 'Times New Roman', 'DejaVu Serif'], 'serif')
const sans = pickFont(['Segoe UI', 'Arial', 'DejaVu Sans'], 'sans-serif')
const og = createCanvas(1200, 630)
const o = og.getContext('2d')
o.fillStyle = PAPER
o.fillRect(0, 0, 1200, 630)
o.fillStyle = NAVY
o.fillRect(0, 0, 1200, 8)
const ms = 150 / markBox.h
o.drawImage(img, markBox.x, markBox.y, markBox.w, markBox.h, 90, 96, markBox.w * ms, 150)
o.fillStyle = NAVY
o.font = `600 74px "${serif}"`
o.fillText('Handwritten notes that', 90, 340)
o.fillText('actually get you marks.', 90, 424)
o.fillStyle = GRAPHITE
o.font = `400 30px "${sans}"`
o.fillText('Class 10 · 11 · 12 · JEE Main · JEE Advanced   —   notesxhub', 90, 500)
await writeFile(path.join(OUT, 'og-default.png'), await og.encode('png'))

console.log('✅ Brand assets regenerated with clean transparency!')

// PDF page → PNG rendering for covers and preview images.
// Pure-JS: pdfjs-dist (legacy build) + @napi-rs/canvas prebuilt binary.
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const canvasPkg = await import('@napi-rs/canvas')

// pdfjs' legacy build expects a handful of DOM globals.
for (const g of ['DOMMatrix', 'Path2D', 'ImageData', 'DOMPoint']) {
  if (!globalThis[g] && canvasPkg[g]) globalThis[g] = canvasPkg[g]
}

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const STANDARD_FONTS = path.join(
  path.dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts/',
)

class NodeCanvasFactory {
  create(width, height) {
    const canvas = canvasPkg.createCanvas(Math.ceil(width), Math.ceil(height))
    return { canvas, context: canvas.getContext('2d') }
  }
  reset(target, width, height) {
    target.canvas.width = Math.ceil(width)
    target.canvas.height = Math.ceil(height)
  }
  destroy(target) {
    target.canvas.width = 0
    target.canvas.height = 0
    target.canvas = null
    target.context = null
  }
}

export async function openPdf(filePath) {
  const data = new Uint8Array(await readFile(filePath))
  const doc = await pdfjs.getDocument({
    data,
    isEvalSupported: false,
    useSystemFonts: false,
    standardFontDataUrl: STANDARD_FONTS,
    canvasFactory: new NodeCanvasFactory(),
  }).promise
  return doc
}

/**
 * Render one page to a PNG/JPEG/WebP buffer.
 * `cropTopFraction` (0-1) keeps only the top slice of the page — used to build
 * a teaser preview for short documents without ever emitting the full page.
 */
export async function renderPage(doc, pageNumber, opts = {}) {
  const { targetWidth = 1200, format = 'webp', quality = 0.86, cropTopFraction = 1 } = opts
  const page = await doc.getPage(pageNumber)
  const base = page.getViewport({ scale: 1 })
  const scale = Math.min(targetWidth / base.width, 4)
  const viewport = page.getViewport({ scale })

  const fullH = Math.ceil(viewport.height)
  const outH = Math.max(1, Math.round(fullH * Math.min(1, Math.max(0.05, cropTopFraction))))
  const canvas = canvasPkg.createCanvas(Math.ceil(viewport.width), outH)
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({ canvasContext: context, viewport, canvasFactory: new NodeCanvasFactory() })
    .promise

  const mime = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp'
  let buffer
  try {
    buffer = await canvas.encode(format === 'png' ? 'png' : format === 'jpeg' ? 'jpeg' : 'webp',
      format === 'png' ? undefined : Math.round(quality * 100))
  } catch {
    buffer = await canvas.encode('jpeg', 88)
  }
  page.cleanup()
  return { buffer, width: canvas.width, height: canvas.height, mime }
}

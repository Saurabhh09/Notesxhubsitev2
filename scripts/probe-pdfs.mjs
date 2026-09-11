// One-off probe: report page count and any extractable text layer per source PDF.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DIR = 'C:/Users/saura/OneDrive/Documents/NotesXhub/PHYSICS'
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

const files = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith('.pdf'))
for (const f of files) {
  const data = new Uint8Array(await readFile(path.join(DIR, f)))
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false }).promise
  const texts = []
  for (let p = 1; p <= Math.min(4, doc.numPages); p++) {
    const page = await doc.getPage(p)
    const tc = await page.getTextContent()
    const t = tc.items.map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim()
    texts.push(`  p${p}: ${t.slice(0, 400) || '(no text layer)'}`)
  }
  const p1 = await doc.getPage(1)
  const vp = p1.getViewport({ scale: 1 })
  console.log(`\n=== ${f}\n  pages=${doc.numPages} size=${Math.round(vp.width)}x${Math.round(vp.height)}`)
  console.log(texts.join('\n'))
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const slugs = [
  'electric-charge-and-field-wih-pyqs-notesxhub',
  'electrostatic-potential-and-capacitance-notesxhub-pdf',
  'semiconductors-complete-notesxhub-pdf',
  'wave-optics-part-one-for-quick-revision-notesxhub-pdf',
  'wave-optics-part-two-notesxhub-pdf',
]

async function generateSamplePdf(slug) {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  
  const page = doc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  page.drawText('NotesXhub — Premium Handwritten Notes', {
    x: 50,
    y: height - 80,
    size: 20,
    font,
    color: rgb(0.09, 0.27, 0.48),
  })

  page.drawText(`Document: ${slug}`, {
    x: 50,
    y: height - 120,
    size: 14,
    font,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText('Thank you for purchasing from NotesXhub! Full PDF notes with formulas and PYQs.', {
    x: 50,
    y: height - 150,
    size: 11,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.35),
  })

  const pdfBytes = await doc.save()
  const targetDir = path.resolve('./storage/products', slug)
  await mkdir(targetDir, { recursive: true })
  await writeFile(path.join(targetDir, 'full.pdf'), pdfBytes)
  console.log(`Created sample PDF for ${slug}`)
}

async function main() {
  for (const s of slugs) {
    await generateSamplePdf(s)
  }
  console.log('✅ All sample storage PDFs created successfully')
}

main().catch(console.error)

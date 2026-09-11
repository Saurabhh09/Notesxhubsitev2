// Ingest PDFs from SOURCE_PDF_DIR into the database + storage.
// For each PDF:
//   1. Creates a Product with price = ₹149
//   2. Renders page 1 as cover image → public/products/<slug>/cover.webp
//   3. Renders pages 1 & 2 as preview images → public/products/<slug>/preview-1.webp, preview-2.webp
//   4. Copies the full PDF → storage/products/<slug>/full.pdf
//   5. Assigns to Class 12 + JEE Main categories + Physics subject
//
// Run: node scripts/ingest-pdfs.mjs

import { PrismaClient } from '@prisma/client'
import { readdir, mkdir, copyFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { openPdf, renderPage } from './lib/pdf-render.mjs'

const prisma = new PrismaClient()
const SOURCE_DIR = process.env.SOURCE_PDF_DIR || 'C:/Users/saura/OneDrive/Documents/NotesXhub/PHYSICS'
const PUBLIC_DIR = path.resolve('public/products')
const STORAGE_DIR = path.resolve(process.env.PRIVATE_STORAGE_DIR || './storage', 'products')
const PRICE_PAISE = 14900 // ₹149

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function cleanName(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/\.pdf$/i, '') // handle double .pdf
    .replace(/NotesXhub|Notesxhub|notesxhub/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  console.log('📥 Ingesting PDFs from:', SOURCE_DIR)

  const files = (await readdir(SOURCE_DIR)).filter((f) => f.toLowerCase().endsWith('.pdf'))
  console.log(`Found ${files.length} PDFs`)

  // Get references for category & subject assignments
  const physicsSubject = await prisma.subject.findUnique({ where: { slug: 'physics' } })
  const class12 = await prisma.category.findUnique({ where: { slug: 'class-12' } })
  const jeeMain = await prisma.category.findUnique({ where: { slug: 'jee-main' } })

  if (!physicsSubject) throw new Error('Physics subject not found — run seed first')

  const productIds = []

  for (const filename of files) {
    const slug = slugify(filename)
    const name = cleanName(filename)
    const srcPath = path.join(SOURCE_DIR, filename)

    console.log(`\n📄 Processing: ${filename}`)
    console.log(`   Name: ${name}`)
    console.log(`   Slug: ${slug}`)

    // Create output directories
    const pubDir = path.join(PUBLIC_DIR, slug)
    const storeDir = path.join(STORAGE_DIR, slug)
    await mkdir(pubDir, { recursive: true })
    await mkdir(storeDir, { recursive: true })

    // Open PDF and get page count
    const doc = await openPdf(srcPath)
    const pageCount = doc.numPages
    console.log(`   Pages: ${pageCount}`)

    // Render cover (page 1)
    const cover = await renderPage(doc, 1, { targetWidth: 800, format: 'webp', quality: 0.88 })
    const coverPath = path.join(pubDir, 'cover.webp')
    await writeFile(coverPath, Buffer.from(cover.buffer))
    console.log(`   ✅ Cover: ${cover.width}x${cover.height}`)

    // Render preview pages
    const preview1 = await renderPage(doc, 1, { targetWidth: 1000, format: 'webp', quality: 0.85 })
    await writeFile(path.join(pubDir, 'preview-1.webp'), Buffer.from(preview1.buffer))

    let preview2Data = null
    if (pageCount >= 2) {
      preview2Data = await renderPage(doc, 2, { targetWidth: 1000, format: 'webp', quality: 0.85 })
      await writeFile(path.join(pubDir, 'preview-2.webp'), Buffer.from(preview2Data.buffer))
    }
    console.log(`   ✅ Previews rendered`)

    // Copy full PDF to private storage
    const fullPdfPath = path.join(storeDir, 'full.pdf')
    await copyFile(srcPath, fullPdfPath)
    console.log(`   ✅ Full PDF stored`)

    doc.destroy()

    // Upsert product in database
    const product = await prisma.product.upsert({
      where: { slug },
      create: {
        name,
        slug,
        description: `Premium handwritten ${name} notes for board exams and competitive preparation. Includes diagrams, formulas, and previous year questions.`,
        topics: '[]',
        includes: JSON.stringify([
          'Handwritten notes with diagrams',
          'Important formulas highlighted',
          'Previous year questions covered',
          'Quick revision friendly',
        ]),
        audience: 'Class 12 & JEE aspirants',
        pageCount,
        fileFormat: 'PDF',
        priceInPaise: PRICE_PAISE,
        status: 'PUBLISHED',
        featured: true,
        subjectId: physicsSubject.id,
      },
      update: {
        pageCount,
        status: 'PUBLISHED',
        featured: true,
      },
    })

    productIds.push(product.id)

    // Category assignments
    const catIds = [class12?.id, jeeMain?.id].filter(Boolean)
    for (const catId of catIds) {
      if (!catId) continue
      await prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: catId } },
        create: { productId: product.id, categoryId: catId },
        update: {},
      })
    }

    // File records
    const fileRecords = [
      {
        type: 'COVER',
        storageKey: `/products/${slug}/cover.webp`,
        mimeType: 'image/webp',
        width: cover.width,
        height: cover.height,
      },
      {
        type: 'PREVIEW_1',
        storageKey: `/products/${slug}/preview-1.webp`,
        mimeType: 'image/webp',
        width: preview1.width,
        height: preview1.height,
      },
      ...(preview2Data
        ? [
            {
              type: 'PREVIEW_2',
              storageKey: `/products/${slug}/preview-2.webp`,
              mimeType: 'image/webp',
              width: preview2Data.width,
              height: preview2Data.height,
            },
          ]
        : []),
      {
        type: 'FULL_PDF',
        storageKey: `products/${slug}/full.pdf`,
        mimeType: 'application/pdf',
      },
    ]

    for (const rec of fileRecords) {
      await prisma.productFile.upsert({
        where: { productId_type: { productId: product.id, type: rec.type } },
        create: { productId: product.id, ...rec },
        update: rec,
      })
    }

    console.log(`   ✅ Product saved: ${product.id}`)
  }

  // Create a bundle with first 3 products if we have enough
  if (productIds.length >= 3) {
    const bundleSlug = 'physics-essentials-bundle'
    const bundle = await prisma.bundle.upsert({
      where: { slug: bundleSlug },
      create: {
        name: 'Physics Essentials Bundle',
        slug: bundleSlug,
        description: 'Get 3 essential Physics notes at a special bundle price. Covers key topics for Class 12 and JEE preparation.',
        priceInPaise: 34900, // ₹349 instead of ₹447
        status: 'PUBLISHED',
      },
      update: {
        priceInPaise: 34900,
        status: 'PUBLISHED',
      },
    })

    // Link first 3 products to bundle
    for (let i = 0; i < 3; i++) {
      await prisma.bundleItem.upsert({
        where: { bundleId_productId: { bundleId: bundle.id, productId: productIds[i] } },
        create: { bundleId: bundle.id, productId: productIds[i], sortOrder: i },
        update: { sortOrder: i },
      })
    }
    console.log(`\n📦 Bundle created: ${bundle.name} (${productIds.slice(0, 3).length} products)`)
  }

  console.log('\n✅ Ingestion complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

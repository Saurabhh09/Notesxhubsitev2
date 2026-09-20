// Seed script: creates categories, subjects, admin user, and sample products
// Run: node scripts/seed.mjs

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database…')

  // ── Categories ──────────────────────────────────────────────────────────
  const categories = [
    { name: 'Class 10', slug: 'class-10', tagline: 'Board exam preparation notes', intro: 'High-quality handwritten notes covering the Class 10 CBSE curriculum.', sortOrder: 1 },
    { name: 'Class 11', slug: 'class-11', tagline: 'Foundation for competitive exams', intro: 'Build a strong foundation with comprehensive Class 11 notes.', sortOrder: 2 },
    { name: 'Class 12', slug: 'class-12', tagline: 'Board + entrance exam ready', intro: 'Master Class 12 concepts with detailed handwritten notes.', sortOrder: 3 },
    { name: 'JEE Main', slug: 'jee-main', tagline: 'Crack JEE Main with confidence', intro: 'Focused study material for JEE Main preparation.', sortOrder: 4 },
    { name: 'JEE Advanced', slug: 'jee-advanced', tagline: 'For the most competitive minds', intro: 'Advanced-level notes for JEE Advanced aspirants.', sortOrder: 5 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    })
  }
  console.log(`✅ ${categories.length} categories`)

  // ── Subjects ────────────────────────────────────────────────────────────
  const subjects = [
    { name: 'Physics', slug: 'physics' },
    { name: 'Chemistry', slug: 'chemistry' },
    { name: 'Mathematics', slug: 'mathematics' },
    { name: 'Biology', slug: 'biology' },
    { name: 'Science', slug: 'science' },
  ]

  for (const sub of subjects) {
    await prisma.subject.upsert({
      where: { slug: sub.slug },
      create: sub,
      update: sub,
    })
  }
  console.log(`✅ ${subjects.length} subjects`)

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'notesxhub09@gmail.com'
  const adminName = process.env.ADMIN_NAME || 'NotesXhub Admin'
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123'

  const hash = await bcrypt.hash(adminPass, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { name: adminName, email: adminEmail, passwordHash: hash, role: 'ADMIN' },
    update: { passwordHash: hash, role: 'ADMIN' },
  })
  console.log(`✅ Admin user: ${adminEmail}`)

  // ── Products ─────────────────────────────────────────────────────────────
  const physicsSubject = await prisma.subject.findUnique({ where: { slug: 'physics' } })
  const class12 = await prisma.category.findUnique({ where: { slug: 'class-12' } })
  const jeeMain = await prisma.category.findUnique({ where: { slug: 'jee-main' } })

  const productData = [
    {
      name: 'Electric Charge and Field with PYQs',
      slug: 'electric-charge-and-field-wih-pyqs-notesxhub',
      pageCount: 28,
      priceInPaise: 14900,
      compareAtPaise: 24900,
      description: 'Comprehensive handwritten notes for Electric Charges and Fields with solved previous year questions (PYQs). Perfect for CBSE Class 12 Boards and JEE Main.',
      topics: JSON.stringify(['Coulombs Law', 'Electric Field Lines', 'Electric Flux & Gauss Law', 'Dipole in Uniform Field', 'PYQs 2018-2024']),
    },
    {
      name: 'Electrostatic Potential and Capacitance',
      slug: 'electrostatic-potential-and-capacitance-notesxhub-pdf',
      pageCount: 34,
      priceInPaise: 14900,
      compareAtPaise: 24900,
      description: 'Handwritten notes for Electrostatic Potential & Capacitance with derivations, dielectric effects, and capacitor combinations. Board and entrance exam ready.',
      topics: JSON.stringify(['Electric Potential due to Dipole', 'Equipotential Surfaces', 'Capacitance & Dielectrics', 'Energy Stored in Capacitor']),
    },
    {
      name: 'Semiconductors Complete Notes',
      slug: 'semiconductors-complete-notesxhub-pdf',
      pageCount: 30,
      priceInPaise: 14900,
      compareAtPaise: 24900,
      description: 'Detailed handwritten notes covering intrinsic & extrinsic semiconductors, p-n junction diode, rectifiers, and logic gates with diagrams.',
      topics: JSON.stringify(['Energy Bands in Solids', 'p-n Junction Diode', 'Half & Full Wave Rectifiers', 'Zener Diode & Solar Cells', 'Logic Gates']),
    },
    {
      name: 'Wave Optics Part 1 (Quick Revision)',
      slug: 'wave-optics-part-one-for-quick-revision-notesxhub-pdf',
      pageCount: 22,
      priceInPaise: 9900,
      compareAtPaise: 19900,
      description: 'Quick revision handwritten notes for Wave Optics Part 1. Covers Huygens Principle, reflection, refraction, and interference of light.',
      topics: JSON.stringify(['Huygens Principle', 'Wavefronts', 'Interference & Youngs Double Slit Experiment', 'Coherent Sources']),
    },
    {
      name: 'Wave Optics Part 2 (Diffraction & Polarization)',
      slug: 'wave-optics-part-two-notesxhub-pdf',
      pageCount: 24,
      priceInPaise: 9900,
      compareAtPaise: 19900,
      description: 'Complete handwritten revision notes for Wave Optics Part 2 covering single slit diffraction, resolving power, and polarization of light.',
      topics: JSON.stringify(['Single Slit Diffraction', 'Diffraction vs Interference', 'Brewsters Law & Malus Law', 'Resolving Power']),
    },
  ]

  const seededProductIds = []

  for (const p of productData) {
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        topics: p.topics,
        includes: JSON.stringify([
          'High-resolution handwritten notes with clear diagrams',
          'Highlighted formula sheets and quick summary',
          'Previous years board & JEE questions with steps',
          'Instant PDF download on purchase',
        ]),
        audience: 'Class 12 & JEE aspirants',
        pageCount: p.pageCount,
        fileFormat: 'PDF',
        priceInPaise: p.priceInPaise,
        compareAtPaise: p.compareAtPaise,
        status: 'PUBLISHED',
        featured: true,
        subjectId: physicsSubject?.id,
      },
      update: {
        name: p.name,
        description: p.description,
        status: 'PUBLISHED',
        featured: true,
        priceInPaise: p.priceInPaise,
        compareAtPaise: p.compareAtPaise,
      },
    })

    seededProductIds.push(prod.id)

    // Categories
    const catIds = [class12?.id, jeeMain?.id].filter(Boolean)
    for (const catId of catIds) {
      await prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: prod.id, categoryId: catId } },
        create: { productId: prod.id, categoryId: catId },
        update: {},
      })
    }

    // Product files
    const fileRecords = [
      {
        type: 'COVER',
        storageKey: `/products/${p.slug}/cover.webp`,
        mimeType: 'image/webp',
        width: 800,
        height: 1100,
      },
      {
        type: 'PREVIEW_1',
        storageKey: `/products/${p.slug}/preview-1.webp`,
        mimeType: 'image/webp',
        width: 1000,
        height: 1400,
      },
      {
        type: 'PREVIEW_2',
        storageKey: `/products/${p.slug}/preview-2.webp`,
        mimeType: 'image/webp',
        width: 1000,
        height: 1400,
      },
      {
        type: 'FULL_PDF',
        storageKey: `products/${p.slug}/full.pdf`,
        mimeType: 'application/pdf',
      },
    ]

    for (const rec of fileRecords) {
      await prisma.productFile.upsert({
        where: { productId_type: { productId: prod.id, type: rec.type } },
        create: { productId: prod.id, ...rec },
        update: rec,
      })
    }
  }
  console.log(`✅ ${seededProductIds.length} products seeded`)

  // ── Bundle ───────────────────────────────────────────────────────────────
  if (seededProductIds.length >= 3) {
    const bundleSlug = 'physics-essentials-bundle'
    const bundle = await prisma.bundle.upsert({
      where: { slug: bundleSlug },
      create: {
        name: 'Physics Class 12 & JEE Essentials Bundle',
        slug: bundleSlug,
        description: 'Get all essential Class 12 Physics handwritten notes at a special discounted bundle price. Complete with diagrams, formulas, and PYQs.',
        priceInPaise: 34900,
        status: 'PUBLISHED',
      },
      update: {
        priceInPaise: 34900,
        status: 'PUBLISHED',
      },
    })

    for (let i = 0; i < 3; i++) {
      await prisma.bundleItem.upsert({
        where: { bundleId_productId: { bundleId: bundle.id, productId: seededProductIds[i] } },
        create: { bundleId: bundle.id, productId: seededProductIds[i], sortOrder: i },
        update: { sortOrder: i },
      })
    }
    console.log(`✅ Bundle seeded: ${bundle.name}`)
  }

  console.log('🌱 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

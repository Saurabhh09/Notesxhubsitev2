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

  console.log('🌱 Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

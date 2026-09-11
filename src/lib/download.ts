import { SignJWT, jwtVerify } from 'jose'
import path from 'node:path'

const SECRET = new TextEncoder().encode(process.env.DOWNLOAD_TOKEN_SECRET || '')
const STORAGE_DIR = process.env.PRIVATE_STORAGE_DIR || './storage'

/** Time-limited signed download token (5 min default). */
export async function createDownloadToken(
  userId: string,
  productId: string,
  ttlSeconds = 300,
): Promise<string> {
  return new SignJWT({ userId, productId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(SECRET)
}

export async function verifyDownloadToken(
  token: string,
): Promise<{ userId: string; productId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as { userId: string; productId: string }
  } catch {
    return null
  }
}

/** Resolve a storage key to an absolute filesystem path. */
export function resolveStoragePath(storageKey: string): string {
  return path.resolve(STORAGE_DIR, storageKey)
}

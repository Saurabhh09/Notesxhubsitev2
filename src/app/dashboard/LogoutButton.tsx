'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 !text-xs">
      Sign Out
    </button>
  )
}

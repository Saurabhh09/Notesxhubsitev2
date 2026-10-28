'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push('/library')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/brand/logo-full.webp"
              alt="NotesXhub"
              width={220}
              height={70}
              className="mx-auto mb-4 h-11 w-auto object-contain"
            />
          </Link>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFE959] text-ink-900 border border-[#F2DE44] mb-2">
            ✏️ Student Login
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Sign in to access your purchased notes & library</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-3xl border border-[#E9DFCB] shadow-card p-6 sm:p-8">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 font-bold text-sm shadow-md mt-2">
            {loading ? 'Signing in…' : 'Sign In to Library'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-bold text-sky-600 hover:text-sky-700 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

'use client'

import React from 'react'

export function HeroDoodles() {
  return (
    <>
      {/* ── Left Illustration Composition (Notebook, Sticky Notes, Doodles) ── */}
      <div className="hidden xl:block absolute left-2 2xl:left-8 top-20 2xl:top-24 z-10 pointer-events-none select-none">
        <div className="relative w-[340px] h-[390px]">
          {/* Yellow sticky note behind */}
          <div
            className="absolute top-10 left-0 w-36 h-36 rounded-md bg-[#FFEAA0] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transform -rotate-12 transition-transform duration-500 hover:rotate-[-8deg] flex flex-col justify-center items-center p-3 pattern-lined border border-[#F4DC8C]"
            style={{ transformOrigin: 'top left' }}
          >
            <span className="font-handwriting text-xl text-ink-900 font-bold leading-tight text-center">
              Target 95%+
              <br />
              Keep Going! ✨
            </span>
          </div>

          {/* Pink Sticky Note: "Good Notes Brighter Results ♡" */}
          <div
            className="absolute top-0 left-20 w-36 h-36 rounded-md bg-[#FFD7DE] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transform -rotate-6 transition-transform duration-500 hover:rotate-0 flex flex-col justify-center items-center p-4 border border-[#F7C6D0]"
            style={{ transformOrigin: 'top center' }}
          >
            <p className="font-handwriting text-2xl text-ink-900 font-bold text-center leading-snug">
              Good Notes
              <br />
              Brighter
              <br />
              Results ♡
            </p>
          </div>

          {/* Spiral Physics Notebook */}
          <div
            className="absolute top-28 left-6 w-56 bg-[#FFFDF9] rounded-2xl shadow-[0_16px_36px_rgba(16,27,61,0.16)] border border-[#EDE5D5] p-5 pt-4 transform -rotate-3 transition-transform duration-500 hover:rotate-0 overflow-hidden"
          >
            {/* Spiral binding rings along left */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner" />
              ))}
            </div>

            <div className="pl-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                <span className="font-handwriting text-2xl font-bold text-ink-900 tracking-wide">
                  Physics
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  Vol. 1
                </span>
              </div>

              {/* Planet Saturn Illustration */}
              <div className="my-2 flex justify-center">
                <svg width="68" height="42" viewBox="0 0 100 60" fill="none" className="stroke-ink-900">
                  <circle cx="50" cy="30" r="18" fill="#FFF3D4" strokeWidth="2.5" />
                  <ellipse cx="50" cy="30" rx="36" ry="10" strokeWidth="2.5" strokeDasharray="3 0" transform="rotate(-15 50 30)" />
                  <circle cx="50" cy="24" r="1" fill="#101B3D" />
                  <path d="M42 32c2 3 8 3 12 0" strokeWidth="2" strokeLinecap="round" />
                  {/* Mini star */}
                  <path d="M78 12l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#FFE066" strokeWidth="1" />
                </svg>
              </div>

              {/* Handwritten bullet points */}
              <ul className="space-y-1 font-handwriting text-lg text-slate-700 leading-tight">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
                  <span>Concepts & Laws</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  <span>Important Formulas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Solved PYQs</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                  <span>Short Revision Notes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hand-drawn arrow pointing to hero */}
          <div className="absolute -bottom-4 right-2 text-ink-900">
            <svg width="60" height="50" viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 20 C 35 10, 55 25, 68 45" />
              <path d="M52 46 L 70 47 L 66 32" />
            </svg>
          </div>

          {/* Sparkle doodle stars */}
          <div className="absolute top-24 -left-4 text-white drop-shadow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
            </svg>
          </div>
          <div className="absolute top-64 -left-2 text-amber-300 drop-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right Illustration Composition (Notebook, Sticky Notes, Doodles) ── */}
      <div className="hidden xl:block absolute right-2 2xl:right-8 top-20 2xl:top-24 z-10 pointer-events-none select-none">
        <div className="relative w-[340px] h-[390px]">
          {/* Yellow sticky note: "Study Share Grow ♡" */}
          <div
            className="absolute top-2 right-12 w-36 h-36 rounded-md bg-[#FFF0A0] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transform rotate-8 transition-transform duration-500 hover:rotate-3 flex flex-col justify-center items-center p-4 border border-[#F4E082]"
            style={{ transformOrigin: 'top center' }}
          >
            <p className="font-handwriting text-2xl text-ink-900 font-bold text-center leading-snug">
              Study
              <br />
              Share
              <br />
              Grow ♡
            </p>
          </div>

          {/* Spiral Chemistry Notebook with grid pattern */}
          <div
            className="absolute top-26 right-8 w-56 bg-[#FFFDF9] rounded-2xl shadow-[0_16px_36px_rgba(16,27,61,0.16)] border border-[#EDE5D5] p-5 pt-4 transform rotate-4 transition-transform duration-500 hover:rotate-0 overflow-hidden pattern-grid"
          >
            {/* Spiral binding rings along left */}
            <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2.5 h-1.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner" />
              ))}
            </div>

            <div className="pl-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                <span className="font-handwriting text-2xl font-bold text-ink-900 tracking-wide">
                  Chemistry
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  NCERT
                </span>
              </div>

              {/* Chemistry Flask Illustration */}
              <div className="my-2 flex justify-center">
                <svg width="60" height="46" viewBox="0 0 80 60" fill="none" className="stroke-ink-900">
                  <path d="M35 12h10v12l16 26a3 3 0 01-2.5 4H21.5a3 3 0 01-2.5-4L35 24V12z" fill="#E0F7EF" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M33 12h14" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M25 44q15-4 30 0" strokeWidth="2" strokeLinecap="round" />
                  {/* Floating Bubbles */}
                  <circle cx="36" cy="38" r="2.5" fill="#48BB78" stroke="none" />
                  <circle cx="44" cy="32" r="2" fill="#48BB78" stroke="none" />
                  <circle cx="39" cy="22" r="1.5" fill="#48BB78" stroke="none" />
                </svg>
              </div>

              {/* Bullet points */}
              <ul className="space-y-1 font-handwriting text-lg text-slate-700 leading-tight">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>NCERT Based</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
                  <span>Quick Formulae</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                  <span>Reaction Maps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                  <span>Important Qs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pink Sticky Note: "Same Students Bigger Dreams" */}
          <div
            className="absolute top-56 -right-2 w-32 h-32 rounded-md bg-[#FFD7DE] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transform rotate-12 transition-transform duration-500 hover:rotate-6 flex flex-col justify-center items-center p-3 border border-[#F7C6D0]"
            style={{ transformOrigin: 'center' }}
          >
            <p className="font-handwriting text-xl text-ink-900 font-bold text-center leading-tight">
              Same
              <br />
              Students
              <br />
              Bigger
              <br />
              Dreams ✨
            </p>
          </div>

          {/* Hand-drawn curved arrow */}
          <div className="absolute -bottom-8 left-4 text-ink-900">
            <svg width="60" height="50" viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M70 15 C 45 10, 25 25, 12 45" />
              <path d="M28 46 L 10 47 L 14 32" />
            </svg>
          </div>

          {/* Sparkles */}
          <div className="absolute top-16 right-0 text-white drop-shadow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
            </svg>
          </div>
          <div className="absolute top-68 right-36 text-amber-300 drop-shadow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export function DevicePreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 z-20 -mb-16 sm:-mb-24 lg:-mb-28">
      {/* Sleek Laptop / Foldable Tablet Device Frame */}
      <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#101B3D] p-3 sm:p-4.5 shadow-[0_30px_70px_-15px_rgba(16,27,61,0.35),0_0_0_1px_rgba(255,255,255,0.18)]">
        {/* Device webcam notch */}
        <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1F2C54] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#38BDF8]" />
          </div>
        </div>

        {/* Inner Screen Display */}
        <div className="relative rounded-[20px] sm:rounded-[26px] bg-[#FCFBF7] overflow-hidden border border-slate-200/60 shadow-inner">
          {/* Top Window Navigation Bar */}
          <div className="bg-white/90 border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="ml-3 font-bold text-xs tracking-tight text-ink-900 hidden sm:inline-block">
                NotesXhub
              </span>
            </div>

            {/* In-app search mock */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-400 w-52">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span>Search Class 12, JEE...</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-sky-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Active Study Hub</span>
            </div>
          </div>

          {/* Screen Content Area */}
          <div className="p-4 sm:p-7 bg-gradient-to-b from-white via-cream-50 to-[#FFFBF2]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Mini Sidebar / Menu */}
              <div className="hidden md:block md:col-span-3 space-y-1.5 border-r border-slate-100 pr-3">
                <div className="px-3 py-2 rounded-xl bg-sky-50 text-sky-700 font-semibold text-xs flex items-center gap-2">
                  <span>🏠</span> Home
                </div>
                <div className="px-3 py-2 rounded-xl text-slate-600 font-medium text-xs flex items-center gap-2 hover:bg-slate-50">
                  <span>🔍</span> Explore Notes
                </div>
                <div className="px-3 py-2 rounded-xl text-slate-600 font-medium text-xs flex items-center gap-2 hover:bg-slate-50">
                  <span>📚</span> My Library
                </div>
                <div className="px-3 py-2 rounded-xl text-slate-600 font-medium text-xs flex items-center gap-2 hover:bg-slate-50">
                  <span>⭐</span> Top Sellers
                </div>
              </div>

              {/* Main Preview Center Banner */}
              <div className="md:col-span-9 space-y-4">
                {/* Category Pills Row */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] sm:text-xs font-semibold">
                    Class 10
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-semibold">
                    Class 11
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-semibold">
                    Class 12
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold">
                    JEE Main
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] sm:text-xs font-semibold">
                    NEET
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-semibold">
                    Quick Revision
                  </span>
                </div>

                {/* Main Inside Headline with Marker Stroke */}
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink-900 tracking-tight leading-tight">
                    Find notes that{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10">actually help.</span>
                      <span className="absolute left-0 bottom-1 w-full h-3 bg-sunshine-300 rounded-sm -rotate-1 z-0 opacity-80" />
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Verified toppers & teachers notes with step-by-step diagrams.
                  </p>
                </div>

                {/* Dual Student Illustration & Motivational Note Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Student studying illustration card */}
                  <div className="rounded-2xl bg-white p-3.5 border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
                      <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
                        {/* Student with headphones & book */}
                        <circle cx="32" cy="22" r="10" fill="#FFE2C9" />
                        <path d="M22 22a10 10 0 0120 0" stroke="#101B3D" strokeWidth="3" />
                        <rect x="18" y="19" width="5" height="9" rx="2.5" fill="#2598F5" />
                        <rect x="41" y="19" width="5" height="9" rx="2.5" fill="#2598F5" />
                        <path d="M22 18c0-5 4.5-9 10-9s10 4 10 9" stroke="#2598F5" strokeWidth="2.5" />
                        {/* Book */}
                        <path d="M16 46l16-6 16 6v10l-16-5-16 5V46z" fill="#FF5F56" />
                        <path d="M32 40v11" stroke="#FFFFFF" strokeWidth="2" />
                        {/* Lightbulb idea */}
                        <circle cx="48" cy="14" r="5" fill="#FEE440" />
                        <path d="M48 9v2M44 11l1.5 1.5M52 11l-1.5 1.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-ink-900">Direct From Toppers</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Clear handwriting, zero fluff.</p>
                      <span className="text-[10px] font-semibold text-emerald-600">✓ Instant PDF Access</span>
                    </div>
                  </div>

                  {/* Motivational Card with Smiley & Planet */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#FFE7EB] to-[#FFF3E8] p-3.5 border border-[#FFD9DF] shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-handwriting text-lg font-bold text-ink-900 leading-tight">
                        Better Notes
                        <br />
                        Brighter Futures 😊
                      </p>
                      <span className="text-[10px] text-slate-600">Class 10, 11, 12 & JEE</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-xl shadow-xs">
                      🪐
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ArrowLeft, Lock, Clock } from 'lucide-react'

export default function CaregiverPage() {
  return (
    <div className="min-h-screen bg-[#000009] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-300">Family Access</h1>
          <div className="w-16"></div>
        </div>

        {/* Under Development */}
        <div className="bg-slate-800/40 border border-purple-500/20 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Lock className="w-16 h-16 text-purple-400/60" />
              <Clock className="w-6 h-6 text-purple-300 absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-200 mb-3">Under Development</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Family Access lets you share your scores and achievements with someone you choose — a parent, friend, or coach. It requires the Midnight blockchain integration to be deployed first so sharing is zero-knowledge and permission-based.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

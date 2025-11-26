'use client'

import Link from 'next/link'
import { ArrowLeft, Users, TrendingUp, Lock } from 'lucide-react'

export default function CaregiverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-purple-300">Caregiver Dashboard</h1>
          <div className="w-16"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-slate-400 text-sm">Patients</p>
            <p className="text-3xl font-bold text-purple-300">0</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-slate-400 text-sm">Avg Improvement</p>
            <p className="text-3xl font-bold text-green-300">--</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
            <Lock className="w-8 h-8 text-pink-400 mb-3" />
            <p className="text-slate-400 text-sm">Encrypted Records</p>
            <p className="text-3xl font-bold text-pink-300">0</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/30 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-purple-200 mb-3">Caregiver Dashboard Coming Soon</h2>
          <p className="text-slate-300 mb-4">The caregiver dashboard is under development and will be available soon.</p>
          <p className="text-slate-400 text-sm mb-6">This feature will allow you to monitor patient progress, manage access permissions, and view encrypted health metrics securely.</p>
          
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
            <p className="text-purple-300 font-semibold">🔄 Upcoming Features:</p>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>Real-time patient activity monitoring</li>
              <li>Encrypted data access with zero-knowledge proofs</li>
              <li>Permission-based access control</li>
              <li>Performance analytics and progress tracking</li>
            </ul>
          </div>
          
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

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

        {/* Patients List */}
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">Patient List</h2>
          <div className="text-center text-slate-400 py-12">
            <p>No patients connected yet</p>
            <p className="text-sm text-slate-500 mt-2">Patient data will appear here once they grant access</p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
          <p className="text-xs text-slate-400 flex items-start gap-2">
            <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            All patient data is end-to-end encrypted using Midnight blockchain technology. Access requires explicit patient permission.
          </p>
        </div>
      </div>
    </div>
  )
}

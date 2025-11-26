'use client'

import Link from 'next/link'
import { Brain, LogIn, Shield, Gamepad2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GameFit
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Private Cognitive Health Tracker for Dementia Care
          </p>
          <p className="text-sm text-slate-400">
            Powered by Midnight Blockchain - Your data, encrypted and private
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 my-8">
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
            <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-300">Cognitive Games</h3>
            <p className="text-xs text-slate-400 mt-2">Memory & puzzle games tailored for cognitive training</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-300">Privacy First</h3>
            <p className="text-xs text-slate-400 mt-2">End-to-end encryption via Midnight blockchain</p>
          </div>
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
            <LogIn className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-300">Caregiver Access</h3>
            <p className="text-xs text-slate-400 mt-2">Secure permission-based caregiver dashboard</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/player">
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-white">
              Play Now
            </button>
          </Link>
          <Link href="/caregiver">
            <button className="w-full sm:w-auto px-8 py-3 border border-purple-500 text-purple-300 hover:bg-purple-500/10 rounded-lg font-semibold transition-all duration-300">
              Caregiver Dashboard
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 pt-8 border-t border-slate-800">
          <p>🔐 All data encrypted and stored on Midnight blockchain</p>
          <p>Your privacy is our priority</p>
        </div>
      </div>
    </div>
  )
}

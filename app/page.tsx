'use client'

import Link from 'next/link'
import { Brain, Users, Shield, Gamepad2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000009] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BrainFit
            </h1>
          </div>
          <p className="text-xl text-slate-300">
            Brain Training Games for Everyone
          </p>
          <p className="text-sm text-slate-400">
            For kids and adults — sharpen memory, logic, and focus
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 my-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-200">Brain Games</h3>
            <p className="text-xs text-slate-400 mt-2">Memory matching and sliding puzzles for all skill levels</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-200">Private by Design</h3>
            <p className="text-xs text-slate-400 mt-2">Your scores stay yours — encrypted via Midnight blockchain</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-200">Share Progress</h3>
            <p className="text-xs text-slate-400 mt-2">Let family or friends see your achievements securely</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/player">
            <button className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors text-white">
              Play Now
            </button>
          </Link>
          <Link href="/caregiver">
            <button className="w-full sm:w-auto px-8 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors">
              Family Access
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 pt-8 border-t border-slate-800">
          <p>Available on web, browser extension, and VS Code</p>
          <p>Your data, encrypted and privately yours</p>
        </div>
      </div>
    </div>
  )
}

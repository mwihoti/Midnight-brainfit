'use client'

import { Component, ReactNode } from 'react'

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

class AppErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('AppErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000009] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-red-500/30 rounded-xl p-8 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold text-red-300 mb-2">Something went wrong</h2>
            <p className="text-slate-400 text-sm mb-6">
              {this.state.message || 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-4 py-2 border border-slate-600 hover:border-slate-400 rounded-lg text-sm font-semibold transition-colors text-slate-300"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Providers ────────────────────────────────────────────────────────────────

export function Providers({ children }: { children: ReactNode }) {
  return <AppErrorBoundary>{children}</AppErrorBoundary>
}

'use client'

import { useEffect, useState } from 'react'
import { connectWallet } from '@/lib/services/midnightService'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnector() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const address = localStorage.getItem('walletAddress')
    if (address) {
      setWalletAddress(address)
    }
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const address = await connectWallet()
      if (address) {
        setWalletAddress(address)
        localStorage.setItem('walletAddress', address)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
    localStorage.removeItem('walletAddress')
  }

  if (walletAddress) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-2 bg-slate-700 rounded flex items-center gap-2">
          <Wallet className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-slate-300">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="p-2 hover:bg-slate-700 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded transition-colors"
    >
      <Wallet className="w-4 h-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { initializeMidnight } from '@/lib/services/midnightService'
import { useGameStore, initPlayer } from '@/lib/store'
import { getLocalNFTs, setContractService } from '@/lib/services/nftService'
import { initWallet } from '@/lib/midnight/walletService'
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api'
import { Wallet, LogOut, Wifi, WifiOff, Loader2 } from 'lucide-react'

// Network ID string passed to wallet connector and provider builder
const NETWORK_ID = process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK || 'TestNet'

export function WalletConnector() {
  const store = useGameStore()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [contractStatus, setContractStatus] = useState<'idle' | 'deploying' | 'ready' | 'error'>('idle')
  const [networkOnline, setNetworkOnline] = useState<boolean | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)

  // On mount: restore address from previous session and check network status
  useEffect(() => {
    const address = localStorage.getItem('walletAddress')
    if (address) {
      setWalletAddress(address)
      loadPlayer(address)
    }

    initializeMidnight().then((status) => {
      setNetworkOnline(status.connected)
      store.setNetworkConnected(status.connected)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPlayer = (address: string) => {
    const player = initPlayer(address)
    const localNFTs = getLocalNFTs(address)
    store.setPlayer({ ...player, nfts: localNFTs })
  }

  /**
   * Deploy a new BrainFit contract or rejoin an existing one.
   *
   * DISABLED: The Midnight SDK bundles 10 MB WASM binaries that webpack 5
   * cannot parse (ledger-v7, onchain-runtime). The contract also requires
   * `compact compile` to be run before it can be deployed.
   *
   * To re-enable: compile the contract, then replace this function body with
   * a dynamic import of contractService and call buildBrainFitProviders /
   * BrainFitContractService.deploy as shown in lib/midnight/contractService.ts.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setupContract = async (_connectedAPI: ConnectedAPI): Promise<void> => {
    setContractService(null)
    setContractStatus('error')
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    setWalletError(null)

    try {
      // ── Path 1: Real Lace wallet (Midnight DApp Connector API v4) ─────────────
      try {
        const api = await initWallet(NETWORK_ID as string)
        const addresses = await api.getShieldedAddresses()
        // Use the shielded coin public key as the in-app wallet identifier
        const address = addresses.shieldedCoinPublicKey

        localStorage.setItem('walletAddress', address)
        setWalletAddress(address)
        loadPlayer(address)

        // Contract setup runs in background — does not block the UI
        setupContract(api)
        return
      } catch (walletErr) {
        const msg = walletErr instanceof Error ? walletErr.message : String(walletErr)
        // Only fall through to guest mode if the wallet simply isn't installed
        if (!msg.toLowerCase().includes('not found') && !msg.toLowerCase().includes('install')) {
          setWalletError(msg)
          return
        }
        // Wallet extension absent → continue to guest fallback
      }

      // ── Path 2: Guest / demo mode (no Lace wallet installed) ─────────────────
      const guestAddress = `midnight1${Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')}`
      localStorage.setItem('walletAddress', guestAddress)
      setWalletAddress(guestAddress)
      loadPlayer(guestAddress)
      // Guest mode: NFTs stored locally only, no on-chain contract
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem('walletAddress')
    setWalletAddress(null)
    setContractAddress(null)
    setContractStatus('idle')
    setContractService(null)
    store.setPlayer(initPlayer('guest'))
  }

  // ── Connected state ───────────────────────────────────────────────────────────

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        {/* Midnight preprod connectivity indicator */}
        {networkOnline !== null && (
          <div
            title={networkOnline ? 'Midnight preprod connected' : 'Offline — local mode'}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
          >
            {networkOnline ? (
              <Wifi className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        )}

        {/* Contract deployment status */}
        {contractStatus === 'deploying' && (
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded text-xs text-yellow-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="hidden sm:inline">Deploying…</span>
          </div>
        )}
        {contractStatus === 'ready' && contractAddress && (
          <div
            title={`Midnight contract: ${contractAddress}`}
            className="hidden sm:block px-2 py-1 bg-green-900/30 rounded text-xs text-green-400 font-mono cursor-default"
          >
            {contractAddress.slice(0, 6)}…{contractAddress.slice(-4)}
          </div>
        )}

        {/* Wallet address chip */}
        <div className="px-3 py-2 bg-slate-700 rounded flex items-center gap-2">
          <Wallet className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-slate-300">
            {walletAddress.slice(0, 8)}…{walletAddress.slice(-4)}
          </span>
        </div>

        <button
          onClick={handleDisconnect}
          className="p-2 hover:bg-slate-700 rounded transition-colors"
          title="Disconnect wallet"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    )
  }

  // ── Disconnected state ────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded transition-colors"
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {walletError && (
        <span className="text-xs text-red-400 max-w-xs text-right">{walletError}</span>
      )}
    </div>
  )
}

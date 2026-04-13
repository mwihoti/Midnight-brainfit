/**
 * Midnight Blockchain Service
 * Handles wallet connection, encryption, and data persistence
 * Targets Midnight preprod (testnet-02) network
 */

// ─── Midnight Preprod endpoints ──────────────────────────────────────────────
const MIDNIGHT_PREPROD_RPC =
  process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URL ||
  'https://rpc.testnet-02.midnight.network/'
const MIDNIGHT_PREPROD_INDEXER =
  'https://indexer.testnet-02.midnight.network/api/v1'

export interface MidnightConfig {
  nodeUrl: string
  walletId: string
}

export interface EncryptedData {
  ciphertext: string
  iv: string
  salt: string
  tag: string
}

export interface ZKProof {
  proof: string
  publicInputs: string[]
  verified: boolean
}

export interface NetworkStatus {
  connected: boolean
  network: string
  blockHeight?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert ArrayBuffer → hex string */
function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Convert hex string → Uint8Array */
function hexToBuf(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

/** Derive a 256-bit AES key from a passphrase using PBKDF2 */
async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// ─── Network ──────────────────────────────────────────────────────────────────

/**
 * Initialize Midnight blockchain connection and check preprod network status
 */
export async function initializeMidnight(_config?: MidnightConfig): Promise<NetworkStatus> {
  try {
    const res = await fetch(`${MIDNIGHT_PREPROD_RPC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'chain_getBlock', params: [], id: 1 }),
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      return {
        connected: true,
        network: 'midnight-preprod',
        blockHeight: data?.result?.block?.header?.number ?? undefined,
      }
    }
  } catch {
    // Network unreachable — continue in offline mode
  }
  return { connected: false, network: 'midnight-preprod' }
}

/**
 * Check Midnight preprod indexer for contract state
 */
export async function queryIndexer<T>(query: string): Promise<T | null> {
  try {
    const res = await fetch(`${MIDNIGHT_PREPROD_INDEXER}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) {
      return (await res.json()) as T
    }
  } catch {
    // Indexer unavailable
  }
  return null
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

/** Detect and connect to Lace wallet (Midnight/Cardano extension) */
export async function connectWallet(): Promise<string | null> {
  try {
    // Check for cached address first
    const cached = localStorage.getItem('walletAddress')
    if (cached) return cached

    // Try Lace wallet extension (Midnight + Cardano)
    const win = window as typeof window & {
      cardano?: { lace?: { enable(): Promise<{ getChangeAddress(): Promise<string> }> } }
      midnight?: { lace?: { enable(): Promise<{ getAddress(): Promise<string> }> } }
    }

    // Midnight-specific Lace API
    if (win.midnight?.lace) {
      const api = await win.midnight.lace.enable()
      const addr = await api.getAddress()
      localStorage.setItem('walletAddress', addr)
      return addr
    }

    // Cardano Lace API (also works on Midnight preprod)
    if (win.cardano?.lace) {
      const api = await win.cardano.lace.enable()
      const addr = await api.getChangeAddress()
      localStorage.setItem('walletAddress', addr)
      return addr
    }

    return null
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    return null
  }
}

/** Disconnect wallet */
export function disconnectWallet(): void {
  localStorage.removeItem('walletAddress')
}

// ─── Encryption ───────────────────────────────────────────────────────────────

/**
 * Encrypt data using AES-256-GCM via Web Crypto API.
 * The passphrase is derived from the user's wallet address when available.
 */
export async function encryptData(data: string, passphrase: string): Promise<EncryptedData> {
  const enc = new TextEncoder()
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  const iv = new Uint8Array(12)
  crypto.getRandomValues(iv)

  const key = await deriveKey(passphrase, salt as Uint8Array<ArrayBuffer>)

  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as Uint8Array<ArrayBuffer> },
    key,
    enc.encode(data)
  )

  // AES-GCM appends the 16-byte tag to the ciphertext
  const fullBuf = new Uint8Array(ciphertextBuf)
  const tag = bufToHex(fullBuf.slice(-16).buffer)
  const ciphertext = bufToHex(fullBuf.slice(0, -16).buffer)

  return {
    ciphertext,
    iv: bufToHex(iv.buffer),
    salt: bufToHex(salt.buffer),
    tag,
  }
}

/**
 * Decrypt AES-256-GCM encrypted data
 */
export async function decryptData(encrypted: EncryptedData, passphrase: string): Promise<string> {
  const iv = hexToBuf(encrypted.iv)
  const salt = hexToBuf(encrypted.salt)
  const cipherBuf = hexToBuf(encrypted.ciphertext)
  const tagBuf = hexToBuf(encrypted.tag)

  // Reassemble ciphertext + tag
  const fullBuf = new Uint8Array(cipherBuf.length + tagBuf.length)
  fullBuf.set(cipherBuf)
  fullBuf.set(tagBuf, cipherBuf.length)

  const key = await deriveKey(passphrase, salt as Uint8Array<ArrayBuffer>)
  const dec = new TextDecoder()
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as Uint8Array<ArrayBuffer> }, key, fullBuf)
  return dec.decode(plainBuf)
}

// ─── On-chain storage ─────────────────────────────────────────────────────────

/**
 * Store encrypted game metrics.
 * Attempts to submit to Midnight preprod; falls back to localStorage.
 */
export async function storeMetricsOnChain(
  playerAddress: string,
  metrics: string
): Promise<boolean> {
  try {
    const passphrase = playerAddress || 'brainfit-default-key'
    const encrypted = await encryptData(metrics, passphrase)
    const payload = JSON.stringify({ playerAddress, encrypted, ts: Date.now() })

    // Persist locally first (reliable)
    localStorage.setItem(`metrics_${playerAddress}`, payload)

    // Attempt submission to Midnight preprod (best-effort)
    fetch(`${MIDNIGHT_PREPROD_RPC}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'author_submitExtrinsic',
        params: [payload],
        id: Date.now(),
      }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => undefined)

    return true
  } catch (error) {
    console.error('Failed to store metrics:', error)
    return false
  }
}

/**
 * Retrieve encrypted metrics and decrypt them
 */
export async function retrieveMetricsFromChain(playerAddress: string): Promise<string | null> {
  try {
    const raw = localStorage.getItem(`metrics_${playerAddress}`)
    if (!raw) return null

    const { encrypted } = JSON.parse(raw) as { encrypted: EncryptedData }
    const passphrase = playerAddress || 'brainfit-default-key'
    return await decryptData(encrypted, passphrase)
  } catch (error) {
    console.error('Failed to retrieve metrics:', error)
    return null
  }
}

// ─── ZK Access control ────────────────────────────────────────────────────────

/**
 * Generate a zero-knowledge access proof.
 * Uses SHA-256 commitment as a proof placeholder until Compact ZK contracts deploy.
 */
export async function generateAccessProof(
  playerAddress: string,
  caregiverAddress: string
): Promise<ZKProof> {
  const enc = new TextEncoder()
  const combined = enc.encode(`${playerAddress}:${caregiverAddress}:${Date.now()}`)
  const hashBuf = await crypto.subtle.digest('SHA-256', combined)
  const proof = bufToHex(hashBuf)

  return {
    proof,
    publicInputs: [playerAddress, caregiverAddress],
    verified: true,
  }
}

/**
 * Verify access permission
 */
export async function verifyAccessPermission(
  proof: ZKProof,
  playerAddress: string,
  caregiverAddress: string
): Promise<boolean> {
  return (
    proof.verified &&
    proof.proof.length === 64 && // valid SHA-256 hex
    proof.publicInputs.includes(playerAddress) &&
    proof.publicInputs.includes(caregiverAddress)
  )
}

/**
 * Save caregiver access policy
 */
export async function saveAccessPolicy(
  playerAddress: string,
  caregiverAddress: string,
  permissions: string[]
): Promise<boolean> {
  try {
    const proof = await generateAccessProof(playerAddress, caregiverAddress)
    const policy = {
      player: playerAddress,
      caregiver: caregiverAddress,
      permissions,
      proof: proof.proof,
      grantedAt: new Date().toISOString(),
    }
    localStorage.setItem(
      `policy_${playerAddress}_${caregiverAddress}`,
      JSON.stringify(policy)
    )
    return true
  } catch (error) {
    console.error('Failed to save access policy:', error)
    return false
  }
}

/**
 * Revoke caregiver access
 */
export async function revokeAccess(
  playerAddress: string,
  caregiverAddress: string
): Promise<boolean> {
  try {
    localStorage.removeItem(`policy_${playerAddress}_${caregiverAddress}`)
    return true
  } catch (error) {
    console.error('Failed to revoke access:', error)
    return false
  }
}

/**
 * In-memory private state provider for BrainFit browser DApp.
 *
 * Mirrors the pattern from midnightntwrk/example-bboard.
 * Private state is held in memory during the session and backed by
 * localStorage so the secret key survives page refreshes.
 *
 * The secret key is NEVER sent to any server — it stays in the browser.
 */

import type { PrivateStateId, PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types'
import type { SigningKey } from '@midnight-ntwrk/compact-runtime'
import type { ContractAddress } from '@midnight-ntwrk/ledger-v7'

const STORAGE_PREFIX = 'brainfit:privateState:'

/** Persist private state to localStorage (encrypted-at-rest by the browser). */
function persistState<PS>(key: string, state: PS): void {
  try {
    if (typeof window !== 'undefined') {
      const hex = Array.from(
        new Uint8Array(new TextEncoder().encode(JSON.stringify(state)))
      )
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      localStorage.setItem(STORAGE_PREFIX + key, hex)
    }
  } catch {
    // Ignore storage errors
  }
}

function loadState<PS>(key: string): PS | null {
  try {
    if (typeof window === 'undefined') return null
    const hex = localStorage.getItem(STORAGE_PREFIX + key)
    if (!hex) return null
    const bytes = new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)))
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as PS
  } catch {
    return null
  }
}

/**
 * Creates an in-memory private state provider backed by localStorage.
 * Suitable for browser environments where LevelDB is unavailable.
 */
export function inMemoryPrivateStateProvider<
  PSI extends PrivateStateId,
  PS = unknown,
>(): PrivateStateProvider<PSI, PS> {
  const record = new Map<PSI, PS>()
  const signingKeys: Record<ContractAddress, SigningKey> = {}

  return {
    async set(key: PSI, state: PS): Promise<void> {
      record.set(key, state)
      persistState(String(key), state)
    },

    async get(key: PSI): Promise<PS | null> {
      if (record.has(key)) return record.get(key) ?? null
      // Try restoring from localStorage
      const persisted = loadState<PS>(String(key))
      if (persisted) {
        record.set(key, persisted)
        return persisted
      }
      return null
    },

    async remove(key: PSI): Promise<void> {
      record.delete(key)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_PREFIX + String(key))
      }
    },

    async clear(): Promise<void> {
      record.clear()
    },

    async setSigningKey(contractAddress: ContractAddress, signingKey: SigningKey): Promise<void> {
      signingKeys[contractAddress] = signingKey
    },

    async getSigningKey(contractAddress: ContractAddress): Promise<SigningKey | null> {
      return signingKeys[contractAddress] ?? null
    },

    async removeSigningKey(contractAddress: ContractAddress): Promise<void> {
      delete signingKeys[contractAddress]
    },

    async clearSigningKeys(): Promise<void> {
      for (const key of Object.keys(signingKeys)) {
        delete signingKeys[key]
      }
    },
  }
}

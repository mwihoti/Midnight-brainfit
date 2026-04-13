/**
 * BrainFit Lace wallet integration.
 *
 * Uses the Midnight DApp Connector API (window.midnight) — the same pattern
 * as midnightntwrk/example-bboard.
 *
 * The wallet provides:
 *  - shieldedCoinPublicKey & shieldedEncryptionPublicKey  (for provider setup)
 *  - balanceUnsealedTransaction()  (to pay gas)
 *  - submitTransaction()           (to broadcast signed tx)
 *  - getConfiguration()            (indexer URL, prover server URL)
 */

import semver from 'semver'
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  firstValueFrom,
  interval,
  map,
  take,
  tap,
  throwError,
  timeout,
} from 'rxjs'
import { pipe as fnPipe } from 'fp-ts/function'
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api'
import type { Logger } from 'pino'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Lace wallet DApp connector API version this app requires. */
const COMPATIBLE_CONNECTOR_API_VERSION = '4.x'

/** How often to poll for the wallet extension (ms). */
const WALLET_POLL_INTERVAL_MS = 100

/** Timeout waiting for extension to be detected (ms). */
const WALLET_DETECT_TIMEOUT_MS = 3_000

/** Timeout waiting for wallet to respond after detection (ms). */
const WALLET_CONNECT_TIMEOUT_MS = 10_000

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletConnectionStatus {
  connected: boolean
  address?: string
  shieldedCoinPublicKey?: string
  shieldedEncryptionPublicKey?: string
  networkId?: string
  proverServerUri?: string
  indexerUri?: string
  indexerWsUri?: string
}

// ─── Wallet detection ─────────────────────────────────────────────────────────

/**
 * Find the first Lace wallet extension that is compatible with our required
 * DApp connector API version.
 */
function getFirstCompatibleWallet(): InitialAPI | undefined {
  if (typeof window === 'undefined' || !window.midnight) return undefined

  return Object.values(window.midnight as Record<string, unknown>).find(
    (wallet): wallet is InitialAPI =>
      !!wallet &&
      typeof wallet === 'object' &&
      'apiVersion' in wallet &&
      typeof (wallet as { apiVersion: string }).apiVersion === 'string' &&
      semver.satisfies((wallet as { apiVersion: string }).apiVersion, COMPATIBLE_CONNECTOR_API_VERSION),
  )
}

/**
 * Connect to the Midnight Lace wallet extension.
 * Polls every 100ms until the extension is found (up to 3 seconds),
 * then enables the API (up to 10 seconds).
 *
 * @throws Error if the wallet is not found or fails to respond.
 */
export async function connectToLaceWallet(
  networkId: string,
  logger?: Logger,
): Promise<ConnectedAPI> {
  return firstValueFrom(
    fnPipe(
      interval(WALLET_POLL_INTERVAL_MS),
      map(() => getFirstCompatibleWallet()),
      tap((api) => logger?.debug({ found: !!api }, 'Checking for Lace wallet')),
      filter((api): api is InitialAPI => !!api),
      take(1),
      timeout({
        first: WALLET_DETECT_TIMEOUT_MS,
        with: () =>
          throwError(
            () => new Error('Midnight Lace wallet not found. Please install the browser extension.'),
          ),
      }),
      concatMap(async (initialAPI) => {
        logger?.info('Lace wallet found — connecting')
        const connectedAPI = await initialAPI.connect(networkId)
        const status = await connectedAPI.getConnectionStatus()
        logger?.info({ status }, 'Lace wallet connected')
        return connectedAPI
      }),
      timeout({
        first: WALLET_CONNECT_TIMEOUT_MS,
        with: () =>
          throwError(
            () => new Error('Lace wallet failed to respond. Is the extension enabled?'),
          ),
      }),
      catchError((err) =>
        throwError(() => (err instanceof Error ? err : new Error(String(err)))),
      ),
    ),
  )
}

/**
 * Attempt a non-blocking wallet status check.
 * Returns null if the wallet is unavailable (no extension installed).
 */
export async function tryGetWalletStatus(
  networkId: string,
  logger?: Logger,
): Promise<WalletConnectionStatus | null> {
  try {
    const connectedAPI = await connectToLaceWallet(networkId, logger)
    const addresses = await connectedAPI.getShieldedAddresses()
    const config = await connectedAPI.getConfiguration()

    return {
      connected: true,
      shieldedCoinPublicKey: addresses.shieldedCoinPublicKey,
      shieldedEncryptionPublicKey: addresses.shieldedEncryptionPublicKey,
      networkId,
      proverServerUri: config.proverServerUri ?? undefined,
      indexerUri: config.indexerUri,
      indexerWsUri: config.indexerWsUri,
    }
  } catch {
    return null
  }
}

// ─── Reactive wallet state ────────────────────────────────────────────────────

export type WalletState =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected'; api: ConnectedAPI; config: WalletConnectionStatus }
  | { status: 'error'; message: string }

export const walletState$ = new BehaviorSubject<WalletState>({ status: 'disconnected' })

export async function initWallet(networkId: string, logger?: Logger): Promise<ConnectedAPI> {
  walletState$.next({ status: 'connecting' })
  try {
    const api = await connectToLaceWallet(networkId, logger)
    const addresses = await api.getShieldedAddresses()
    const config = await api.getConfiguration()
    walletState$.next({
      status: 'connected',
      api,
      config: {
        connected: true,
        shieldedCoinPublicKey: addresses.shieldedCoinPublicKey,
        shieldedEncryptionPublicKey: addresses.shieldedEncryptionPublicKey,
        networkId,
        proverServerUri: config.proverServerUri ?? undefined,
        indexerUri: config.indexerUri,
        indexerWsUri: config.indexerWsUri,
      },
    })
    return api
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    walletState$.next({ status: 'error', message })
    throw err
  }
}

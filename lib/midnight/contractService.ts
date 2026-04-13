/**
 * BrainFit Midnight contract service.
 *
 * Wraps the @midnight-ntwrk/midnight-js-contracts SDK to:
 *  - Deploy a new BrainFit contract instance for a player
 *  - Reconnect to an existing deployed contract
 *  - Call circuits: recordGameCompleted, claim*, grantCaregiverAccess
 *
 * Pattern adapted from midnightntwrk/example-bboard.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   // 1. Initialize providers (called once on app start)
 *   const providers = await buildBrainFitProviders(connectedAPI, networkId)
 *
 *   // 2. Deploy contract for new player OR join existing
 *   const service = await BrainFitContractService.deploy(providers)
 *   // OR:
 *   const service = await BrainFitContractService.join(providers, savedContractAddress)
 *
 *   // 3. Record a completed game
 *   await service.recordGameCompleted()
 *
 *   // 4. Claim achievement NFTs
 *   await service.claimPioneer()
 *
 * ── Compilation prerequisite ─────────────────────────────────────────────────
 *
 *   Run before using:
 *     npx compact compile contracts/src/brainfit.compact contracts/src/managed/brainfit
 *
 *   Then install SDK packages:
 *     npm install (with the .npmrc pointing to @midnight-ntwrk registry)
 */

import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts'
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider'
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider'
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider'
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id'
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types'
import type { ContractAddress } from '@midnight-ntwrk/ledger-v7'
import { fromHex, toHex } from '@midnight-ntwrk/compact-runtime'
import type {
  FinalizedTransaction,
  Proof,
  Binding,
  SignatureEnabled,
  Transaction,
  TransactionId,
} from '@midnight-ntwrk/ledger-v7'
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api'
import type { UnboundTransaction } from '@midnight-ntwrk/midnight-js-types'
import type { Logger } from 'pino'

import {
  CompiledBrainFitContract,
  witnesses,
  createBrainFitPrivateState,
  type BrainFitPrivateState,
  type BrainFitCircuitKeys,
} from '../../contracts/src/index.js'
import { inMemoryPrivateStateProvider } from './privateStateProvider.js'

// ─── Constants ────────────────────────────────────────────────────────────────

export const BRAINFIT_PRIVATE_STATE_KEY = 'brainfitPrivateState'

const CONTRACT_ADDRESS_STORAGE_KEY = 'brainfit:contractAddress'

// ─── Types ────────────────────────────────────────────────────────────────────

type PrivateStateId = typeof BRAINFIT_PRIVATE_STATE_KEY
type PrivateStates = { readonly brainfitPrivateState: BrainFitPrivateState }

export type BrainFitProviders = MidnightProviders<
  BrainFitCircuitKeys,
  PrivateStateId,
  BrainFitPrivateState
>

export interface OnChainAchievements {
  pioneer: boolean
  memoryMaster: boolean
  logicSolver: boolean
  highPerformer: boolean
  speedDemon: boolean
  completionist: boolean
  dedicated: boolean
  brainLegend: boolean
  gamesPlayed: bigint
  playerPublicIdentity: string | null
}

// ─── Provider builder ─────────────────────────────────────────────────────────

/**
 * Build the providers object required by Midnight.js contracts.
 * Must be called after the Lace wallet is connected.
 */
export async function buildBrainFitProviders(
  connectedAPI: ConnectedAPI,
  networkId: NetworkId,
  logger?: Logger,
): Promise<BrainFitProviders> {
  const addresses = await connectedAPI.getShieldedAddresses()
  const config = await connectedAPI.getConfiguration()

  // ZK config provider fetches compiled circuit keys from the app's public/ directory.
  // The compiled keys are placed in public/managed/brainfit/ after running compact compile.
  const zkConfigPath = typeof window !== 'undefined' ? window.location.origin : ''
  const zkConfigProvider = new FetchZkConfigProvider<BrainFitCircuitKeys>(
    zkConfigPath,
    typeof window !== 'undefined' ? fetch.bind(window) : fetch,
  )

  const privateStateProvider = inMemoryPrivateStateProvider<PrivateStateId, BrainFitPrivateState>()

  return {
    privateStateProvider,
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proverServerUri!, zkConfigProvider),
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),

    walletProvider: {
      getCoinPublicKey(): string {
        return addresses.shieldedCoinPublicKey
      },
      getEncryptionPublicKey(): string {
        return addresses.shieldedEncryptionPublicKey
      },
      async balanceTx(tx: UnboundTransaction, _ttl?: Date): Promise<FinalizedTransaction> {
        logger?.info('Balancing transaction via Lace wallet')
        const serialized = toHex(tx.serialize())
        const received = await connectedAPI.balanceUnsealedTransaction(serialized)
        // Re-import Transaction type at runtime from ledger package
        const { Transaction: LedgerTx } = await import('@midnight-ntwrk/ledger-v7')
        return LedgerTx.deserialize<SignatureEnabled, Proof, Binding>(
          'signature', 'proof', 'binding',
          fromHex(received.tx),
        )
      },
    },

    midnightProvider: {
      async submitTx(tx: FinalizedTransaction): Promise<TransactionId> {
        await connectedAPI.submitTransaction(toHex(tx.serialize()))
        const ids = tx.identifiers()
        logger?.info({ txIds: ids }, 'Transaction submitted')
        return ids[0]
      },
    },
  }
}

// ─── Contract service ─────────────────────────────────────────────────────────

export class BrainFitContractService {
  readonly contractAddress: ContractAddress

  private constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly deployedContract: any,
    private readonly logger?: Logger,
  ) {
    this.contractAddress = deployedContract.deployTxData.public.contractAddress
    // Persist contract address so user can reconnect without redeploying
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONTRACT_ADDRESS_STORAGE_KEY, this.contractAddress)
    }
  }

  // ── Factory methods ─────────────────────────────────────────────────────────

  /** Deploy a new BrainFit contract for this player. ~30–60s on preprod. */
  static async deploy(providers: BrainFitProviders, logger?: Logger): Promise<BrainFitContractService> {
    logger?.info('Deploying BrainFit contract to Midnight preprod…')

    const privateState = await BrainFitContractService.getOrCreatePrivateState(providers)

    const deployed = await deployContract(providers, {
      compiledContract: CompiledBrainFitContract,
      privateStateId: BRAINFIT_PRIVATE_STATE_KEY,
      initialPrivateState: privateState,
    })

    logger?.info(
      { contractAddress: deployed.deployTxData.public.contractAddress },
      'BrainFit contract deployed',
    )

    return new BrainFitContractService(deployed, logger)
  }

  /** Join a previously deployed contract by address. */
  static async join(
    providers: BrainFitProviders,
    contractAddress: ContractAddress,
    logger?: Logger,
  ): Promise<BrainFitContractService> {
    logger?.info({ contractAddress }, 'Joining existing BrainFit contract')

    const privateState = await BrainFitContractService.getOrCreatePrivateState(providers)

    const found = await findDeployedContract(providers, {
      contractAddress,
      compiledContract: CompiledBrainFitContract,
      privateStateId: BRAINFIT_PRIVATE_STATE_KEY,
      initialPrivateState: privateState,
    })

    return new BrainFitContractService(found, logger)
  }

  /** Get the saved contract address from localStorage (if any). */
  static getSavedContractAddress(): ContractAddress | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(CONTRACT_ADDRESS_STORAGE_KEY) as ContractAddress | null
  }

  // ── Game circuits ───────────────────────────────────────────────────────────

  /** Record a completed game — sets playerPublicIdentity + increments gamesPlayed. */
  async recordGameCompleted(): Promise<string> {
    this.logger?.info('Circuit: recordGameCompleted')
    const tx = await this.deployedContract.callTx.recordGameCompleted()
    return tx.public.txHash
  }

  // ── Achievement claim circuits ──────────────────────────────────────────────

  async claimPioneer(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimPioneer()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Pioneer')
    return tx.public.txHash
  }

  async claimMemoryMaster(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimMemoryMaster()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Memory Master')
    return tx.public.txHash
  }

  async claimLogicSolver(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimLogicSolver()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Logic Solver')
    return tx.public.txHash
  }

  async claimHighPerformer(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimHighPerformer()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: High Performer')
    return tx.public.txHash
  }

  async claimSpeedDemon(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimSpeedDemon()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Speed Demon')
    return tx.public.txHash
  }

  async claimCompletionist(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimCompletionist()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Completionist')
    return tx.public.txHash
  }

  async claimDedicated(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimDedicated()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Dedicated')
    return tx.public.txHash
  }

  async claimBrainLegend(): Promise<string> {
    const tx = await this.deployedContract.callTx.claimBrainLegend()
    this.logger?.info({ txHash: tx.public.txHash }, 'NFT claimed: Brain Legend')
    return tx.public.txHash
  }

  // ── Caregiver circuits ──────────────────────────────────────────────────────

  async grantCaregiverAccess(caregiverPublicKey: Uint8Array): Promise<string> {
    const tx = await this.deployedContract.callTx.grantCaregiverAccess(caregiverPublicKey)
    this.logger?.info({ txHash: tx.public.txHash }, 'Caregiver access granted')
    return tx.public.txHash
  }

  async revokeCaregiverAccess(): Promise<string> {
    const tx = await this.deployedContract.callTx.revokeCaregiverAccess()
    this.logger?.info({ txHash: tx.public.txHash }, 'Caregiver access revoked')
    return tx.public.txHash
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private static async getOrCreatePrivateState(
    providers: BrainFitProviders,
  ): Promise<BrainFitPrivateState> {
    const existing = await providers.privateStateProvider.get(BRAINFIT_PRIVATE_STATE_KEY)
    if (existing) return existing

    // Generate a new 32-byte secret key using Web Crypto
    const secretKey = new Uint8Array(32)
    crypto.getRandomValues(secretKey)
    return createBrainFitPrivateState(secretKey)
  }
}

// ─── Map achievement IDs to circuit methods ───────────────────────────────────

type ClaimMethod = (svc: BrainFitContractService) => Promise<string>

export const ACHIEVEMENT_CIRCUIT_MAP: Record<string, ClaimMethod> = {
  pioneer:       (svc) => svc.claimPioneer(),
  memory_master: (svc) => svc.claimMemoryMaster(),
  puzzle_solver: (svc) => svc.claimLogicSolver(),
  high_scorer:   (svc) => svc.claimHighPerformer(),
  speed_demon:   (svc) => svc.claimSpeedDemon(),
  completionist: (svc) => svc.claimCompletionist(),
  dedicated:     (svc) => svc.claimDedicated(),
  legend:        (svc) => svc.claimBrainLegend(),
}

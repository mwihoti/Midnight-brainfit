/**
 * BrainFit contract exports.
 *
 * IMPORTANT — Compile the contract before using this module:
 *
 *   npx compact compile src/brainfit.compact ./src/managed/brainfit
 *
 * The compiler generates `./src/managed/brainfit/contract/index.ts` which
 * exports the Contract, Ledger, and circuit types used below.
 *
 * After compilation, uncomment the managed imports.
 */

// ─── Generated output (uncomment after running `compact compile`) ─────────────
// export * from './managed/brainfit/contract/index.js'
// import * as CompiledBrainFit from './managed/brainfit/contract/index.js'

// ─── Hand-written exports (always present) ────────────────────────────────────
export * from './witnesses.js'
export type { BrainFitPrivateState } from './witnesses.js'

// ─── Compiled contract factory ────────────────────────────────────────────────
// Uncomment and replace the stub after compilation.

/*
import { CompiledContract } from '@midnight-ntwrk/compact-runtime'
import { witnesses, type BrainFitPrivateState } from './witnesses.js'

export const CompiledBrainFitContract = CompiledContract.make<
  CompiledBrainFit.Contract<BrainFitPrivateState>
>(
  'BrainFit',
  CompiledBrainFit.Contract<BrainFitPrivateState>,
)
  .pipe(CompiledContract.withWitnesses(witnesses))
  .pipe(CompiledContract.withCompiledFileAssets('./managed/brainfit'))
*/

// ─── Stub (remove once compiled) ─────────────────────────────────────────────
// This stub lets TypeScript compile before the Compact compiler has run.
// Replace with the real CompiledContract.make() call above after compilation.
// Typed as unknown to avoid depending on a specific SDK type that may not
// exist in the installed version of midnight-js-contracts.

export const CompiledBrainFitContract = null as unknown

// ─── Achievement circuit key type ─────────────────────────────────────────────
// These are the names of the impure circuits exported by brainfit.compact.
// Keep in sync with the circuit names in brainfit.compact.

export type BrainFitCircuitKeys =
  | 'recordGameCompleted'
  | 'claimPioneer'
  | 'claimMemoryMaster'
  | 'claimLogicSolver'
  | 'claimHighPerformer'
  | 'claimSpeedDemon'
  | 'claimCompletionist'
  | 'claimDedicated'
  | 'claimBrainLegend'
  | 'grantCaregiverAccess'
  | 'revokeCaregiverAccess'

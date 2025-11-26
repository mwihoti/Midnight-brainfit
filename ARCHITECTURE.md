# GameFit MVP - Architecture & Design Document

## Executive Summary

GameFit is a privacy-first cognitive health tracker designed specifically for dementia care using Midnight blockchain. The MVP combines two engaging mini-games (Memory and Puzzle) with encrypted progress tracking and secure caregiver access.

**Key Value Proposition**: Healthcare-grade privacy + accessible cognitive training = trusted dementia care solution.

## System Architecture

### Frontend Stack
```
React 18 (TypeScript)
├── Components (Game UI + Dashboard)
├── Services (Game Logic + Midnight Integration)
├── Hooks (State Management + Wallet)
└── Types (Full Type Safety)
```

### Game Engines
```
Memory Game
├── Dynamic card generation (2-8 pairs)
├── Flip animation + matching logic
├── Score calculation (difficulty × accuracy × time)
└── Auto-difficulty adjustment

Puzzle Game
├── Tile generation (4x4 to 7x7)
├── Drag/drop swap mechanics
├── Progress tracking + target visualization
└── Performance-based difficulty
```

### Midnight Integration
```
Player Privacy
├── Wallet connection (Lace/MetaMask)
├── Game metrics encryption
├── ZK proof verification
└── Caregiver access control

Backend Services (to implement)
├── Midnight SDK integration
├── Encrypted data storage
├── Smart contract execution
└── Off-chain metadata
```

## Data Flow

### Game Completion Flow
```
1. Player completes game
   ↓
2. Calculate score (game logic service)
   ↓
3. Encrypt metrics (Midnight service)
   ↓
4. Store on-chain (Midnight blockchain)
   ↓
5. Update cognitive metrics (ZK aggregation)
   ↓
6. Show completion + dashboard update
```

### Caregiver Access Flow
```
1. Patient grants access to caregiver wallet
   ↓
2. Create ZK proof of permission
   ↓
3. Store encrypted access token
   ↓
4. Caregiver verifies permission
   ↓
5. Receive summary metrics (not individual games)
   ↓
6. View trends + patterns
```

## Key Components

### MemoryGame.tsx
- Grid-based card matching
- Flipping animation
- Pair detection
- Move/time tracking
- Score calculation

### PuzzleGame.tsx
- Grid-based tile arrangement
- Drag-and-swap mechanics
- Target pattern display
- Progress bar
- Difficulty indicator

### WalletConnector.tsx
- MetaMask/Lace wallet integration
- Balance display
- Connect/disconnect actions
- Error handling

### PerformanceDashboard.tsx
- 4-metric display (Attention, Memory, Processing, Accuracy)
- Trend visualization (improving/stable/declining)
- Overall score aggregation
- Best category indicator

### CaregiverAccessControl.tsx
- Email/wallet input for caregiver
- Access level selection (Viewer/Editor)
- Active permissions list
- Revoke functionality

## Scoring System

### Memory Game Score Formula
```
Score = DifficultyBonus + TimeBonus + AccuracyBonus
       = (difficulty × 100) + max(0, 600 - timeSpent × 10) + (movesRatio × 200)

Range: 0-2000+ points
```

### Puzzle Game Score Formula
```
Score = DifficultyBonus + TimeBonus + EfficiencyBonus
       = (difficulty × 150) + max(0, 600 - timeSpent × 10) + max(0, (1000 - moves × 5) × 0.5)

Range: 0-2000+ points
```

### Difficulty Adjustment
```
if lastScore > 800 && currentDifficulty < 4
  → increase difficulty
else if lastScore < 400 && currentDifficulty > 1
  → decrease difficulty
else
  → maintain current difficulty
```

## State Management (Zustand)

```typescript
useGameStore {
  // Player State
  currentPlayer: PlayerProfile
  walletAddress: string
  isAuthenticated: boolean
  
  // Game State
  gameScores: GameScore[]
  cognitiveMetrics: CognitiveMetrics
  
  // Actions
  setWalletAddress()
  setPlayerProfile()
  addGameScore()
  updateCognitiveMetrics()
  logout()
}
```

## Midnight Blockchain Integration

### Data Structures

```typescript
EncryptedGameData {
  encryptedMetrics: string        // Game score encrypted
  commitment: string              // ZK commitment
  nonce: string                   // Random nonce
  timestamp: number               // Block timestamp
}

EncryptedUserState {
  encryptedProfile: string        // User profile encrypted
  encryptedMetrics: EncryptedGameData
  zkProof: string                 // Zero-knowledge proof
}
```

### Privacy Guarantees

1. **End-to-End Encryption**: Game data encrypted before leaving client
2. **Zero-Knowledge Proofs**: Verify without revealing data
3. **Decentralized Storage**: Data on Midnight, not centralized server
4. **User Control**: Only data owner can grant access
5. **Anonymous Caregivers**: Caregiver receives aggregated metrics only

## Security Considerations

### Frontend Security
- No private keys stored in localStorage
- Wallet connection via MetaMask/Lace (secure)
- HTTPS only for API calls
- Input validation + sanitization
- XSS protection via React

### Backend Security
- Midnight smart contracts audit required
- Rate limiting on API endpoints
- Access token validation (ZK proofs)
- CORS configuration
- API key rotation

### Data Privacy
- Encryption keys never transmitted
- Metrics encrypted at rest
- Caregivers never see raw game data
- Audit logs on blockchain

## Performance Considerations

### Frontend Optimization
- Code splitting for game components
- Lazy loading for dashboard
- Memoization of game components
- CSS-in-JS optimizations
- Image optimization for cards/tiles

### Blockchain Optimization
- Batch metrics updates (daily)
- Compressed data format
- Off-chain computation (ZK proofs)
- Indexing for fast lookups

## MVP Scope

### ✅ Included
- 2 fully playable games (Memory + Puzzle)
- Wallet connection (Lace)
- Caregiver access control UI
- Performance dashboard
- Auto-difficulty adjustment
- Encrypted metrics service layer

### 🚀 Phase 2
- Backend Midnight integration
- Smart contract deployment
- Mobile app (React Native)
- Advanced analytics
- Multi-game library
- AI-powered recommendations

### 📋 Future Enhancements
- Leaderboards (privacy-preserving)
- Achievements/Badges
- Social features (anonymous communities)
- Healthcare provider integrations
- EHR system integration
- Research data partnerships

## Deployment

### Frontend Deployment
- Vercel (recommended)
- Netlify (alternative)
- AWS S3 + CloudFront (enterprise)

### Backend Deployment
- Node.js server on Heroku/Railway
- Middleware for Midnight calls
- PostgreSQL for metadata
- Redis for caching

### Blockchain
- Midnight testnet (MVP)
- Midnight mainnet (production)
- Contract verification required

## Testing Strategy

### Unit Tests
- Game logic (memory/puzzle scoring)
- Difficulty adjustment algorithm
- Component rendering

### Integration Tests
- Wallet connection flow
- Game completion + storage
- Caregiver access grant

### E2E Tests
- Full user journey (sign up → play → dashboard)
- Caregiver viewing metrics
- Access revocation

## Success Metrics

- 1000+ active users in first month
- 10+ games played per active user (daily engagement)
- 4.5+ app rating
- <2 second load time
- <0.1% error rate on game saves

## Timeline

- **Week 1-2**: Frontend MVP (games + UI)
- **Week 3-4**: Backend + Midnight integration
- **Week 5-6**: Testing + deployment
- **Week 7+**: User feedback + iterations

---

**Document**: GameFit MVP Architecture v1.0
**Last Updated**: November 26, 2025
**Status**: Ready for Development

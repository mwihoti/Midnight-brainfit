# GameFit - MVP

Private Cognitive Health Tracker for Dementia powered by Midnight Blockchain

## Overview

GameFit is an MVP that combines engaging cognitive games with privacy-preserving blockchain technology to help patients with dementia and individuals seeking to improve their cognitive health. The platform leverages Midnight blockchain to keep all data encrypted while enabling secure caregiver access.
 Link: https://brainfit.vercel.app/

## Features

### 🎮 Patient App
- **Memory Game**: Match card pairs to improve memory recall
- **Puzzle Game**: Arrange tiles to enhance problem-solving
- **Auto-Adjusting Difficulty**: Games adapt based on performance
- **Daily Engagement**: One game per day to maintain cognitive health
- **Private Tracking**: All progress encrypted on Midnight

### 🧠 Cognitive Benefits
- ✅ Improved memory recall
- ✅ Enhanced executive functions
- ✅ Increased cognitive processing speed
- ✅ Enhanced critical thinking skills
- ✅ Improved focus and concentration
- ✅ Lower risk of age-related cognitive decline

### 🔐 Midnight Integration
- **Encrypted Metrics**: Game scores stored encrypted on-chain
- **Zero-Knowledge Proofs**: Verify caregiver permissions without exposing data
- **Private Identity**: Patient identity never revealed to caregivers
- **Secure State**: User state encrypted with commitment proofs

### 👨‍👩‍👧 Caregiver Dashboard
- **Attention Score Trends**: Monitor attention performance over time
- **Memory Decline Patterns**: Track memory metrics with visual trends
- **Engagement Levels**: See how consistently the patient plays
- **No Personal Data Leakage**: Only summary metrics, no individual game data
- **Permission Control**: Grant/revoke access to specific caregivers

### 💳 Wallet Integration
- **Lace Wallet Support**: Connect securely with your wallet
- **Multi-Chain Ready**: Support for Midnight and Cardano networks
- **User Control**: Full control over data access permissions

## Project Structure

```
gamefit/
├── src/
│   ├── components/
│   │   ├── MemoryGame.tsx          # Memory matching game
│   │   ├── PuzzleGame.tsx          # Tile arrangement puzzle
│   │   ├── WalletConnector.tsx     # Wallet connection UI
│   │   ├── PerformanceDashboard.tsx # Cognitive metrics display
│   │   └── CaregiverAccessControl.tsx # Permission management
│   ├── pages/
│   │   └── GameApp.tsx             # Main app container
│   ├── services/
│   │   ├── midnight.ts            # Midnight blockchain integration
│   │   └── gameLogic.ts           # Game mechanics & scoring
│   ├── hooks/
│   │   ├── useGameStore.ts        # Zustand store
│   │   └── useWallet.ts           # Wallet connection hook
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Blockchain**: Midnight + Ethers.js
- **Build Tool**: Vite
- **Icons**: Lucide React

## Installation

```bash
cd gamefit
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Build

```bash
npm run build
```

## Game Mechanics

### Memory Game
- **Levels**: 1-4 (2-8 pairs)
- **Scoring**: Based on difficulty, time, and accuracy
- **Auto-Adjust**: Difficulty increases if score > 800, decreases if < 400

### Puzzle Game
- **Levels**: 1-4 (4x4 to 7x7 grid)
- **Objective**: Arrange tiles in correct order
- **Scoring**: Based on difficulty, time, and minimal moves

## Privacy & Security

1. **Data Encryption**: All game metrics encrypted before storage
2. **Zero-Knowledge Proofs**: Verify permissions without exposing data
3. **Identity Privacy**: Caregivers never see patient identity
4. **User Control**: Patients control who can see what data
5. **Blockchain**: Immutable audit trail on Midnight

## Midnight Integration Points

### Endpoints (Backend)
- `POST /api/midnight/encrypt` - Encrypt game metrics
- `POST /api/midnight/store` - Store encrypted data on-chain
- `GET /api/midnight/metrics/:address` - Calculate cognitive metrics
- `POST /api/midnight/grant-access` - Grant caregiver access
- `POST /api/midnight/verify-access` - Verify with zero-knowledge proof
- `GET /api/midnight/user-state/:address` - Get encrypted user state

## Next Steps

1. **Backend**: Implement Midnight integration endpoints
2. **Smart Contracts**: Deploy ZK proof contracts on Midnight
3. **Testing**: Unit tests for game logic & scoring
4. **Mobile**: React Native version for mobile devices
5. **AI**: ML-based difficulty adjustment algorithm
6. **Analytics**: Privacy-preserving analytics dashboard

## Target Users

- 👴 Patients with early dementia
- 👵 Elderly individuals seeking cognitive maintenance
- 👨‍⚕️ Psychologists and neurologists
- 🏥 Dementia care centers
- 🏠 Assisted living facilities
- 👨‍👩‍👧 Families caring for loved ones

## Business Model

- **Freemium**: Basic 1 game/day for free
- **Premium**: Unlimited games, advanced metrics ($9.99/month)
- **Caregiver**: Professional caregiver access ($19.99/month)
- **Enterprise**: Hospital/Care center integration (custom)

## Contributing

This is an MVP. Contributions welcome!

## License

Proprietary - GameFit MVP

## Contact

Daniel - BrainFit Startups

---

**GameFit**: Because cognitive health shouldn't require compromising privacy.

# GameFit MVP - Quick Start Guide

## 🎯 Project at a Glance

**GameFit** is a **privacy-preserving cognitive health tracker** for dementia care powered by Midnight blockchain.

**What you get**:
- ✅ Two fully functional games (Memory + Puzzle)
- ✅ Encrypted metrics storage
- ✅ Caregiver access control
- ✅ Performance dashboard
- ✅ Wallet integration (Lace)
- ✅ Professional UI/UX

**Current Status**: Frontend MVP complete, ready for backend integration

---

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
cd /home/daniel/work/startups/brainfit/gamefit
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Opens automatically at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

Output: `dist/` folder ready to deploy

---

## 📂 File Structure Overview

```
gamefit/
├── src/components/           # React UI components
│   ├── MemoryGame.tsx       # Card matching game
│   ├── PuzzleGame.tsx       # Tile puzzle game
│   ├── PerformanceDashboard.tsx  # Metrics display
│   ├── CaregiverAccessControl.tsx # Permission management
│   └── WalletConnector.tsx  # Wallet integration
│
├── src/services/
│   ├── midnight.ts          # Blockchain integration (API layer)
│   └── gameLogic.ts         # Game scoring & mechanics
│
├── src/hooks/
│   ├── useGameStore.ts      # Zustand state management
│   └── useWallet.ts         # Web3 wallet connection
│
├── src/types/index.ts       # TypeScript definitions
├── src/App.tsx              # Main app container
├── src/main.tsx             # React entry point
├── src/index.css            # Tailwind styles
│
├── README.md                # Project overview
├── ARCHITECTURE.md          # Design decisions
├── IMPLEMENTATION.md        # Complete reference
├── package.json             # Dependencies
├── vite.config.ts           # Build config
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Styling
└── index.html               # HTML template
```

---

## 🎮 How It Works

### For Players

1. **Connect Wallet**: Click "Connect Wallet" → Select MetaMask/Lace
2. **Choose Game**: Memory or Puzzle
3. **Play**: Games auto-adjust difficulty
4. **View Results**: See score breakdown
5. **View Dashboard**: Track cognitive metrics
6. **Grant Access**: Optional - let caregivers monitor progress

### For Caregivers

1. **Receive Invite**: Patient grants access
2. **Connect Wallet**: Verify permission
3. **View Dashboard**: See summary metrics only
4. **Monitor Trends**: Track attention, memory, speed
5. **No Raw Data**: Individual games never exposed

---

## 🔐 Privacy Architecture

### End-to-End Encryption

```
Player Score
    ↓
Encrypt (Midnight SDK)
    ↓
Send to Backend
    ↓
Store on Midnight Blockchain
    ↓
Create Zero-Knowledge Proof
    ↓
Caregiver: Verify → See Only Summary
```

**Key Guarantee**: Caregivers verify permissions with ZK proofs, never see patient identity or raw game data.

---

## 🎯 Game Mechanics

### Memory Game
- **Goal**: Match all card pairs
- **Scoring**: Based on difficulty × time × accuracy
- **Auto-Adjust**: Harder if you score well, easier if struggling
- **Levels**: 1-4 (4-16 cards)

### Puzzle Game
- **Goal**: Arrange tiles in correct order
- **Scoring**: Based on difficulty × time × efficiency
- **Auto-Adjust**: Progressive difficulty scaling
- **Levels**: 1-4 (4x4 to 7x7 grids)

---

## 🛠️ Customization

### Change Game Difficulty
**File**: `src/services/gameLogic.ts`

```typescript
// Line 6: Adjust pair counts
const pairCounts: Record<number, number> = {
  1: 2,  // Change to 3 for more cards
  2: 4,
  3: 6,
  4: 8,
};
```

### Change Scoring Formula
**File**: `src/services/gameLogic.ts`

```typescript
// Around line 60: Modify calculateMemoryScore()
export const calculateMemoryScore = (difficulty, timeSpent, moves, matchesFound) => {
  // Adjust these multipliers:
  const difficultyBonus = difficulty * 100;  // Change 100
  const timeBonus = Math.max(0, 600 - timeSpent * 10);  // Adjust 600 & 10
  const accuracyBonus = movesRatio * 200;  // Change 200
};
```

### Customize UI Colors
**File**: `tailwind.config.js` or individual component files

```typescript
// Change from blue to your color
<div className="bg-blue-500">  // → bg-purple-500, bg-green-500, etc
```

---

## 🔗 API Integration (For Backend)

The frontend expects these endpoints:

```
POST   /api/midnight/encrypt
POST   /api/midnight/store
GET    /api/midnight/metrics/:address
POST   /api/midnight/grant-access
POST   /api/midnight/verify-access
GET    /api/midnight/user-state/:address
```

See `src/services/midnight.ts` for implementation details.

Example backend skeleton: `server.example.ts`

---

## 📊 State Management

All app state uses **Zustand**:

```typescript
import { useGameStore } from '@/hooks/useGameStore';

// In your component:
const { walletAddress, gameScores, addGameScore } = useGameStore();
```

**No Redux, no Context** - much simpler!

---

## 🧪 Testing Games

### Memory Game Testing
1. Open app → Click "Memory Game"
2. Try different difficulty levels
3. Check score calculation accuracy
4. Verify auto-difficulty adjustment

### Puzzle Game Testing
1. Open app → Click "Puzzle Game"
2. Try arranging tiles
3. Check move counting
4. Verify time tracking

### Wallet Integration Testing
1. Install MetaMask/Lace
2. Click "Connect Wallet"
3. Approve connection
4. Verify address displays

---

## 🚀 Next Steps

### To Get to Production

1. **Implement Backend** (2-3 days)
   - Express server with Midnight SDK
   - Database for user profiles
   - Smart contract for ZK proofs

2. **Deploy Blockchain** (1-2 days)
   - Smart contracts to Midnight testnet
   - Test end-to-end flow
   - Audit security

3. **Launch** (1 day)
   - Frontend to Vercel
   - Backend to Railway
   - Domain configuration

### Estimated Timeline
- **Week 1**: Backend implementation
- **Week 2**: Testing + security audit
- **Week 3**: Launch to production

---

## 📞 Common Issues & Solutions

### "Cannot find module 'react'"
**Solution**: Run `npm install` again, ensure dependencies installed

### Wallet not connecting
**Solution**: Install MetaMask/Lace extension, refresh page

### Games not loading
**Solution**: Check browser console for errors, ensure Vite dev server running

### Slow performance
**Solution**: Check CPU/RAM usage, close other tabs, try production build

---

## 📚 Documentation Files

- **README.md** - Project overview & features
- **ARCHITECTURE.md** - Design decisions & system architecture
- **IMPLEMENTATION.md** - Complete implementation reference
- **QUICK_START.md** - This file

---

## 🎨 Design System

### Colors
- **Primary**: Purple (#a855f7)
- **Secondary**: Blue (#3b82f6)
- **Accent**: Green (#22c55e)
- **Dark**: Slate (#0f172a)

### Typography
- **Headings**: 24-48px, bold
- **Body**: 16px, regular
- **Small**: 12-14px, secondary

### Spacing
- Base unit: 4px
- Padding: 4, 8, 16, 24, 32px
- Gaps: 8, 16, 24px

---

## 🤝 Contributing

This is an MVP. To contribute:

1. Fork/clone repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 💡 Key Technologies

| Tech | Why |
|------|-----|
| React 18 | Modern UI framework |
| TypeScript | Type-safe code |
| Tailwind CSS | Fast styling |
| Zustand | Simple state management |
| Vite | Lightning-fast builds |
| Midnight | Privacy-preserving blockchain |
| Ethers.js | Web3 connectivity |

---

## 📞 Support

**Questions?**
- Check `ARCHITECTURE.md` for design decisions
- Check `IMPLEMENTATION.md` for detailed reference
- Review component comments in source code
- Open GitHub issue for bugs

---

## ✅ MVP Checklist

Frontend Complete:
- [x] Memory Game fully functional
- [x] Puzzle Game fully functional
- [x] Scoring system implemented
- [x] Auto-difficulty working
- [x] Wallet UI connected
- [x] Dashboard UI built
- [x] Caregiver access UI built
- [x] Responsive design
- [x] Dark theme

Backend TODO:
- [ ] Express server
- [ ] Midnight integration
- [ ] Smart contracts
- [ ] Database
- [ ] API endpoints
- [ ] Testing

---

**Ready to build the future of dementia care? Let's go! 🚀**

For more details, see:
- `README.md` - Overview
- `ARCHITECTURE.md` - System design
- `IMPLEMENTATION.md` - Complete reference

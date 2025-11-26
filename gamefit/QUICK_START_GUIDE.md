# GameFit Quick Start Guide

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- Git (for version control)

### Installation & Setup

```bash
# 1. Navigate to project
cd /home/daniel/work/startups/brainfit/gamefit

# 2. Install dependencies (already done)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## 🎮 Project Structure at a Glance

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router pages |
| `components/` | React components (MemoryGame, PuzzleGame, etc) |
| `lib/` | Business logic (store, services) |
| `public/` | Static assets |
| `package.json` | Dependencies & scripts |

## 🚀 Available Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Create optimized build
npm run start        # Run production server

# Quality
npm run lint         # Check code with ESLint
```

## 📁 Core Files Reference

### Pages (Entry Points)
- `/` - Home page with game selection
- `/player` - Player game hub
- `/player/memory` - Memory game
- `/player/puzzle` - Puzzle game
- `/caregiver` - Caregiver dashboard

### Components (Reusable UI)
```
MemoryGame.tsx      - Card matching game logic
PuzzleGame.tsx      - Tile puzzle game logic
WalletConnector.tsx - Wallet connection UI
CaregiverControl.tsx- Access permission UI
GameResults.tsx     - Game completion results
```

### Services (Business Logic)
```
lib/store.ts                    - Zustand state management
lib/services/gameService.ts     - Game initialization & scoring
lib/services/midnightService.ts - Blockchain & encryption
```

## 🎯 Game Logic Overview

### Memory Game
- 4x4 grid of hidden cards
- Click to flip and find pairs
- Score based on moves and time
- Completes when all pairs matched

### Puzzle Game
- 4x4 grid with numbered tiles
- Click adjacent to swap with empty space
- Solve by arranging numbers 1-16
- Score based on efficiency

## 🔐 Security Features

- **Encryption**: Midnight blockchain for data security
- **Access Control**: Permission-based caregiver access
- **ZK Proofs**: Zero-knowledge proofs for privacy
- **Wallet Auth**: Lace wallet integration ready

## 📊 State Management Example

```typescript
// Using the game store
import { useGameStore } from '@/lib/store'

function GameComponent() {
  const store = useGameStore()
  
  const startGame = () => {
    store.startGame('memory')
  }
  
  const endGame = () => {
    store.endGame(score, timeSpent)
  }
  
  return <div>Score: {store.score}</div>
}
```

## 🐛 Debugging Tips

### Check console
```bash
npm run dev
# Errors appear in terminal
```

### TypeScript errors
```bash
# Verify types without building
npm run type-check  # (add to package.json if needed)
```

### Clear cache if stuck
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📈 Scaling Next Steps

### Phase 1 (Current)
✅ MVP with 2 games
✅ Basic player & caregiver roles
✅ Local state management

### Phase 2 (Next)
⏳ Connect real Midnight blockchain
⏳ Implement API routes
⏳ Add database persistence

### Phase 3 (Future)
⏳ Mobile app (React Native)
⏳ Real-time multiplayer
⏳ Advanced analytics dashboard

## 🔗 Important URLs

- **Development**: http://localhost:3000
- **Next.js Docs**: https://nextjs.org
- **Tailwind Docs**: https://tailwindcss.com
- **Midnight Blockchain**: https://midnightxyz.com
- **Zustand Docs**: https://github.com/pmndrs/zustand

## 💾 Data Flow

```
Player Action
    ↓
React Component (MemoryGame.tsx)
    ↓
Zustand Store (lib/store.ts)
    ↓
Game Service (lib/services/gameService.ts)
    ↓
Display Results
    ↓
Encrypt & Store (Midnight)
```

## 🚨 Common Issues & Fixes

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
npm run dev
```

### Module not found
```bash
# Verify path uses @ alias correctly
import { something } from '@/components/...' // ✅
import { something } from './components/...' // ❌
```

### TypeScript errors in editor
- Reload VS Code: Cmd/Ctrl + Shift + P → "Reload Window"
- Or restart the TypeScript server

## 📝 Next.js-Specific Notes

- **App Router** (not Pages Router) - `/app` directory is main
- **Server Components** by default (use `'use client'` for interactive)
- **Dynamic imports** for code splitting
- **Built-in API routes** at `/app/api/*`
- **Automatic code splitting** - no manual bundling needed

## 🎓 Learning Resources

1. **Game Logic**
   - See `lib/services/gameService.ts` for scoring
   - See components for UI implementation

2. **State Management**
   - See `lib/store.ts` for Zustand setup
   - Check component usage for examples

3. **Blockchain Integration**
   - See `lib/services/midnightService.ts`
   - Placeholders ready for real implementation

## ✨ Pro Tips

- Use `npm run dev` for hot reload during development
- TypeScript provides autocomplete - trust the IDE hints
- Check `app/globals.css` for shared styles
- Use Lucide React icons: `import { Icon } from 'lucide-react'`
- Tailwind classes provide responsive design: `md:grid-cols-2`

---

**Happy coding! 🚀 Start the dev server with `npm run dev`**

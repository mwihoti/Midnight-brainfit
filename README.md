# BrainFit

Brain training games for everyone — kids, adults, and developers.
Memory matching and sliding puzzles with private score tracking powered by the Midnight blockchain.

**Live:** https://brainfit.vercel.app/

---

## What it is

BrainFit is a brain training game that runs on the web, as a browser extension, and inside VS Code. Players earn on-chain achievement NFTs for hitting milestones. All score data is encrypted before it leaves the device — no account required, no data sold.

---

## Games

| Game | Objective | Scoring |
|---|---|---|
| Memory Match | Flip cards to find matching symbol pairs | Faster + fewer moves = higher score |
| Sliding Puzzle | Slide tiles into correct order | Faster + fewer moves = higher score |

Both games randomise their content on every reset — the symbol set in Memory Match is picked fresh from a pool of 24 each round.

---

## Features

- **Achievement NFTs** — earn badges on Midnight preprod for hitting milestones (first game, speed runs, high scores, completionist)
- **Private by design** — scores are AES-256-GCM encrypted before any network call; the chain sees only the proof
- **Offline-first** — the game works fully without a wallet; NFTs are stored locally and synced when a connection is available
- **Guest mode** — play instantly without installing anything; connect a Lace wallet to pin progress on-chain
- **Family Access** — share achievements with a parent, friend, or coach via zero-knowledge permission grants (requires on-chain contract, coming soon)

---

## Distribution

| Target | Status | How |
|---|---|---|
| Web app | Live | Deploy to Vercel / any Node host |
| Browser extension | Ready to build | `bun run build:extension`, load `out/` as unpacked extension |
| VS Code extension | Planned | See `EXTENSION_PLAN.md` |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Blockchain | Midnight (preprod) |
| Icons | Lucide React |
| Package manager | Bun |

---

## Project structure

```
/
├── app/
│   ├── page.tsx                  # Home / landing
│   ├── layout.tsx                # Root layout + metadata
│   ├── globals.css
│   ├── providers.tsx             # Error boundary
│   ├── player/
│   │   ├── page.tsx              # Game hub + stats
│   │   ├── memory/page.tsx       # Memory game page
│   │   ├── puzzle/page.tsx       # Puzzle game page
│   │   └── nfts/page.tsx         # NFT collection
│   └── caregiver/page.tsx        # Family Access (under development)
├── components/
│   ├── MemoryGame.tsx
│   ├── PuzzleGame.tsx
│   ├── GameResults.tsx
│   ├── WalletConnector.tsx
│   ├── NFTBadge.tsx
│   ├── NFTCollection.tsx
│   ├── NFTMintModal.tsx
│   └── CaregiverControl.tsx
├── lib/
│   ├── store.ts                  # Zustand game store
│   ├── services/
│   │   ├── gameService.ts        # Game logic + scoring
│   │   ├── nftService.ts         # Achievement minting
│   │   └── midnightService.ts    # Encryption + chain calls
│   ├── midnight/
│   │   ├── contractService.ts    # BrainFit Midnight contract
│   │   ├── walletService.ts      # Lace wallet connector
│   │   └── privateStateProvider.ts
│   └── shims/
│       └── isomorphic-ws.js      # Browser WebSocket shim
├── contracts/
│   └── src/
│       ├── brainfit.compact      # Compact contract source
│       ├── index.ts              # Contract exports (stub until compiled)
│       └── witnesses.ts          # Private state definition
├── public/
│   └── manifest.json             # Browser extension manifest (MV3)
├── EXTENSION_PLAN.md             # Browser + VS Code extension roadmap
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting started

```bash
# Install dependencies
bun install

# Start dev server
bun dev
# → http://localhost:3000
```

---

## Building

```bash
# Web app
bun run build

# Browser extension (static export → out/)
bun run build:extension
# Then load out/ as an unpacked extension in chrome://extensions
```

---

## Midnight contract

The on-chain contract is written in Compact. It is not yet compiled — the app runs fully in local mode until it is.

```bash
# 1. Compile the contract (requires Compact compiler)
bun run compact:compile

# 2. Copy ZK keys to public/
bun run compact:copy-keys

# 3. Re-enable setupContract in components/WalletConnector.tsx
# 4. Re-enable mintOnChainViaContract in lib/services/nftService.ts
```

---

## Monetisation plan

| Tier | Price | What you get |
|---|---|---|
| Free | — | Both games, local NFTs, unlimited play |
| Paid NFTs | Per achievement | Hard-to-earn on-chain badges (Speed Demon, Brain Legend, etc.) |
| VS Code Pro | ~$4/month | Unlimited play, streaks, leaderboard inside the editor |
| Family plan | ~$5/month | Family Access dashboard for up to 4 players |

---

## Roadmap

- [ ] Compile Compact contract and enable on-chain minting
- [ ] Browser extension — submit to Chrome Web Store and Firefox Add-ons
- [ ] VS Code extension — scaffold, publish to Marketplace
- [ ] Difficulty progression that actually scales the grid size
- [ ] Daily challenge mode with shared leaderboard
- [ ] Family Access dashboard (requires on-chain contract)
- [ ] Mobile-responsive polish for small screens

---

## License

Proprietary — BrainFit

## Contact

Daniel — BrainFit

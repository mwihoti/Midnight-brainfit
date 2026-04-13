# BrainFit — Extension Distribution Plan

## Overview

Ship BrainFit on three surfaces from a single codebase:

| Surface | Distribution | Revenue model |
|---|---|---|
| Web app | Vercel / self-hosted | Free + paid NFT achievements |
| Browser extension | Chrome Web Store, Firefox Add-ons | Freemium new-tab |
| VS Code extension | VS Code Marketplace | Free + Pro subscription |

---

## Phase 1 — Browser Extension

### How it works

Next.js can export a fully static site (`out/`). A browser extension is just
a folder of static HTML/CSS/JS with a `manifest.json`. The game already runs
100% client-side so no server is needed.

### Step 1 — Fix routing for static export

Next.js static export does not support its default file-system router in
extensions (no server to handle `/player` → `player/index.html`). Add
trailing slashes so each route becomes a folder with an `index.html`.

```js
// next.config.js — add inside nextConfig
trailingSlash: true,
```

### Step 2 — Build the static output

```bash
bun run build:extension   # sets NEXT_EXPORT=true, runs next build
# output lands in out/
```

Verify locally by opening `out/index.html` directly in a browser.

### Step 3 — Add extension icons

Create or export icons at three sizes and place them in `public/icons/`:

```
public/
  icons/
    icon16.png
    icon48.png
    icon128.png
```

Use the Brain icon from the app as the base. Any image editor works;
Figma, Inkscape, or `sharp` (Node) can batch-export from an SVG.

### Step 4 — Optional: new-tab override

To replace the browser's new tab page, add to `manifest.json`:

```json
"chrome_url_overrides": {
  "newtab": "index.html"
},
"permissions": ["storage"]
```

Remove this if you want a toolbar popup instead of a full-page takeover.

### Step 5 — Test the extension locally

**Chrome / Edge**
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `out/` folder
4. Click the BrainFit icon in the toolbar

**Firefox**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** → select `out/manifest.json`

### Step 6 — Publish to Chrome Web Store

1. Create a developer account at https://chrome.google.com/webstore/devconsole ($5 one-time fee)
2. Zip the `out/` folder: `zip -r brainfit-extension.zip out/`
3. Upload the zip, fill in store listing (screenshots, description, category: **Games**)
4. Submit for review — typically 1–3 business days

**Firefox Add-ons** — same zip, submit at https://addons.mozilla.org/developers/

### Checklist

- [ ] `trailingSlash: true` added to next.config.js
- [ ] `bun run build:extension` produces a clean `out/` folder
- [ ] `out/index.html` opens correctly in a browser tab
- [ ] Icons exist at all three sizes
- [ ] Extension loads without console errors
- [ ] localStorage works (game progress saves between sessions)
- [ ] Chrome Web Store listing submitted
- [ ] Firefox listing submitted

---

## Phase 2 — VS Code Extension

### How it works

VS Code extensions are Node.js packages that run in the editor's extension
host process. They can open a **WebviewPanel** — an embedded browser window —
that loads any HTML page. BrainFit's game UI runs inside that panel unchanged.

The extension has two parts:
1. A thin VS Code extension host (TypeScript, ~100 lines)
2. The BrainFit web app loaded inside the webview

### Folder structure

```
brainfit-vscode/          ← new repo (or subfolder)
  package.json            ← VS Code extension manifest
  src/
    extension.ts          ← activate / deactivate
  webview/                ← copy of built Next.js out/ 
  .vscodeignore
  README.md
```

### Step 1 — Scaffold the VS Code extension

```bash
npm install -g @vscode/vsce yo generator-code
yo code
# Choose: New Extension (TypeScript)
# Name: BrainFit
# Identifier: brainfit
```

### Step 2 — Write the extension host

```ts
// src/extension.ts
import * as vscode from 'vscode'
import * as path from 'path'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('brainfit.open', () => {
      const panel = vscode.window.createWebviewPanel(
        'brainfit',
        'BrainFit',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'webview'))
          ],
          retainContextWhenHidden: true,   // keeps game state when tab loses focus
        }
      )

      const base = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'webview'))
      )

      panel.webview.html = getWebviewContent(base.toString())
    })
  )
}

function getWebviewContent(base: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <base href="${base}/">
    <meta http-equiv="Content-Security-Policy"
      content="default-src 'none';
               script-src 'unsafe-inline' 'unsafe-eval' ${base};
               style-src 'unsafe-inline' ${base};
               img-src ${base} data:;
               font-src ${base};
               connect-src https:;">
  </head>
  <body style="margin:0;padding:0;height:100vh;overflow:hidden;">
    <iframe src="${base}/index.html"
      style="width:100%;height:100%;border:none;"
      sandbox="allow-scripts allow-same-origin allow-forms">
    </iframe>
  </body>
</html>`
}

export function deactivate() {}
```

### Step 3 — VS Code extension package.json

```json
{
  "name": "brainfit",
  "displayName": "BrainFit — Brain Training Games",
  "description": "Memory and puzzle games inside VS Code. Take a brain break without leaving the editor.",
  "version": "1.0.0",
  "publisher": "your-publisher-id",
  "engines": { "vscode": "^1.85.0" },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "brainfit.open",
        "title": "BrainFit: Open Brain Games"
      }
    ],
    "keybindings": [
      {
        "command": "brainfit.open",
        "key": "ctrl+shift+b",
        "mac": "cmd+shift+b"
      }
    ]
  },
  "scripts": {
    "build": "tsc -p ./",
    "package": "vsce package"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@vscode/vsce": "^2.22.0",
    "typescript": "^5.3.3"
  }
}
```

### Step 4 — Copy the static build into the extension

After `bun run build:extension` in the main repo:

```bash
cp -r ../Midnight-brainfit/out ./webview
```

Add a npm/bun script to automate this:

```json
"prebuild": "cd ../Midnight-brainfit && bun run build:extension && cp -r out ../brainfit-vscode/webview"
```

### Step 5 — Test locally

```bash
# In brainfit-vscode/
npm run build
# Press F5 in VS Code → opens Extension Development Host
# Run command: BrainFit: Open Brain Games
# Or use Ctrl+Shift+B
```

### Step 6 — Publish to VS Code Marketplace

```bash
# Create publisher at https://marketplace.visualstudio.com/manage
vsce login your-publisher-id
vsce package          # produces brainfit-1.0.0.vsix
vsce publish          # publishes directly
```

### Checklist

- [ ] `yo code` scaffold created
- [ ] `extension.ts` written and compiles
- [ ] `webview/` populated from `bun run build:extension`
- [ ] Extension opens game panel with F5 in dev mode
- [ ] Game state persists when panel loses focus (`retainContextWhenHidden`)
- [ ] Keyboard shortcut works (Ctrl+Shift+B)
- [ ] `.vscodeignore` excludes source files from the package
- [ ] Publisher account created on VS Code Marketplace
- [ ] `vsce publish` succeeds

---

## Phase 3 — Shared improvements needed for both

These are blockers or near-blockers for both targets:

### Responsive layout for small panels

The VS Code webview sidebar can be as narrow as 300px. The current game grid
is `max-w-md` which holds fine, but the player hub layout uses `md:grid-cols-2`
which breaks at narrow widths. Audit all pages at 320px width.

### Offline-first storage

Both extension targets have no server. `localStorage` already works.
Make sure no fetch calls assume a server — wrap all network calls in
try/catch so the game works fully offline.

### No hard-coded `localhost` references

Search for any `localhost` or `127.0.0.1` URLs in the codebase and guard
them with environment variable checks so they don't fire in extension contexts.

```bash
grep -r "localhost" app/ components/ lib/
```

### Asset paths

Browser extensions load assets relative to `manifest.json`. The Next.js
static export uses `/_next/static/...` paths which work fine, but any
manually referenced `/icons/` or `/public/` paths must be root-relative,
not absolute URLs.

---

## Timeline

| Week | Work |
|---|---|
| 1 | Fix trailing slash routing, build:extension script, test `out/` locally |
| 2 | Create icons, test Chrome + Firefox, submit to stores |
| 3 | Scaffold VS Code extension, wire up webview, test F5 dev mode |
| 4 | Responsive audit at 320px, offline checks, publish VS Code |
| 5+ | Pro tier, keyboard shortcut for quick-play, streak tracking |

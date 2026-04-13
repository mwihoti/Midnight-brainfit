const path = require('path')

const isExtensionBuild = process.env.NEXT_EXPORT === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Static export for browser extension packaging.
  // Run `bun run build:extension` then zip the `out/` directory.
  ...(isExtensionBuild && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_MIDNIGHT_NODE_URL: process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URL,
    NEXT_PUBLIC_LACE_WALLET_ID: process.env.NEXT_PUBLIC_LACE_WALLET_ID,
  },
  webpack(config, { isServer }) {
    // Enable async WebAssembly (required by @midnight-ntwrk/ledger-v7 and onchain-runtime-v2)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // TypeScript ESM convention: imports use .js extensions that map to .ts sources.
    // Tell webpack to resolve .js → .ts/.tsx so dynamic imports of contractService work.
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    }

    // @midnight-ntwrk/compact-runtime ships its exports field with "default" first,
    // which violates the webpack spec. Alias it directly to the CJS dist entry to
    // bypass exports-field resolution entirely.
    config.resolve.alias['@midnight-ntwrk/compact-runtime'] = path.resolve(
      __dirname,
      'node_modules/@midnight-ntwrk/compact-runtime/dist/index.js'
    )

    if (isServer) {
      // The Midnight SDK pulls in WASM and browser-only APIs; never bundle it server-side.
      const midnightPkgs = /^@midnight-ntwrk\//
      const existingExternals = config.externals ?? []
      config.externals = [
        ...(Array.isArray(existingExternals) ? existingExternals : [existingExternals]),
        ({ request }, callback) => {
          if (midnightPkgs.test(request)) return callback(null, `commonjs ${request}`)
          callback()
        },
      ]
    } else {
      // @midnight-ntwrk/midnight-js-contracts (and some related packages) call
      // require('fs') inside their ESM build — a Node.js built-in that doesn't
      // exist in the browser. Stub it out so the lazy contractService chunk
      // can be bundled; the code paths that actually call fs functions are only
      // reached on a real Midnight node connection, which always falls back to
      // local mode on failure.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      }

      // isomorphic-ws ships only a default export, but midnight-js-indexer-public-data-provider
      // imports { WebSocket } as a named export. Replace with a browser shim that
      // re-exports globalThis.WebSocket both as default and as a named export.
      config.resolve.alias['isomorphic-ws'] = path.resolve(
        __dirname,
        'lib/shims/isomorphic-ws.js'
      )
    }

    return config
  },
}

module.exports = nextConfig

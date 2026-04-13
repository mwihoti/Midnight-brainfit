// isomorphic-ws shim for browser builds.
// midnight-js-indexer-public-data-provider imports { WebSocket } as a named
// export, but isomorphic-ws only ships a default export. In the browser the
// native globalThis.WebSocket is available, so we re-export it both ways.
export const WebSocket = globalThis.WebSocket
export default globalThis.WebSocket

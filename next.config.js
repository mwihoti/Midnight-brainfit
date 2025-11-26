/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_MIDNIGHT_NODE_URL: process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URL,
    NEXT_PUBLIC_LACE_WALLET_ID: process.env.NEXT_PUBLIC_LACE_WALLET_ID,
  },
}

module.exports = nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization - unoptimized for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'biblicalalignment.org',
      },
    ],
  },
}

export default nextConfig

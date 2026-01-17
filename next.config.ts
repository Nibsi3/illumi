import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',

  // Generate a consistent build ID based on timestamp
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Set cache control headers
  async headers() {
    return [
      {
        // Don't cache HTML pages - always serve fresh
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // Cache static assets forever (they have unique hashes)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

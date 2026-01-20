import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      '@tabler/icons-react',
      'lucide-react',
      'framer-motion',
      'date-fns',
    ],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eagwfcctvfrvxgxaitbd.supabase.co',
      },
    ],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },

  // Headers for caching static assets
  async headers() {
    return [
      {
        // Cache static assets for 1 year
        source: '/:path*.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JS and CSS for 1 year (they have content hashes)
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

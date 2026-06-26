/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // was true — double-render in dev is expensive; re-enable for prod audits if needed

  // Skip ESLint during `next build` — run it separately with `npm run lint`
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Don't block builds on TS errors; tsc runs separately via tsconfig incremental
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  experimental: {
    // Tree-shake barrel packages — massive win for lucide-react & framer-motion
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@anthropic-ai/sdk',
    ],
  },
};

export default nextConfig;

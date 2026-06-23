/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Cloudflare Pages compatibility
  experimental: {
    runtime: 'edge',
  },
  images: {
    // Use unoptimized for Cloudflare Pages (no built-in image optimizer)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

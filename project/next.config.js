/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Removed "output: 'export'" to enable API routes and dynamic features
};

module.exports = nextConfig;
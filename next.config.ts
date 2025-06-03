import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: 'out',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
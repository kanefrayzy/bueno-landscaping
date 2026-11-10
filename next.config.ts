import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  allowedDevOrigins: ['*.ngrok-free.app'],
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // The production server's CPU cannot run sharp: photos are resized ahead of time (npm run images).
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [384, 640, 828, 1080, 1440, 1920],
    imageSizes: [],
  },
};

// Blog posts are MDX files in src/content/blog. Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
  },
});

export default withMDX(nextConfig);

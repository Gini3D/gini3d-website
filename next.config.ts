import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow any external images from Nostr ecosystem
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow SVG images (common in Nostr profiles)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

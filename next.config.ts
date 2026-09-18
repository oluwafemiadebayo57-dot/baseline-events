// next.config.ts
// Next.js config. Here we tell Next.js which external image domains
// are trusted — needed because next/image blocks unknown domains by default.

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Any domain listed here is allowed to serve images.
    // Add more later if the client hosts photos elsewhere.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
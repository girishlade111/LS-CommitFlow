import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        protocol: "https",
        hostname: "lineup-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "seed-mix-image.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "charts-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "dailymix-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "newjams-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "t.scdn.co",
      },
      {
        protocol: "https",
        hostname: "p.scdn.co",
      },
      {
        protocol: "https",
        hostname: "thisis-images.scdn.co",
      },
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
      },
    ],
  },
  typedRoutes: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;

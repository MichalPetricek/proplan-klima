import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = "proplan-klima";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : undefined,
  assetPrefix: isProd ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

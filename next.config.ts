import type { NextConfig } from "next";

// Prázdný basePath = nasazení do kořene domény (Forpsi, www.proplan-klima.cz).
// GitHub Pages build si ho nastavuje přes NEXT_PUBLIC_BASE_PATH=/proplan-klima.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

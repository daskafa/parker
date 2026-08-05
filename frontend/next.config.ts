import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // next dev blocks /_next assets when opened via IP/domain (not localhost)
  allowedDevOrigins: [
    "192.209.62.90",
    "assignment1.newu.digital",
  ],
};

export default nextConfig;

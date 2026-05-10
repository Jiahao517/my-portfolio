import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
      {
        pathname: "/case-images/**",
      },
    ],
  },
};

export default nextConfig;

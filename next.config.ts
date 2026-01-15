import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["sequelize", "pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**", // UI Avatars uses the /api path
      },
    ],
  },
};

export default nextConfig;

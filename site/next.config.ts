import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: "/projects/biomimetic-ai",
        destination: "/research/biomimetic-ai",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

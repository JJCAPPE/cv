import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
    ];
  },
  redirects() {
    return [
      {
        source: "/projects/biomimetic-ai",
        destination: "/research/biomimetic-ai",
        permanent: true,
      },
      {
        source: "/projects/rowing-biomechanics",
        destination: "/research/rowing-biomechanics",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

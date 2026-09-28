import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [75, 100],
  },
  async redirects() {
    return [
      // The per-game detail pages were folded into the Our Games dashboard;
      // old links open it with that game already selected.
      {
        source: "/our-games/all_games/:slug",
        destination: "/our-games?game=:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

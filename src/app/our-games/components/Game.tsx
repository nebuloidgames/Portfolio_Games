"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { User } from "../../components/hero-data";
import { useIsMobile } from "../../hooks/useIsMobile";
import { GAMES } from "../game-data";

/*
 * Desktop and mobile dashboards are separate chunks: next/dynamic only
 * fetches the one that actually renders, so phones never download the
 * desktop cross-fade-stack background code, and vice versa.
 */
const OurGamesDesktop = dynamic(() => import("./OurGamesDesktop"), {
  ssr: false,
});
const OurGamesMobile = dynamic(() => import("./OurGamesMobile"), {
  ssr: false,
});

/*
 * The stacked mobile layout (art on top, details below) only fits a
 * portrait phone. A phone turned sideways gets the side-by-side desktop
 * layout, which has a compact mode for short screens.
 */
const MOBILE_LAYOUT_QUERY = "(max-width: 767px) and (orientation: portrait)";

export default function Game() {
  const isMobile = useIsMobile(MOBILE_LAYOUT_QUERY);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted) return;
        if (data?.success && data.user) setUser(data.user);
      })
      .catch(() => {
        // Stay signed-out; locked games still show, unlocked via login.
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Viewport not measured yet: render nothing rather than guess, so we never
  // start fetching the wrong device's chunk.
  if (isMobile === null) {
    return <div className="fixed inset-0 z-0 bg-[#04020e]" />;
  }

  return isMobile ? (
    <OurGamesMobile games={GAMES} user={user} />
  ) : (
    <OurGamesDesktop games={GAMES} user={user} />
  );
}

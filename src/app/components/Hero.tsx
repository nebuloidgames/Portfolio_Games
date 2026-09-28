"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  FALLBACK_GAMES,
  type GameItem,
  orderGames,
  type User,
} from "./hero-data";

/*
 * Desktop (3D coverflow) and mobile (stacked card deck) are separate chunks:
 * next/dynamic only fetches the one that actually renders, so phones never
 * download the desktop carousel code, and vice versa.
 */
const HeroDesktop = dynamic(() => import("./HeroDesktop"), { ssr: false });
const HeroMobile = dynamic(() => import("./HeroMobile"), { ssr: false });

const Hero = () => {
  const isMobile = useIsMobile();
  const [games, setGames] = useState<GameItem[]>(FALLBACK_GAMES);
  const [user, setUser] = useState<User | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  /*
   * HOME PAGE:
   * Keep the page fixed/non-scrollable, on both device variants.
   */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverflowX: html.style.overflowX,
      htmlOverflowY: html.style.overflowY,
      bodyOverflow: body.style.overflow,
      bodyOverflowX: body.style.overflowX,
      bodyOverflowY: body.style.overflowY,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.setProperty("overflow", "hidden", "important");
    html.style.setProperty("overflow-x", "hidden", "important");
    html.style.setProperty("overflow-y", "hidden", "important");

    body.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("overflow-x", "hidden", "important");
    body.style.setProperty("overflow-y", "hidden", "important");
    body.style.setProperty("overscroll-behavior", "none", "important");

    const stopPageWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    window.addEventListener("wheel", stopPageWheel, {
      passive: false,
      capture: true,
    });

    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("wheel", stopPageWheel, true);

      html.style.overflow = previous.htmlOverflow;
      html.style.overflowX = previous.htmlOverflowX;
      html.style.overflowY = previous.htmlOverflowY;

      body.style.overflow = previous.bodyOverflow;
      body.style.overflowX = previous.bodyOverflowX;
      body.style.overflowY = previous.bodyOverflowY;
      body.style.overscrollBehavior = previous.bodyOverscroll;
    };
  }, []);

  /*
   * Load games + current user.
   */
  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetch("/api/games").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/auth/me").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([gamesData, userData]) => {
        if (!mounted) return;

        if (gamesData?.success && Array.isArray(gamesData.games)) {
          setGames((currentGames) => {
            const apiGames = gamesData.games as GameItem[];
            const bySlug = new Map(apiGames.map((game) => [game.slug, game]));

            return currentGames.map((fallbackGame) => {
              const apiGame = bySlug.get(fallbackGame.slug);
              if (!apiGame) return fallbackGame;

              return {
                ...fallbackGame,
                ...apiGame,
                thumbnailUrl:
                  fallbackGame.thumbnailUrl ||
                  apiGame.thumbnailUrl ||
                  fallbackGame.thumbnailUrl,
                gameUrl: apiGame.gameUrl || fallbackGame.gameUrl,
              };
            });
          });
        }

        if (userData?.success && userData.user) {
          setUser(userData.user);
        }
      })
      .catch(() => {
        // Keep fallback games visible.
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const orderedGames = useMemo(() => orderGames(games), [games]);

  // Viewport not measured yet: render nothing rather than guess, so we never
  // start fetching the wrong device's chunk.
  if (isMobile === null) {
    return <section className="fixed inset-0 z-0 bg-[#020108]" />;
  }

  return isMobile ? (
    <HeroMobile
      games={orderedGames}
      user={user}
      reducedMotion={reducedMotion}
    />
  ) : (
    <HeroDesktop
      games={orderedGames}
      user={user}
      reducedMotion={reducedMotion}
    />
  );
};

export default Hero;

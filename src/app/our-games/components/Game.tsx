"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import GameLoader from "../../components/GameLoader";
import { useCurrentUser } from "../../hooks/useCurrentUser";
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

/** Never hold the loading screen longer than this, even if an image stalls. */
const MAX_WAIT_MS = 10000;

/**
 * Resolves once the fonts and every image meant for the first screen have
 * finished (loaded or failed). Lazy images further along the row are left
 * to load in the background.
 */
function firstScreenLoaded(): Promise<void> {
  const images = Array.from(document.images).filter(
    (img) => img.loading !== "lazy",
  );
  const imageDone = images.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
  );
  return Promise.all([document.fonts.ready, ...imageDone]).then(() => {});
}

export default function Game() {
  const isMobile = useIsMobile(MOBILE_LAYOUT_QUERY);
  const { user, loading } = useCurrentUser();
  // set by the dashboard once its (lazily loaded) code has mounted
  const [mounted, setMounted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const done = () => {
      if (!cancelled) setAssetsLoaded(true);
    };
    const timer = setTimeout(done, MAX_WAIT_MS);
    // one frame so the dashboard's <img> tags are in the DOM
    requestAnimationFrame(() => firstScreenLoaded().then(done));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [mounted]);

  // The page renders underneath as soon as the device is known so its
  // images start loading, but the loader stays on top until the login check
  // is done and the first screen's fonts and images have all arrived.
  const ready = isMobile !== null && !loading && mounted && assetsLoaded;

  const Dashboard = isMobile ? OurGamesMobile : OurGamesDesktop;

  return (
    <>
      {isMobile !== null && (
        <Dashboard games={GAMES} user={user} onReady={() => setMounted(true)} />
      )}
      <GameLoader done={ready} />
    </>
  );
}

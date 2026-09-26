"use client";

import { usePathname } from "next/navigation";
import Background from "./background";
import SpaceFx from "./SpaceFx";

/** Admin pages stay flat and light: no nebula, no effects. */
const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");

/** Full in-game screens keep their own look and stay free of distractions. */
const isGameRoute = (pathname: string) =>
  pathname.startsWith("/our-games/all_games");

/**
 * The site-wide nebula for the pages visitors see: one fixed backdrop behind
 * the page, plus the interactive cursor layer above the content (not on game
 * screens, and never in the admin area).
 */
export default function SiteBackdrop() {
  const pathname = usePathname();

  if (isAdminRoute(pathname)) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[#0b0b12]"
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#020108]"
      >
        <Background />
      </div>

      {!isGameRoute(pathname) && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
        >
          <SpaceFx />
        </div>
      )}
    </>
  );
}

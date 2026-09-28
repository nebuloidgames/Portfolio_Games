"use client";

import { usePathname } from "next/navigation";
import Background from "./background";
import SpaceFx from "./SpaceFx";

/** Admin pages stay flat and light: no nebula, no effects. */
const isAdminRoute = (pathname: string) => pathname.startsWith("/admin");

/**
 * The site-wide nebula for the pages visitors see: one fixed backdrop behind
 * the page, plus the interactive cursor layer above the content on every
 * visitor page (never in the admin area). The games themselves are static
 * files under /games and never render this layout.
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

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      >
        <SpaceFx />
      </div>
    </>
  );
}

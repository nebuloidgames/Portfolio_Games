"use client";

import { useEffect, useState } from "react";

const DEFAULT_QUERY = "(max-width: 767px)";

/**
 * `null` until the real viewport is known (avoids briefly picking the wrong
 * device branch — and loading its code — before mount). Pass a different
 * media query when a page needs its own definition of "mobile".
 */
export function useIsMobile(query: string = DEFAULT_QUERY) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}

"use client";

import { useEffect, useState } from "react";
import type { User } from "../components/hero-data";

/** Give up and treat the visitor as signed-out if the check hangs. */
const TIMEOUT_MS = 8000;

/**
 * The signed-in user, plus `loading` until the check has finished — so a
 * page can wait instead of briefly showing signed-out UI ("Login to Play")
 * to someone who is actually logged in.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // `cancelled` = this component went away (or React re-ran the effect).
    // A cancelled request must not report "done, signed out" — the one that
    // replaced it will answer. A timeout, though, should end the wait.
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.success && data.user) setUser(data.user);
      })
      .catch(() => {
        // Network error or timeout: carry on signed-out.
      })
      .finally(() => {
        clearTimeout(timer);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return { user, loading };
}

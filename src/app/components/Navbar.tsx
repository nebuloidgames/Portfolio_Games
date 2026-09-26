"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  username: string;
  role: string;
}

/* Violet-to-magenta glowing pill that matches the home-page nebula. */
const buttonClass = `
  flex h-[46px] min-w-[110px] items-center justify-center gap-2
  rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#FF4FD8] px-6
  font-[family-name:var(--font-russo)] text-[15px] uppercase tracking-[0.18em]
  text-white
  shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_28px_rgba(255,79,216,0.5)]
  transition-all duration-200
  hover:-translate-y-[2px] hover:brightness-110
  active:translate-y-[1px]
  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white
  disabled:cursor-not-allowed disabled:opacity-60
`;

/* Admin area: a flat, plain button with no glow. */
const adminButtonClass = `
  flex h-[38px] items-center justify-center gap-2 rounded-md
  border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white
  transition-colors hover:bg-white/20
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
  disabled:cursor-not-allowed disabled:opacity-60
`;

const Arrow = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);

      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  /*
   * Every page: a transparent bar over the site-wide nebula (slimmer on the
   * home page, whose hero needs the room).
   *
   * HOME PAGE:
   * Always show LOGIN.
   *
   * LOGIN PAGE:
   * Show nothing on the right side.
   */
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname.startsWith("/admin");

  /* Admin: a plain, compact bar. No glow, no oversized logo. */
  if (isAdminPage) {
    return (
      <header className="relative z-[100] h-[60px] w-full shrink-0 border-b border-white/10 bg-[#0b0b12]">
        <nav className="flex h-full w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Nebuloid Gaming home"
            className="flex h-full items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Image
              src="/logo3.png"
              alt="Nebuloid Gaming Logo"
              width={140}
              height={140}
              priority
              className="h-[44px] w-auto object-contain"
            />
          </Link>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={adminButtonClass}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`
        relative z-[100] w-full shrink-0 bg-transparent
        ${isHomePage ? "h-[72px]" : "h-[110px]"}
      `}
    >
      <nav
        className={`
          relative z-[101] flex h-full w-full items-center justify-between
          px-5 sm:px-10 lg:px-[74px]
        `}
      >
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Nebuloid Gaming home"
          className={`
            relative z-[102] flex items-center select-none
            self-start h-[90px] sm:h-[110px]
            drop-shadow-[0_0_14px_rgba(255,79,216,0.45)]
            transition-transform duration-150 hover:scale-105
            focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white
          `}
        >
          <Image
            src="/logo3.png"
            alt="Nebuloid Gaming Logo"
            width={140}
            height={140}
            priority
            className="h-[90px] w-auto object-contain sm:h-[110px]"
          />
        </Link>

        {/* RIGHT SIDE */}
        <div className="relative z-[103] flex items-center">
          {isHomePage ? (
            <Link href="/login" className={buttonClass}>
              Login <Arrow />
            </Link>
          ) : isLoginPage ? null : user ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={buttonClass}
            >
              {loggingOut ? "Logging out..." : "Logout"}
              {!loggingOut && <Arrow />}
            </button>
          ) : (
            <Link href="/login" className={buttonClass}>
              Login <Arrow />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

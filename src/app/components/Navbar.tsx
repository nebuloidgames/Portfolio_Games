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
   * HOME PAGE:
   * Always show LOGIN.
   *
   * LOGIN PAGE:
   * Show nothing on the right side.
   */
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";

  return (
    <header
      className="
        relative
        z-[100]
        h-[110px]
        w-full
        shrink-0
        bg-bg
      "
    >
      <nav
        className="
          relative
          z-[101]
          flex
          h-full
          w-full
          items-center
          justify-between
          border-b
          border-black/15
          px-[74px]
          sm:px-[76px]
        "
      >
        {/* =========================
            LOGO
        ========================== */}
        <Link
          href="/"
          className="
            relative
            z-[102]
            flex
            h-full
            items-center
            select-none
            hover:opacity-100
          "
        >
          <Image
            src="/logo3.png"
            alt="Nebuloid Gaming Logo"
            width={140}
            height={140}
            priority
            className="h-[110px] w-auto object-contain"
          />
        </Link>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="relative z-[103] flex items-center">

          {/* --------------------------------
              HOME PAGE
              ALWAYS LOGIN
          --------------------------------- */}
          {isHomePage ? (
            <Link
              href="/login"
              className="
                flex
                h-[44px]
                min-w-[110px]
                items-center
                justify-center
                rounded-[5px]
                border-2
                border-black
                bg-[#FFD83D]
                px-5
                font-serif
                text-[15px]
                font-bold
                uppercase
                tracking-[0.06em]
                text-black
                shadow-[4px_4px_0_#111]
                transition-all
                duration-150
                hover:-translate-y-[1px]
                hover:bg-[#FFC928]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none
              "
            >
              LOGIN →
            </Link>

          ) : isLoginPage ? (

            /* --------------------------------
               LOGIN PAGE
               NO BUTTON
            --------------------------------- */
            null

          ) : user ? (

            /* --------------------------------
               OTHER PAGES + LOGGED IN
               SHOW LOGOUT
            --------------------------------- */
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex
                h-[44px]
                min-w-[110px]
                items-center
                justify-center
                rounded-[5px]
                border-2
                border-black
                bg-[#FFD83D]
                px-5
                font-serif
                text-[15px]
                font-bold
                uppercase
                tracking-[0.06em]
                text-black
                shadow-[4px_4px_0_#111]
                transition-all
                duration-150
                hover:-translate-y-[1px]
                hover:bg-[#FFC928]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loggingOut ? "LOGGING OUT..." : "LOGOUT →"}
            </button>

          ) : (

            /* --------------------------------
               OTHER PAGES + LOGGED OUT
               SHOW LOGIN
            --------------------------------- */
            <Link
              href="/login"
              className="
                flex
                h-[44px]
                min-w-[110px]
                items-center
                justify-center
                rounded-[5px]
                border-2
                border-black
                bg-[#FFD83D]
                px-5
                font-serif
                text-[15px]
                font-bold
                uppercase
                tracking-[0.06em]
                text-black
                shadow-[4px_4px_0_#111]
                transition-all
                duration-150
                hover:-translate-y-[1px]
                hover:bg-[#FFC928]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none
              "
            >
              LOGIN →
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
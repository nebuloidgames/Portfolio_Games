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
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);

      // Logout ke baad login page par nahi,
      // normal home page par jayega.
      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const isLoginPage = pathname === "/login";

  return (
    <header className="h-[82px] w-full shrink-0 bg-[#F4F0E7]">
      <nav className="flex h-full w-full items-center justify-between border-b border-black/15 px-[74px] sm:px-[76px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex h-full items-center select-none hover:opacity-90"
        >
          <Image
            src="/nebuloid-logo.png"
            alt="Nebuloid Gaming Logo"
            width={60}
            height={60}
            priority
            className="h-[56px] w-auto object-contain"
          />
        </Link>

        <div className="flex items-center">
          {/* LOGIN PAGE:
              Kisi bhi logged-in user ko ADMIN/LOGOUT nahi dikhana.
          */}
          {isLoginPage ? null : user ? (
            <>
              {/* ADMIN button:
                  Sirf ADMIN user ko dikhega.
              */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="mr-2 flex h-[28px] min-w-[82px] items-center justify-center rounded-[2px] border border-black bg-[#FFD43D] px-3 font-serif text-[11px] font-bold uppercase tracking-[0.04em] text-black shadow-[2px_2px_0_#000]"
                >
                  ADMIN ›
                </Link>
              )}

              {/* LOGOUT:
                  Har logged-in user ko dikhega.
              */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex h-[28px] min-w-[74px] items-center justify-center rounded-[2px] border border-black bg-[#FFD43D] px-3 font-serif text-[11px] font-bold uppercase tracking-[0.04em] text-black shadow-[2px_2px_0_#000] disabled:opacity-60"
              >
                {loggingOut ? "..." : "LOGOUT ›"}
              </button>
            </>
          ) : (
            /* Logged out user */
            <Link
              href="/login"
              className="flex h-[50px] min-w-[145px] items-center justify-center rounded-[7px] border-2 border-black bg-[#FFD43D] px-6 font-serif text-[18px] font-bold uppercase tracking-[0.05em] text-black shadow-[4px_4px_0_#111] transition-transform duration-150 hover:bg-[#FFC928] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#111]"
            >
              LOGIN ›
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
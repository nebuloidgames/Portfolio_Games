"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: string;
}

export function AdminNav({
  user,
  pendingCount,
}: {
  user: User;
  pendingCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const links = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
    },
    {
      href: "/admin/access-requests",
      label: "Access Requests",
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      href: "/admin/users",
      label: "Users",
    },
    {
      href: "/admin/games",
      label: "Games",
    },
  ];

  return (
    <nav className="border-b border-black/10 bg-[#F4F0E7]">
      <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className="text-lg font-bold tracking-tight text-black"
          >
            Nebuloid Admin
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-zinc-700 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  {link.label}

                  {/* Red dot only when there are pending requests */}
                  {link.badge !== null && (
                    <span
                      className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
                      title={`${link.badge} pending request${
                        link.badge === 1 ? "" : "s"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-zinc-600 sm:inline">
            {user.username}
          </span>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md border border-black bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black shadow-[2px_2px_0_#000] transition-all hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout →"}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="border-t border-black/10 px-4 sm:hidden">
        <div className="flex gap-1 overflow-x-auto py-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-zinc-700 hover:bg-black/5 hover:text-black"
                }`}
              >
                {link.label}

                {link.badge !== null && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
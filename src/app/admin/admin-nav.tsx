"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const links = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
    },
    {
      href: "/admin/access-requests",
      label: "Access Requests",
    },
    {
      href: "/admin/users",
      label: "Users",
    },
    {
      href: "/our-games",
      label: "Games",
    },
  ];

  // Red notification ONLY when there are pending requests
  const hasPendingRequests = pendingCount > 0;

  return (
    <nav className="border-b border-black/10 bg-[#F4F0E7]">
      <div className="mx-auto flex h-[62px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================
            ADMIN BRAND + NAVIGATION
        ========================== */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className="
              text-xl
              font-bold
              tracking-tight
              text-black
              transition-opacity
              hover:opacity-75
            "
          >
            Nebuloid Admin
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;

              const isAccessRequests =
                link.href === "/admin/access-requests";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    rounded-md
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-150
                    ${
                      isActive
                        ? "bg-black text-white"
                        : "text-zinc-700 hover:bg-black/5 hover:text-black"
                    }
                  `}
                >
                  {link.label}

                  {/* RED DOT ONLY FOR NEW ACCESS REQUESTS */}
                  {isAccessRequests && hasPendingRequests && (
                    <span
                      title={`${pendingCount} pending access request${
                        pendingCount === 1 ? "" : "s"
                      }`}
                      className="
                        absolute
                        -right-1
                        -top-1
                        h-2.5
                        w-2.5
                        rounded-full
                        bg-red-500
                        ring-2
                        ring-[#F4F0E7]
                      "
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* =========================
            USERNAME
            NO DUPLICATE LOGOUT
        ========================== */}
        <div className="flex items-center">
          <span className="hidden text-sm font-semibold text-zinc-600 sm:inline">
            {user.username}
          </span>
        </div>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <div className="border-t border-black/10 px-4 sm:hidden">
        <div className="flex gap-1 overflow-x-auto py-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            const isAccessRequests =
              link.href === "/admin/access-requests";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative
                  shrink-0
                  whitespace-nowrap
                  rounded-md
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  transition-colors
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-zinc-700 hover:bg-black/5 hover:text-black"
                  }
                `}
              >
                {link.label}

                {isAccessRequests && hasPendingRequests && (
                  <span
                    title={`${pendingCount} pending access request${
                      pendingCount === 1 ? "" : "s"
                    }`}
                    className="
                      absolute
                      -right-1
                      -top-1
                      h-2
                      w-2
                      rounded-full
                      bg-red-500
                      ring-2
                      ring-[#F4F0E7]
                    "
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
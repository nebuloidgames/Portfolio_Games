import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [
    pendingAccessRequests,
    totalUsers,
    activeUsers,
    suspendedUsers,
    revokedUsers,
  ] = await Promise.all([
    prisma.accessRequest.count({
      where: { status: "PENDING" },
    }),

    prisma.user.count(),

    prisma.user.count({
      where: { status: "ACTIVE" },
    }),

    prisma.user.count({
      where: { status: "SUSPENDED" },
    }),

    prisma.user.count({
      where: { status: "REVOKED" },
    }),
  ]);

  return {
    pendingAccessRequests,
    totalUsers,
    activeUsers,
    suspendedUsers,
    revokedUsers,
  };
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div
      className="
        min-h-[145px]
        rounded-xl
        border
        border-zinc-200
        bg-white
        p-7
        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
        transition-all
        duration-200
        hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)]
      "
    >
      <p className="text-base font-semibold text-zinc-600">
        {label}
      </p>

      <p className="mt-4 text-4xl font-bold leading-none text-black">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="
          block
          transition-transform
          duration-200
          hover:-translate-y-1
        "
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="pb-10">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-black/10
          pb-8
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.28em]
              text-zinc-500
            "
          >
            Nebuloid Admin
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-4xl
              font-bold
              leading-none
              text-black
              sm:text-5xl
            "
          >
            Dashboard
          </h1>

          <p className="mt-4 text-base font-medium text-zinc-600">
            Overview of your platform
          </p>
        </div>

        <div
          className="
            inline-flex
            w-fit
            rounded-md
            border
            border-zinc-200
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-zinc-700
          "
        >
          Admin Overview
        </div>
      </div>

      {/* =========================
          ACCESS REQUESTS
      ========================== */}
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="
              text-xl
              font-bold
              text-black
              sm:text-2xl
            "
          >
            Access Requests
          </h2>

          <Link
            href="/admin/access-requests"
            className="
              rounded-md
              border-2
              border-black
              bg-yellow-400
              px-5
              py-3
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-black
              shadow-[3px_3px_0_#000]
              transition-all
              hover:-translate-y-0.5
              hover:bg-yellow-300
              active:translate-x-[2px]
              active:translate-y-[2px]
              active:shadow-none
            "
          >
            View Requests →
          </Link>
        </div>

        <Link
          href="/admin/access-requests"
          className="
            block
            min-h-[150px]
            rounded-xl
            border
            border-zinc-200
            bg-white
            p-7
            shadow-[0_2px_8px_rgba(0,0,0,0.05)]
            transition-all
            duration-200
            hover:-translate-y-1
            hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)]
          "
        >
          <p className="text-base font-semibold text-zinc-600">
            Pending Requests
          </p>

          <p className="mt-4 text-4xl font-bold leading-none text-black">
            {stats.pendingAccessRequests}
          </p>

          <p className="mt-4 text-sm font-medium text-zinc-500">
            Requests waiting for admin approval
          </p>
        </Link>
      </section>

      {/* =========================
          USERS
      ========================== */}
      <section className="mt-12">
        <div className="mb-5">
          <h2
            className="
              text-xl
              font-bold
              text-black
              sm:text-2xl
            "
          >
            Users
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
          />

          <StatCard
            label="Active"
            value={stats.activeUsers}
            href="/admin/users?status=ACTIVE"
          />

          <StatCard
            label="Suspended"
            value={stats.suspendedUsers}
            href="/admin/users?status=SUSPENDED"
          />

          <StatCard
            label="Revoked"
            value={stats.revokedUsers}
            href="/admin/users?status=REVOKED"
          />
        </div>
      </section>

      {/* =========================
          GAMES
      ========================== */}
      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="
              text-xl
              font-bold
              text-black
              sm:text-2xl
            "
          >
            Games
          </h2>

          <Link
            href="/our-games"
            className="
              rounded-md
              border-2
              border-black
              bg-yellow-400
              px-5
              py-3
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-black
              shadow-[3px_3px_0_#000]
              transition-all
              hover:-translate-y-0.5
              hover:bg-yellow-300
              active:translate-x-[2px]
              active:translate-y-[2px]
              active:shadow-none
            "
          >
            View Games →
          </Link>
        </div>

        <div
          className="
            min-h-[155px]
            rounded-xl
            border
            border-zinc-200
            bg-white
            p-7
            shadow-[0_2px_8px_rgba(0,0,0,0.05)]
          "
        >
          <p className="text-base font-semibold text-zinc-600">
            Your game collection is available on the Our Games page.
          </p>

          <Link
            href="/our-games"
            className="
              mt-6
              inline-flex
              items-center
              rounded-md
              bg-black
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition-all
              hover:-translate-y-0.5
              hover:bg-zinc-800
            "
          >
            Open Our Games →
          </Link>
        </div>
      </section>
    </div>
  );
}
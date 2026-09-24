import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [
    pendingAccessRequests,
    totalUsers,
    activeUsers,
    suspendedUsers,
    revokedUsers,
    totalGames,
    publishedGames,
    draftGames,
    archivedGames,
  ] = await Promise.all([
    prisma.accessRequest.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
    prisma.user.count({ where: { status: "REVOKED" } }),
    prisma.game.count(),
    prisma.game.count({ where: { status: "PUBLISHED" } }),
    prisma.game.count({ where: { status: "DRAFT" } }),
    prisma.game.count({ where: { status: "ARCHIVED" } }),
  ]);

  return {
    pendingAccessRequests,
    totalUsers,
    activeUsers,
    suspendedUsers,
    revokedUsers,
    totalGames,
    publishedGames,
    draftGames,
    archivedGames,
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
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-black/20 hover:shadow-[0_5px_14px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {label}
        </p>

        {href && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD43D] text-sm font-bold text-black">
            →
          </span>
        )}
      </div>

      <p className="mt-4 text-[32px] font-bold leading-none text-black">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function SectionTitle({
  title,
  notification,
}: {
  title: string;
  notification?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-[18px] font-bold text-black">{title}</h2>

      {notification && (
        <span
          className="h-2.5 w-2.5 rounded-full bg-red-500"
          title="New requests"
        />
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-[#F4F0E7]">
      <div className="mx-auto w-full max-w-[1250px] px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="border-b border-black/10 pb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            Nebuloid Admin
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-[38px] font-bold leading-none text-black">
                Dashboard
              </h1>

              <p className="mt-3 text-sm text-zinc-500">
                Overview of your platform
              </p>
            </div>

            <div className="rounded-md border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-zinc-600">
              Admin Overview
            </div>
          </div>
        </div>

        {/* Access Requests */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <SectionTitle
              title="Access Requests"
              notification={stats.pendingAccessRequests > 0}
            />

            <Link
              href="/admin/access-requests"
              className="rounded-md border-2 border-black bg-[#FFD43D] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-black shadow-[2px_2px_0_#000] transition hover:-translate-y-0.5 hover:bg-[#FFC928]"
            >
              View Requests →
            </Link>
          </div>

          <div className="mt-4">
            <Link
              href="/admin/access-requests"
              className="block rounded-xl border border-black/10 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-black/20 hover:shadow-[0_5px_14px_rgba(0,0,0,0.07)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-zinc-500">
                    Pending Requests
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-[32px] font-bold leading-none text-black">
                      {stats.pendingAccessRequests}
                    </p>

                    {stats.pendingAccessRequests > 0 && (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD43D] text-lg font-bold text-black">
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Users */}
        <section className="mt-9">
          <SectionTitle title="Users" />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} />

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

        {/* Games */}
        <section className="mt-9 pb-8">
          <SectionTitle title="Games" />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Games" value={stats.totalGames} />

            <StatCard
              label="Published"
              value={stats.publishedGames}
              href="/admin/games?status=PUBLISHED"
            />

            <StatCard
              label="Draft"
              value={stats.draftGames}
              href="/admin/games?status=DRAFT"
            />

            <StatCard
              label="Archived"
              value={stats.archivedGames}
              href="/admin/games?status=ARCHIVED"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
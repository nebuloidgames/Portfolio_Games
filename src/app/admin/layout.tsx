import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "./admin-nav";

async function getPendingCount(): Promise<number> {
  return prisma.accessRequest.count({
    where: {
      status: "PENDING",
    },
  });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?error=unauthorized");
  }

  if (user.role !== "ADMIN") {
    redirect("/?error=forbidden");
  }

  const pendingCount = await getPendingCount();

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-black">
      <AdminNav
        user={user}
        pendingCount={pendingCount}
      />

      <main className="mx-auto min-h-[calc(100vh-58px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
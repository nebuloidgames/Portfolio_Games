"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  userId: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AccessRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const statusFilter = searchParams.get("status") || "PENDING";
  const page = Number(searchParams.get("page") || "1");

  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{
    id: string;
    type: "approve" | "reject";
  } | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/access-requests?status=${statusFilter}&page=${page}&limit=20`,
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to load access requests");
        return;
      }
      setRequests(data.requests);
      setPagination(data.pagination);
    } catch {
      setError("An error occurred while loading access requests");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  function updateFilter(status: string) {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    params.delete("page");
    router.push(`/admin/access-requests?${params.toString()}`);
  }

  async function handleApprove(id: string) {
    setActionStatus({ id, type: "approve" });
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to approve request");
        return;
      }
      startTransition(() => {
        fetchRequests();
      });
    } catch {
      setError("An error occurred while approving the request");
    } finally {
      setActionStatus(null);
    }
  }

  async function handleReject(id: string) {
    setActionStatus({ id, type: "reject" });
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/reject`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to reject request");
        return;
      }
      startTransition(() => {
        fetchRequests();
      });
    } catch {
      setError("An error occurred while rejecting the request");
    } finally {
      setActionStatus(null);
    }
  }

  const tabs = ["PENDING", "APPROVED", "REJECTED"] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white dark:text-zinc-100">
        Access Requests
      </h1>
      <p className="mt-1 text-sm text-white/60 dark:text-zinc-400">
        Manage user access requests
      </p>

      <div className="mt-6 flex gap-1 rounded-lg border border-white/15 bg-white/[0.07] p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => updateFilter(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-white/70 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-500/15 p-4 text-sm text-red-300 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-white/[0.1] dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/15 bg-white/[0.07] p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-white/60 dark:text-zinc-400">
            No {statusFilter.toLowerCase()} access requests found.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] dark:border-zinc-800 dark:bg-zinc-900">
          <table className="min-w-full divide-y divide-white/10 dark:divide-zinc-800">
            <thead className="bg-white/[0.06] dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                  Requested
                </th>
                {statusFilter === "PENDING" && (
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 dark:divide-zinc-800">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-white dark:text-zinc-100">
                    {req.fullName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white/60 dark:text-zinc-400">
                    {req.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white/60 dark:text-zinc-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  {statusFilter === "PENDING" && (
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={actionStatus?.id === req.id}
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionStatus?.id === req.id &&
                          actionStatus.type === "approve"
                            ? "Approving..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={actionStatus?.id === req.id}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionStatus?.id === req.id &&
                          actionStatus.type === "reject"
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-white/60 dark:text-zinc-400">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
            total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("page", String(page - 1));
                router.push(`/admin/access-requests?${params.toString()}`);
              }}
              disabled={page <= 1}
              className="rounded-md border border-white/15 px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("page", String(page + 1));
                router.push(`/admin/access-requests?${params.toString()}`);
              }}
              disabled={page >= pagination.totalPages}
              className="rounded-md border border-white/15 px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

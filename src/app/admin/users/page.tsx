"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  status: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const statusFilter = searchParams.get("status") || "";
  const roleFilter = searchParams.get("role") || "";
  const page = Number(searchParams.get("page") || "1");

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{
    id: string;
    type: string;
  } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (roleFilter) params.set("role", roleFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to load users");
        return;
      }
      setUsers(data.users);
      setPagination(data.pagination);
    } catch {
      setError("An error occurred while loading users");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setCurrentUserId(data.user.id);
      })
      .catch(() => {});
  }, [fetchUsers]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/users?${params.toString()}`);
  }

  async function handleAction(userId: string, action: string) {
    setActionStatus({ id: userId, type: action });
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || `Failed to ${action} user`);
        return;
      }
      startTransition(() => {
        fetchUsers();
      });
    } catch {
      setError(`An error occurred while trying to ${action} the user`);
    } finally {
      setActionStatus(null);
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      SUSPENDED:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      REVOKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || ""}`}
      >
        {status}
      </span>
    );
  }

  function getRoleBadge(role: string) {
    const styles: Record<string, string> = {
      ADMIN:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      USER: "bg-white/[0.06] text-white dark:bg-zinc-800 dark:text-zinc-300",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[role] || ""}`}
      >
        {role}
      </span>
    );
  }

  async function handleResendCredentials(userId: string, userName: string) {
    const confirmed = window.confirm(
      `Generate a new password and send new login credentials to this user's registered email?`,
    );
    if (!confirmed) return;

    setActionStatus({ id: userId, type: "resend-credentials" });
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/resend-credentials`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to resend credentials");
        return;
      }
      setSuccessMessage(`New credentials sent to ${userName}'s email.`);
      startTransition(() => {
        fetchUsers();
      });
    } catch {
      setError("An error occurred while trying to resend credentials");
    } finally {
      setActionStatus(null);
    }
  }

  function getActions(user: User) {
    if (user.id === currentUserId) {
      return (
        <span className="text-xs text-white/55 dark:text-zinc-500">
          Current user
        </span>
      );
    }

    const actions: { label: string; action: string; style: string }[] = [];
    if (user.status === "ACTIVE") {
      actions.push({
        label: "Suspend",
        action: "suspend",
        style:
          "bg-yellow-600 hover:bg-yellow-700 text-white",
      });
      actions.push({
        label: "Revoke",
        action: "revoke",
        style: "bg-red-600 hover:bg-red-700 text-white",
      });
    } else if (user.status === "SUSPENDED") {
      actions.push({
        label: "Reactivate",
        action: "reactivate",
        style: "bg-green-600 hover:bg-green-700 text-white",
      });
      actions.push({
        label: "Revoke",
        action: "revoke",
        style: "bg-red-600 hover:bg-red-700 text-white",
      });
    } else if (user.status === "REVOKED") {
      actions.push({
        label: "Reactivate",
        action: "reactivate",
        style: "bg-green-600 hover:bg-green-700 text-white",
      });
    }

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => handleAction(user.id, a.action)}
            disabled={actionStatus?.id === user.id}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${a.style}`}
          >
            {actionStatus?.id === user.id && actionStatus.type === a.action
              ? `${a.label}...`
              : a.label}
          </button>
        ))}
        {user.role === "USER" && (
          <button
            onClick={() => handleResendCredentials(user.id, user.fullName)}
            disabled={actionStatus?.id === user.id}
            className="rounded px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {actionStatus?.id === user.id && actionStatus.type === "resend-credentials"
              ? "Sending..."
              : "Resend Credentials"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white dark:text-zinc-100">
        Users
      </h1>
      <p className="mt-1 text-sm text-white/60 dark:text-zinc-400">
        Manage platform users
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-white/70 dark:text-zinc-300">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="rounded-md border border-white/15 bg-white/[0.07] px-3 py-1.5 text-sm text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-white/70 dark:text-zinc-300">
            Role:
          </label>
          <select
            value={roleFilter}
            onChange={(e) => updateFilter("role", e.target.value)}
            className="rounded-md border border-white/15 bg-white/[0.07] px-3 py-1.5 text-sm text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
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

      {successMessage && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-500/15 p-4 text-sm text-green-300 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          {successMessage}
          <button
            onClick={() => setSuccessMessage(null)}
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
      ) : users.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/15 bg-white/[0.07] p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-white/60 dark:text-zinc-400">
            No users found.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/15 bg-white/[0.07] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 dark:divide-zinc-800">
              <thead className="bg-white/[0.06] dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/60 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white dark:text-zinc-100">
                          {user.fullName}
                        </div>
                        <div className="text-xs text-white/60 dark:text-zinc-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-white/55 dark:text-zinc-500">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white/60 dark:text-zinc-400">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {getActions(user)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                router.push(`/admin/users?${params.toString()}`);
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
                router.push(`/admin/users?${params.toString()}`);
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

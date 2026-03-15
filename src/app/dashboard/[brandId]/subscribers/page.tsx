"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Download, UserX, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  subscribedAt: string;
}

export default function SubscribersPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchSubscribers = useCallback(async () => {
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/v1/brands/${brandId}/subscribers${params}`);
      if (res.ok) {
        const json = await res.json();
        setSubscribers(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId, statusFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  async function handleUnsubscribe(subId: string) {
    if (!confirm("Unsubscribe this subscriber?")) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/subscribers/${subId}`, {
        method: "DELETE",
      });
      fetchSubscribers();
    } catch {
      // silent
    }
  }

  async function handleExport() {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/subscribers/export`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Subscribers
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {activeCount} active subscriber{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "unsubscribed"].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setLoading(true); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              statusFilter === status
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <Users className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">
            No subscribers yet
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Add a newsletter form to your site. Visitors can subscribe from the
            footer or popup.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-4 p-3 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-secondary)] shrink-0">
                <Mail className="h-4 w-4 text-[var(--text-tertiary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {sub.email}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {sub.name && (
                    <span className="text-xs text-[var(--text-secondary)]">
                      {sub.name}
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Badge
                variant={sub.status === "active" ? "default" : "secondary"}
              >
                {sub.status}
              </Badge>
              {sub.status === "active" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUnsubscribe(sub.id)}
                  title="Unsubscribe"
                >
                  <UserX className="h-3.5 w-3.5 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

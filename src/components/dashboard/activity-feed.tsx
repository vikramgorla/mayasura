"use client";

import { Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

const ACTIVITY_EMOJIS: Record<string, string> = {
  brand_created: "🎉",
  product_added: "📦",
  blog_published: "📝",
  order_placed: "🛒",
  subscriber_added: "📧",
  testimonial_added: "⭐",
  design_updated: "🎨",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-8 w-8 text-[var(--text-tertiary)] mb-2" />
          <p className="text-sm text-[var(--text-secondary)]">
            No activity yet. Start building your brand!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3">
              <span className="text-lg shrink-0">
                {ACTIVITY_EMOJIS[a.type] || "📌"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)]">
                  {a.description}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {timeAgo(a.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Bell, ShoppingCart, Mail, UserPlus, Star } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  order: ShoppingCart,
  contact: Mail,
  subscriber: UserPlus,
  review: Star,
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

export function NotificationBell() {
  const { brandId } = useParams<{ brandId: string }>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}/notifications?limit=10`);
        if (res.ok) {
          const json = await res.json();
          setNotifications(json.data.notifications || []);
          setUnreadCount(json.data.unreadCount || 0);
        }
      } catch {
        // silent
      }
    }
    fetch_();
  }, [brandId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAsRead(notifId: string) {
    try {
      await fetch(
        `/api/v1/brands/${brandId}/notifications/${notifId}/read`,
        { method: "PUT" }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5 text-[var(--text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="text-xs text-[var(--accent)]">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-[var(--text-tertiary)] mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = TYPE_ICONS[notif.type] || Bell;
                return (
                  <button
                    key={notif.id}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-secondary)] last:border-0 ${
                      !notif.isRead ? "bg-[var(--accent-light)]" : ""
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[var(--text-tertiary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {notif.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="shrink-0 mt-1.5">
                        <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
  Bell, Check, CheckCheck, ShoppingBag, Mail, HeadphonesIcon,
  AlertTriangle, X, Star, Trophy, Users, Filter, Volume2, VolumeX,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────── */
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: number;
  created_at: string;
}

/* ─── Notification type config ──────────────────────────────── */
const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  new_order:       { icon: ShoppingBag,     color: 'text-amber-600',    bg: 'bg-amber-50 dark:bg-amber-900/30',    label: 'Orders' },
  order:           { icon: ShoppingBag,     color: 'text-amber-600',    bg: 'bg-amber-50 dark:bg-amber-900/30',    label: 'Orders' },
  new_subscriber:  { icon: Users,           color: 'text-emerald-600',  bg: 'bg-emerald-50 dark:bg-emerald-900/30', label: 'Subscribers' },
  contact:         { icon: Mail,            color: 'text-blue-600',     bg: 'bg-blue-50 dark:bg-blue-900/30',      label: 'Contacts' },
  new_review:      { icon: Star,            color: 'text-violet-600',   bg: 'bg-violet-50 dark:bg-violet-900/30',  label: 'Reviews' },
  support_ticket:  { icon: HeadphonesIcon,  color: 'text-teal-600',     bg: 'bg-teal-50 dark:bg-teal-900/30',     label: 'Support' },
  ticket:          { icon: HeadphonesIcon,  color: 'text-teal-600',     bg: 'bg-teal-50 dark:bg-teal-900/30',     label: 'Support' },
  milestone:       { icon: Trophy,          color: 'text-pink-600',     bg: 'bg-pink-50 dark:bg-pink-900/30',     label: 'Milestones' },
  alert:           { icon: AlertTriangle,   color: 'text-red-600',      bg: 'bg-red-50 dark:bg-red-900/30',       label: 'Alerts' },
  info:            { icon: Bell,            color: 'text-zinc-600',     bg: 'bg-zinc-50 dark:bg-zinc-800',        label: 'Info' },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.info;
}

/* ─── Relative timestamp ────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ─── Notification Item ─────────────────────────────────────── */
function NotificationItem({
  notification,
  onMarkRead,
  onDismissToast,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismissToast?: (id: string) => void;
}) {
  const cfg = getTypeConfig(notification.type);
  const Icon = cfg.icon;
  const isUnread = !notification.is_read;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-50 dark:border-zinc-800/50 cursor-pointer group ${
        isUnread ? 'bg-violet-50/30 dark:bg-violet-900/5' : ''
      }`}
      onClick={() => isUnread && onMarkRead(notification.id)}
    >
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <Icon className={`h-4 w-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
            {notification.title}
          </p>
          {isUnread && (
            <span className="mt-1 h-1.5 w-1.5 bg-violet-500 rounded-full flex-shrink-0" />
          )}
        </div>
        {notification.message && (
          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{notification.message}</p>
        )}
        <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-1.5">
          {timeAgo(notification.created_at)}
        </p>
      </div>
      {isUnread && (
        <button
          onClick={e => { e.stopPropagation(); onMarkRead(notification.id); }}
          title="Mark as read"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 flex-shrink-0"
        >
          <Check className="h-3.5 w-3.5 text-zinc-400" />
        </button>
      )}
    </motion.div>
  );
}

/* ─── Empty State ───────────────────────────────────────────── */
function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative mb-4"
      >
        <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Bell className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
          <Check className="h-3 w-3 text-violet-500" />
        </div>
      </motion.div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">All caught up!</p>
      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">No new notifications</p>
    </div>
  );
}

/* ─── Toast notification ────────────────────────────────────── */
function ToastNotification({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const cfg = getTypeConfig(notification.type);
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => onDismiss(notification.id), 5000);
    return () => clearTimeout(t);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="flex items-start gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-4 max-w-sm"
    >
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <Icon className={`h-4 w-4 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{notification.title}</p>
        {notification.message && (
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{notification.message}</p>
        )}
      </div>
      <button onClick={() => onDismiss(notification.id)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-shrink-0">
        <X className="h-3.5 w-3.5 text-zinc-400" />
      </button>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
interface NotificationBellProps {
  brandId: string;
}

const ALL_TYPES = 'all';

export function NotificationBell({ brandId }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<string>(ALL_TYPES);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const prevUnreadRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Spring animation for the badge count
  const badgeSpring = useSpring(0, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const stored = localStorage.getItem('notif-sound');
    if (stored === 'true') setSoundEnabled(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('notif-sound', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    badgeSpring.set(unreadCount);
  }, [unreadCount, badgeSpring]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}/notifications`);
      if (res.ok) {
        const data = await res.json();
        const newCount: number = data.unreadCount || 0;
        const incoming: Notification[] = data.notifications || [];

        // Detect new notifications for toast + sound
        if (newCount > prevUnreadRef.current && prevUnreadRef.current > 0) {
          const newOnes = incoming.filter(n => !n.is_read).slice(0, newCount - prevUnreadRef.current);
          setToasts(prev => [...prev, ...newOnes.slice(0, 3)]);

          if (soundEnabled) {
            // Create a gentle notification beep via Web Audio API
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              osc.type = 'sine';
              gain.gain.setValueAtTime(0, ctx.currentTime);
              gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
              gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.3);
            } catch { /* Audio not available */ }
          }
        }

        setNotifications(incoming);
        setUnreadCount(newCount);
        prevUnreadRef.current = newCount;
      }
    } catch { /* ignore */ }
  }, [brandId, soundEnabled]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const markRead = async (notificationId: string) => {
    try {
      await fetch(`/api/brands/${brandId}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await fetch(`/api/brands/${brandId}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Build filter tabs from notification types present
  const presentTypes = Array.from(new Set(notifications.map(n => n.type)));
  const filterTabs = [
    { key: ALL_TYPES, label: 'All' },
    ...presentTypes.map(t => ({ key: t, label: getTypeConfig(t).label })),
  ];

  const filteredNotifications = filter === ALL_TYPES
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <>
      {/* Bell Button */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <motion.div
            animate={unreadCount > prevUnreadRef.current - 1 && prevUnreadRef.current > 0 ? {
              rotate: [0, -15, 15, -10, 10, -5, 5, 0],
            } : {}}
            style={{ originX: '50%', originY: '0%' }}
            transition={{ duration: 0.6 }}
          >
            <Bell className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Slide-out Panel + Backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Bell className="h-4 w-4 text-violet-500" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  {/* Sound toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? 'Disable sound' : 'Enable sound'}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {soundEnabled
                      ? <Volume2 className="h-4 w-4 text-violet-500" />
                      : <VolumeX className="h-4 w-4 text-zinc-400" />
                    }
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      title="Mark all as read"
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <CheckCheck className="h-4 w-4 text-zinc-400 hover:text-violet-500 transition-colors" />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              {filterTabs.length > 2 && (
                <div className="flex items-center gap-1 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        filter === tab.key
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <EmptyNotifications />
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markRead}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 text-center">
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total
                  {!soundEnabled && (
                    <button
                      onClick={() => setSoundEnabled(true)}
                      className="ml-2 text-violet-500 hover:underline"
                    >
                      Enable sounds
                    </button>
                  )}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast notifications (bottom-right) */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastNotification notification={toast} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

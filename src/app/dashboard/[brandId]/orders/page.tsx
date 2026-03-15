'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Package, Truck, CheckCircle, Clock,
  DollarSign, TrendingUp, X, Search, Download,
  ChevronDown, CheckSquare, Square, XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { Order, Brand } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import { Sparkline } from '@/components/ui/sparkline';

// ── AnimatedCounter ──────────────────────────────────────────────────────────
function AnimatedCounter({
  value,
  duration = 900,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const startVal = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(startVal + eased * (value - startVal));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
}

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig: Record<string, {
  label: string;
  color: string;
  bg: string;
  dot: string;
  icon: React.ElementType;
}> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-700 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    dot: '#EAB308',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    dot: '#3B82F6',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    dot: '#A855F7',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    dot: '#22C55E',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    dot: '#EF4444',
    icon: XCircle,
  },
};

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const ALL_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}>
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

// ── Order detail modal ────────────────────────────────────────────────────────
function OrderModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}) {
  let items: Array<{ name: string; quantity: number; price: number }> = [];
  try { items = JSON.parse(order.items); } catch { /* empty */ }

  const statusIndex = STATUS_FLOW.indexOf(order.status);
  const timeline = STATUS_FLOW.filter(s => s !== 'cancelled').map((s, i) => ({
    status: s,
    label: statusConfig[s]?.label || s,
    completed: i <= statusIndex && order.status !== 'cancelled',
    active: s === order.status,
    dot: statusConfig[s]?.dot || '#888',
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        className="relative bg-white dark:bg-zinc-900 w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">Customer</p>
              <p className="font-semibold text-sm text-zinc-900 dark:text-white">{order.customer_name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{order.customer_email}</p>
            </div>
            {order.shipping_address && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">Shipping To</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{order.shipping_address}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-4">Order Timeline</p>
              <div className="flex items-center gap-0">
                {timeline.map((t, i) => (
                  <div key={t.status} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className="h-7 w-7 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: t.completed ? t.dot : 'transparent',
                          border: `2px solid ${t.completed ? t.dot : '#d4d4d4'}`,
                        }}
                        animate={{ scale: t.active ? [1, 1.15, 1] : 1 }}
                        transition={{ duration: 0.6, repeat: t.active ? Infinity : 0, repeatDelay: 1.5 }}
                      >
                        {t.completed && <span className="text-white text-[10px] font-bold">✓</span>}
                      </motion.div>
                      <span className={`text-[9px] mt-1 text-center ${t.completed ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'}`} style={{ fontWeight: t.active ? 700 : 400 }}>
                        {t.label}
                      </span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1 mt-[-10px] relative overflow-hidden bg-zinc-200 dark:bg-zinc-700">
                        <motion.div
                          className="h-full absolute left-0 top-0"
                          style={{ backgroundColor: t.dot }}
                          animate={{ width: t.completed && !t.active ? '100%' : '0%' }}
                          transition={{ duration: 0.6, delay: i * 0.15 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-3">Items</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-zinc-400">Qty: {item.quantity} × {order.currency} {item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                    {order.currency} {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 mt-1">
              <span className="font-bold text-sm">Total</span>
              <span className="font-bold text-base text-zinc-900 dark:text-white">
                {order.currency} {order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Update status */}
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s) => {
                const cfg = statusConfig[s];
                return (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(order.id, s)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                      order.status === s
                        ? `${cfg.color} ${cfg.bg} border-current`
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                    style={{ minHeight: '36px' }}
                  >
                    {cfg?.label || s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const toast = useToast();

  const loadData = useCallback(() => {
    fetch(`/api/brands/${brandId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setBrand(d.brand))
      .catch(() => toast.error('Failed to load brand'));
    fetch(`/api/brands/${brandId}/orders`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setOrders(d.orders || []))
      .catch(() => toast.error('Failed to load orders'));
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/brands/${brandId}/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Order updated to ${status}`);
      loadData();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
      }
    } catch {
      toast.error('Failed to update order');
    }
  };

  const bulkUpdateStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/brands/${brandId}/orders`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: id, status: bulkStatus }),
          })
        )
      );
      toast.success(`${selectedIds.size} orders updated to ${bulkStatus}`);
      setSelectedIds(new Set());
      setBulkStatus('');
      setShowBulkMenu(false);
      loadData();
    } catch {
      toast.error('Bulk update failed');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Customer', 'Email', 'Status', 'Total', 'Currency', 'Created'];
    const rows = filteredOrders.map(o => [
      o.id, o.customer_name, o.customer_email, o.status,
      o.total.toFixed(2), o.currency, new Date(o.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported as CSV');
  };

  // Stats
  const totalRevenue = useMemo(() =>
    orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0)
  , [orders]);

  const avgOrderValue = useMemo(() =>
    orders.length > 0 ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0
  , [orders, totalRevenue]);

  const fulfillmentRate = useMemo(() => {
    const active = orders.filter(o => o.status !== 'cancelled');
    const delivered = orders.filter(o => o.status === 'delivered').length;
    return active.length > 0 ? Math.round((delivered / active.length) * 100) : 0;
  }, [orders]);

  // Build sparkline data (last 7 days revenue from real orders)
  const sparklineData = useMemo(() => {
    const days = 7;
    const now = Date.now();
    const data = Array.from({ length: days }, (_, i) => {
      const dayStart = now - (days - 1 - i) * 86400000;
      const dayEnd = dayStart + 86400000;
      return orders
        .filter(o => {
          const t = new Date(o.created_at).getTime();
          return t >= dayStart && t < dayEnd && o.status !== 'cancelled';
        })
        .reduce((sum, o) => sum + o.total, 0);
    });
    return data;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter(o => {
      const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  if (!brand) return null;

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      prefix: '',
      suffix: '',
      decimals: 0,
    },
    {
      label: 'Revenue',
      value: totalRevenue,
      icon: DollarSign,
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      prefix: '$',
      suffix: '',
      decimals: 0,
    },
    {
      label: 'Avg Order Value',
      value: avgOrderValue,
      icon: TrendingUp,
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      prefix: '$',
      suffix: '',
      decimals: 0,
    },
    {
      label: 'Fulfillment Rate',
      value: fulfillmentRate,
      icon: CheckCircle,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      prefix: '',
      suffix: '%',
      decimals: 0,
    },
  ];

  return (
    <PageTransition>
    <div className="p-4 sm:p-8 max-w-[1400px] mx-auto">
      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={updateStatus}
          />
        )}
      </AnimatePresence>

      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Orders' },
        ]}
        className="mb-4"
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Orders</h1>
            <p className="text-sm text-zinc-400 mt-1">{orders.length} total • {orders.filter(o => o.status === 'pending').length} pending</p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </div>
                      {/* Sparkline for revenue stat */}
                      {stat.label === 'Revenue' && sparklineData.some(v => v > 0) && (
                        <div className="h-8 w-16 opacity-60">
                          <Sparkline data={sparklineData} color="#22c55e" />
                        </div>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      <AnimatedCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                        duration={1000 + i * 150}
                      />
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="Share your store to start receiving orders"
            illustration="orders"
            action={brand?.slug ? { label: 'View Store', href: `/shop/${brand.slug}` } : undefined}
          />
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by order ID, name, or email..."
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 dark:text-white placeholder:text-zinc-400"
                  />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        statusFilter === s
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {s === 'all' ? 'All' : (statusConfig[s]?.label || s)}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Bulk action bar */}
              <AnimatePresence>
                {selectedIds.size > 0 && (
                  <motion.div
                    className="flex items-center gap-3 px-5 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <span className="font-medium">{selectedIds.size} selected</span>
                    <div className="relative ml-2">
                      <button
                        onClick={() => setShowBulkMenu(!showBulkMenu)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 dark:bg-zinc-800/30 text-xs font-medium"
                      >
                        {bulkStatus ? (statusConfig[bulkStatus]?.label || bulkStatus) : 'Set status'}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <AnimatePresence>
                        {showBulkMenu && (
                          <motion.div
                            className="absolute top-full mt-1 left-0 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-100 dark:border-zinc-700 z-10 overflow-hidden min-w-[140px]"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                          >
                            {STATUS_FLOW.map(s => (
                              <button
                                key={s}
                                onClick={() => { setBulkStatus(s); setShowBulkMenu(false); }}
                                className="block w-full text-left px-4 py-2.5 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 font-medium"
                              >
                                {statusConfig[s]?.label || s}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {bulkStatus && (
                      <button
                        onClick={bulkUpdateStatus}
                        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="ml-auto opacity-70 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <th className="text-left pl-5 pr-3 py-3 w-10">
                        <button onClick={toggleSelectAll} className="flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          {selectedIds.size === filteredOrders.length && filteredOrders.length > 0 ? (
                            <CheckSquare className="h-4 w-4" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Order</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                      <th className="text-left px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-3 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredOrders.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          className={`border-b border-zinc-50 dark:border-zinc-800/50 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                            selectedIds.has(order.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                          onClick={() => setSelectedOrder(order)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="pl-5 pr-3 py-3.5" onClick={e => { e.stopPropagation(); toggleSelect(order.id); }}>
                            <button className="flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                              {selectedIds.has(order.id) ? (
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="font-mono text-[11px] text-zinc-400">#{order.id.slice(0, 8)}</span>
                          </td>
                          <td className="px-3 py-3.5 hidden sm:table-cell">
                            <p className="font-medium text-zinc-900 dark:text-white text-sm">{order.customer_name}</p>
                            <p className="text-xs text-zinc-400">{order.customer_email}</p>
                          </td>
                          <td className="px-3 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-3 py-3.5 text-right text-xs text-zinc-400 hidden md:table-cell">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              {order.currency} {order.total.toFixed(2)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-zinc-400 text-sm">No orders match your search</p>
                  <button
                    onClick={() => { setSearch(''); setStatusFilter('all'); }}
                    className="text-xs text-blue-500 hover:underline mt-2"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Footer */}
              {filteredOrders.length > 0 && (
                <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                  {selectedIds.size > 0 && <span>{selectedIds.size} selected</span>}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
    </PageTransition>
  );
}

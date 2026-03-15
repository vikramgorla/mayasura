"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string | null;
  items: OrderItem[];
  subtotal: number;
  discountCode: string | null;
  discountAmount: number | null;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/orders`);
      if (res.ok) {
        const json = await res.json();
        setOrders(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateStatus(orderId: string, status: string) {
    try {
      const res = await fetch(
        `/api/v1/brands/${brandId}/orders/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) fetchOrders();
    } catch {
      // silent
    }
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Orders
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">
            No orders yet
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Orders will appear when customers complete purchases.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const expanded = expandedId === order.id;
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((sum, i) => sum + i.quantity, 0)
              : 0;

            return (
              <div
                key={order.id}
                className="border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)] overflow-hidden"
              >
                {/* Row */}
                <button
                  onClick={() =>
                    setExpandedId(expanded ? null : order.id)
                  }
                  className="w-full flex items-center gap-4 p-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          STATUS_COLORS[order.status] || ""
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5">
                      <span>{order.customerName}</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-[var(--text-primary)] shrink-0">
                    {formatPrice(order.total, order.currency)}
                  </span>
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div className="border-t border-[var(--border-primary)] p-4 space-y-4">
                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[var(--text-secondary)] text-xs mb-1">
                          Customer
                        </p>
                        <p className="text-[var(--text-primary)]">
                          {order.customerName}
                        </p>
                        <p className="text-[var(--text-secondary)]">
                          {order.customerEmail}
                        </p>
                      </div>
                      {order.shippingAddress && (
                        <div>
                          <p className="text-[var(--text-secondary)] text-xs mb-1">
                            Shipping
                          </p>
                          <p className="text-[var(--text-primary)] whitespace-pre-line">
                            {order.shippingAddress}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-[var(--text-secondary)] text-xs mb-2">
                        Items
                      </p>
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="text-[var(--text-primary)]">
                              {item.productName || "Product"} × {item.quantity}
                            </span>
                            <span className="text-[var(--text-secondary)]">
                              {formatPrice(
                                item.price * item.quantity,
                                order.currency
                              )}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Status Update */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">
                        Update status:
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        className="text-sm px-2 py-1 border border-[var(--border-primary)] rounded bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

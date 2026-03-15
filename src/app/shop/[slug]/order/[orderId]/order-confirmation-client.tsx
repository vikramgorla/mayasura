"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package, Loader2 } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string | null;
  subtotal: number;
  discountCode: string | null;
  discountAmount: number | null;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderConfirmationClientProps {
  slug: string;
  orderId: string;
  accentColor: string;
}

function formatPrice(price: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function OrderConfirmationClient({
  slug,
  orderId,
  accentColor,
}: OrderConfirmationClientProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `/api/v1/public/brand/${slug}/orders/${orderId}`
        );
        if (res.ok) {
          const json = await res.json();
          setOrder(json.data);
        } else {
          setErrorMsg("Order not found");
        }
      } catch {
        setErrorMsg("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [slug, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: accentColor }}
        />
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Package
          className="mx-auto mb-4 h-16 w-16"
          style={{ color: "var(--brand-muted)" }}
        />
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--brand-text)" }}
        >
          {errorMsg || "Order not found"}
        </h1>
        <Link
          href={`/shop/${slug}`}
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 font-medium rounded-lg"
          style={{
            backgroundColor: accentColor,
            color: "var(--brand-accent-text)",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Success Header */}
      <div className="text-center mb-10">
        <CheckCircle2
          className="mx-auto mb-4 h-16 w-16"
          style={{ color: "#16A34A" }}
        />
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
          }}
        >
          Thank you, {order.customerName}!
        </h1>
        <p style={{ color: "var(--brand-muted)" }}>
          Your order has been placed successfully.
        </p>
        <p
          className="mt-2 text-sm font-mono"
          style={{ color: "var(--brand-muted)" }}
        >
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Order Details */}
      <div
        className="p-6 border rounded-lg mb-6"
        style={{
          borderColor: "var(--brand-border)",
          backgroundColor: "var(--brand-surface)",
        }}
      >
        <h2
          className="font-bold mb-4"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
          }}
        >
          Order Details
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span style={{ color: "var(--brand-text)" }}>
                {item.productName} × {item.quantity}
              </span>
              <span style={{ color: "var(--brand-muted)" }}>
                {formatPrice(item.price * item.quantity, order.currency)}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-4 pt-4 border-t space-y-2 text-sm"
          style={{ borderColor: "var(--brand-border)" }}
        >
          <div className="flex justify-between">
            <span style={{ color: "var(--brand-muted)" }}>Subtotal</span>
            <span style={{ color: "var(--brand-text)" }}>
              {formatPrice(order.subtotal, order.currency)}
            </span>
          </div>
          {order.discountCode && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.discountCode})</span>
              <span>
                -{formatPrice(order.discountAmount || 0, order.currency)}
              </span>
            </div>
          )}
          <div
            className="flex justify-between font-bold text-base pt-2 border-t"
            style={{ borderColor: "var(--brand-border)" }}
          >
            <span style={{ color: "var(--brand-text)" }}>Total</span>
            <span style={{ color: accentColor }}>
              {formatPrice(order.total, order.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      {order.shippingAddress && (
        <div
          className="p-6 border rounded-lg mb-6"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
          }}
        >
          <h2
            className="font-bold mb-2"
            style={{
              fontFamily: "var(--brand-font-heading)",
              color: "var(--brand-text)",
            }}
          >
            Shipping To
          </h2>
          <p
            className="text-sm whitespace-pre-line"
            style={{ color: "var(--brand-muted)" }}
          >
            {order.customerName}
            {"\n"}
            {order.shippingAddress}
            {"\n"}
            {order.customerEmail}
          </p>
        </div>
      )}

      {/* Continue Shopping */}
      <div className="text-center">
        <Link
          href={`/shop/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: accentColor,
            color: "var(--brand-accent-text)",
            borderRadius: "var(--brand-button-radius, 8px)",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

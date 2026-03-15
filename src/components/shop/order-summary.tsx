"use client";

import { Tag } from "lucide-react";
import type { CartItem, AppliedDiscount } from "./cart-provider";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: AppliedDiscount | null;
  discountAmount: number;
  total: number;
  currency: string;
  accentColor: string;
  onClearDiscount?: () => void;
  showItems?: boolean;
}

function formatPrice(price: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function OrderSummary({
  items,
  subtotal,
  discount,
  discountAmount,
  total,
  currency,
  accentColor,
  onClearDiscount,
  showItems = false,
}: OrderSummaryProps) {
  return (
    <div>
      <h2
        className="font-bold text-lg mb-4"
        style={{
          fontFamily: "var(--brand-font-heading)",
          color: "var(--brand-text)",
        }}
      >
        Order Summary
      </h2>

      {showItems && (
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm"
            >
              <span style={{ color: "var(--brand-text)" }}>
                {item.name} × {item.quantity}
              </span>
              <span style={{ color: "var(--brand-muted)" }}>
                {formatPrice(item.price * item.quantity, item.currency)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`space-y-2 text-sm ${showItems ? "border-t pt-3" : ""}`}
        style={{ borderColor: "var(--brand-border)" }}
      >
        <div className="flex justify-between">
          <span style={{ color: "var(--brand-muted)" }}>Subtotal</span>
          <span style={{ color: "var(--brand-text)" }}>
            {formatPrice(subtotal, currency)}
          </span>
        </div>

        {discount && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {discount.code}
              {onClearDiscount && (
                <button
                  onClick={onClearDiscount}
                  className="text-xs underline ml-1 text-red-500"
                >
                  Remove
                </button>
              )}
            </span>
            <span>-{formatPrice(discountAmount, currency)}</span>
          </div>
        )}

        <div
          className="flex justify-between font-bold text-base pt-2 border-t"
          style={{ borderColor: "var(--brand-border)" }}
        >
          <span style={{ color: "var(--brand-text)" }}>Total</span>
          <span style={{ color: accentColor }}>
            {formatPrice(total, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

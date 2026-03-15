"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "@/components/shop/cart-provider";

interface CartClientProps {
  slug: string;
  accentColor: string;
}

function formatPrice(price: number, currency: string = "USD") {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function CartClient({ slug, accentColor }: CartClientProps) {
  const {
    items,
    discount,
    subtotal,
    discountAmount,
    total,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearDiscount,
  } = useCart();

  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [validating, setValidating] = useState(false);

  const currency = items[0]?.currency || "USD";

  async function handleApplyDiscount() {
    if (!discountInput.trim()) return;
    setDiscountError("");
    setValidating(true);

    try {
      const res = await fetch(
        `/api/v1/public/brand/${slug}/discounts/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: discountInput.trim(),
            subtotal,
          }),
        }
      );

      const json = await res.json();

      if (res.ok && json.data?.valid) {
        applyDiscount({
          code: json.data.code,
          type: json.data.type,
          value: json.data.value,
          amount: json.data.discountAmount,
        });
        setDiscountInput("");
      } else {
        setDiscountError(json.error || "Invalid discount code");
      }
    } catch {
      setDiscountError("Network error. Please try again.");
    } finally {
      setValidating(false);
    }
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag
          className="mx-auto mb-4 h-16 w-16"
          style={{ color: "var(--brand-muted)", opacity: 0.5 }}
        />
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
          }}
        >
          Your cart is empty
        </h1>
        <p className="mb-6" style={{ color: "var(--brand-muted)" }}>
          Browse our products and add something you love.
        </p>
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
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1
        className="text-2xl font-bold mb-8"
        style={{
          fontFamily: "var(--brand-font-heading)",
          color: "var(--brand-text)",
        }}
      >
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 border rounded-lg"
              style={{
                borderColor: "var(--brand-border)",
                backgroundColor: "var(--brand-surface)",
              }}
            >
              {/* Image */}
              <div
                className="w-20 h-20 shrink-0 flex items-center justify-center rounded-md overflow-hidden"
                style={{ backgroundColor: `${accentColor}08` }}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package
                    className="h-6 w-6 opacity-20"
                    style={{ color: "var(--brand-text)" }}
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium text-sm truncate"
                  style={{ color: "var(--brand-text)" }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: accentColor }}
                >
                  {formatPrice(item.price, item.currency)}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div
                    className="flex items-center border rounded"
                    style={{ borderColor: "var(--brand-border)" }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ color: "var(--brand-text)" }}
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span
                      className="w-8 text-center text-sm"
                      style={{ color: "var(--brand-text)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ color: "var(--brand-text)" }}
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Line total */}
              <p
                className="font-semibold text-sm shrink-0"
                style={{ color: "var(--brand-text)" }}
              >
                {formatPrice(item.price * item.quantity, item.currency)}
              </p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          className="p-6 border rounded-lg h-fit sticky top-20"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
          }}
        >
          <h2
            className="font-bold text-lg mb-4"
            style={{
              fontFamily: "var(--brand-font-heading)",
              color: "var(--brand-text)",
            }}
          >
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
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
                  <button
                    onClick={clearDiscount}
                    className="text-xs underline ml-1 text-red-500"
                  >
                    Remove
                  </button>
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

          {/* Discount Code */}
          {!discount && (
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  style={{
                    borderColor: "var(--brand-border)",
                    backgroundColor: "transparent",
                    color: "var(--brand-text)",
                  }}
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={validating || !discountInput.trim()}
                  className="px-3 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-50"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  {validating ? "..." : "Apply"}
                </button>
              </div>
              {discountError && (
                <p className="text-xs text-red-500 mt-1">{discountError}</p>
              )}
            </div>
          )}

          {/* Checkout Button */}
          <Link
            href={`/shop/${slug}/checkout`}
            className="mt-6 flex items-center justify-center gap-2 w-full h-11 font-medium rounded-lg transition-all active:scale-[0.98]"
            style={{
              backgroundColor: accentColor,
              color: "var(--brand-accent-text)",
              borderRadius: "var(--brand-button-radius, 8px)",
            }}
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

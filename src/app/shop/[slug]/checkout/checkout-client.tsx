"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/shop/cart-provider";

interface CheckoutClientProps {
  slug: string;
  accentColor: string;
}

function formatPrice(price: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function CheckoutClient({ slug, accentColor }: CheckoutClientProps) {
  const router = useRouter();
  const { items, discount, subtotal, discountAmount, total, clearCart } =
    useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const currency = items[0]?.currency || "USD";

  // Empty cart redirect
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
          Nothing to checkout
        </h1>
        <p className="mb-6" style={{ color: "var(--brand-muted)" }}>
          Add some products to your cart first.
        </p>
        <Link
          href={`/shop/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg"
          style={{
            backgroundColor: accentColor,
            color: "var(--brand-accent-text)",
          }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOrderError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/v1/public/brand/${slug}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          shippingAddress: address,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          discountCode: discount?.code,
          currency,
        }),
      });

      const json = await res.json();

      if (res.ok && json.data?.id) {
        clearCart();
        router.push(`/shop/${slug}/order/${json.data.id}`);
      } else {
        setOrderError(json.error || "Failed to place order. Please try again.");
      }
    } catch {
      setOrderError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href={`/shop/${slug}/cart`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--brand-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1
        className="text-2xl font-bold mb-8"
        style={{
          fontFamily: "var(--brand-font-heading)",
          color: "var(--brand-text)",
        }}
      >
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="p-6 border rounded-lg"
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
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--brand-text)" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border rounded-lg text-sm"
                    style={{
                      borderColor: "var(--brand-border)",
                      backgroundColor: "transparent",
                      color: "var(--brand-text)",
                      fontSize: "16px",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--brand-text)" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border rounded-lg text-sm"
                    style={{
                      borderColor: "var(--brand-border)",
                      backgroundColor: "transparent",
                      color: "var(--brand-text)",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--brand-text)" }}
                >
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm"
                  style={{
                    borderColor: "var(--brand-border)",
                    backgroundColor: "transparent",
                    color: "var(--brand-text)",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            <div
              className="p-6 border rounded-lg"
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
                Shipping Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                placeholder="Street address, city, state, ZIP, country"
                className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"
                style={{
                  borderColor: "var(--brand-border)",
                  backgroundColor: "transparent",
                  color: "var(--brand-text)",
                  fontSize: "16px",
                }}
              />
            </div>

            {orderError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {orderError}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
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

            <div
              className="space-y-2 text-sm border-t pt-3"
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
                  <span>Discount ({discount.code})</span>
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

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex items-center justify-center gap-2 w-full h-11 font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                color: "var(--brand-accent-text)",
                borderRadius: "var(--brand-button-radius, 8px)",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

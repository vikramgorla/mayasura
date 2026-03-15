"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Package,
} from "lucide-react";
import { useCart } from "@/components/shop/cart-provider";
import { ProductReviews } from "./product-reviews";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: string | null;
}

interface ProductDetailClientProps {
  slug: string;
  product: Product;
  accentColor: string;
  templateId: string;
}

function formatPrice(price: number, currency: string) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function ProductDetailClient({
  slug,
  product,
  accentColor,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewData, setReviewData] = useState<{
    averageRating: number;
    totalCount: number;
  } | null>(null);
  const { addItem } = useCart();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/v1/public/brand/${slug}/products/${product.id}/reviews`
      );
      if (res.ok) {
        const json = await res.json();
        setReviewData({
          averageRating: json.data.averageRating,
          totalCount: json.data.totalCount,
        });
      }
    } catch {
      // silent
    }
  }, [slug, product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl || undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ padding: "var(--brand-section-padding, 48px) 0" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/shop/${slug}`}
          className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
          style={{ color: "var(--brand-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div
            className="aspect-square flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: `${accentColor}08`,
              borderRadius: "var(--brand-radius, 8px)",
            }}
          >
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package
                className="h-16 w-16 opacity-20"
                style={{ color: "var(--brand-text)" }}
              />
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: accentColor }}
              >
                {product.category}
              </p>
            )}

            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                fontFamily: "var(--brand-font-heading)",
                color: "var(--brand-text)",
              }}
            >
              {product.name}
            </h1>

            {/* Rating summary */}
            {reviewData && reviewData.totalCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4"
                      style={{
                        color:
                          star <= Math.round(reviewData.averageRating)
                            ? accentColor
                            : "var(--brand-border)",
                        fill:
                          star <= Math.round(reviewData.averageRating)
                            ? accentColor
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--brand-muted)" }}
                >
                  {reviewData.averageRating} ({reviewData.totalCount} review
                  {reviewData.totalCount !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <p
              className="text-2xl font-bold mb-4"
              style={{ color: accentColor }}
            >
              {formatPrice(product.price, product.currency)}
            </p>

            {product.description && (
              <p
                className="mb-6 leading-relaxed"
                style={{
                  color: "var(--brand-muted)",
                  fontFamily: "var(--brand-font-body)",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="flex items-center border rounded-lg overflow-hidden"
                style={{ borderColor: "var(--brand-border)" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                  style={{ color: "var(--brand-text)" }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  className="w-12 text-center font-medium"
                  style={{ color: "var(--brand-text)" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:opacity-70"
                  style={{ color: "var(--brand-text)" }}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-11 px-6 font-medium rounded-lg transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: added
                    ? "var(--brand-text)"
                    : accentColor,
                  color: added
                    ? "var(--brand-surface)"
                    : "var(--brand-accent-text)",
                  borderRadius: "var(--brand-button-radius, 8px)",
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews
            slug={slug}
            productId={product.id}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}

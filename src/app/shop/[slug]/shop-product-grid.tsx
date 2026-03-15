"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { getTemplate } from "@/lib/templates/website-templates";
import { useCart } from "@/components/shop/cart-provider";
import type { PublicProduct } from "@/lib/db/queries/public-brand";

interface ShopProductGridProps {
  slug: string;
  brandName: string;
  products: PublicProduct[];
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

function getCardClasses(cardStyle: string): string {
  switch (cardStyle) {
    case "minimal":
      return "border-b";
    case "bordered":
      return "border-2 p-4";
    case "elevated":
      return "shadow-md p-4";
    case "flat":
      return "p-4";
    case "rounded":
      return "p-4";
    default:
      return "p-4";
  }
}

export function ShopProductGrid({
  slug,
  brandName,
  products,
  accentColor,
  templateId,
}: ShopProductGridProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  if (!template) return null;

  const { typography, cardStyle, borderRadius } = template.preview;

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const filtered =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  function handleAddToCart(product: PublicProduct) {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl || undefined,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div style={{ padding: "var(--brand-section-padding, 48px) 0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: "var(--brand-font-heading)",
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingTracking,
              textTransform:
                typography.headingCase === "uppercase"
                  ? "uppercase"
                  : "none",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--brand-text)",
            }}
          >
            Shop
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: "var(--brand-muted)",
            }}
          >
            {products.length} product{products.length !== 1 ? "s" : ""} from{" "}
            {brandName}
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all"
                style={{
                  backgroundColor:
                    selectedCategory === cat
                      ? accentColor
                      : "transparent",
                  color:
                    selectedCategory === cat
                      ? "var(--brand-accent-text)"
                      : "var(--brand-text)",
                  border: `1px solid ${
                    selectedCategory === cat
                      ? accentColor
                      : "var(--brand-border)"
                  }`,
                  minHeight: "44px",
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package
              className="mx-auto mb-3 h-12 w-12"
              style={{ color: "var(--brand-muted)" }}
            />
            <p
              className="text-lg font-medium"
              style={{ color: "var(--brand-text)" }}
            >
              No products yet
            </p>
            <p style={{ color: "var(--brand-muted)" }}>
              Check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            style={{ gap: "var(--brand-card-gap, 16px)" }}
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                className={`group transition-transform duration-200 hover:translate-y-[-2px] ${getCardClasses(cardStyle)}`}
                style={{
                  borderRadius:
                    cardStyle === "rounded" ? "16px" : borderRadius,
                  borderColor: "var(--brand-border)",
                  backgroundColor:
                    cardStyle === "elevated" || cardStyle === "flat"
                      ? "var(--brand-surface)"
                      : undefined,
                  overflow: "hidden",
                }}
              >
                {/* Image */}
                <Link href={`/shop/${slug}/product/${product.id}`}>
                  <div
                    className="aspect-square mb-3 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: `${accentColor}08`,
                      borderRadius:
                        cardStyle === "rounded" ? "12px" : borderRadius,
                    }}
                  >
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Package
                        className="h-8 w-8 opacity-20"
                        style={{ color: "var(--brand-text)" }}
                      />
                    )}
                  </div>
                </Link>

                {/* Category */}
                {product.category && (
                  <p
                    className="text-xs mb-1 uppercase tracking-wider"
                    style={{ color: accentColor, opacity: 0.8 }}
                  >
                    {product.category}
                  </p>
                )}

                {/* Name */}
                <Link href={`/shop/${slug}/product/${product.id}`}>
                  <h3
                    className="font-semibold mb-1 hover:opacity-80 transition-opacity"
                    style={{
                      fontFamily: "var(--brand-font-heading)",
                      color: "var(--brand-text)",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {product.name}
                  </h3>
                </Link>

                {/* Price + Add to Cart */}
                <div className="flex items-center justify-between mt-2">
                  <p
                    className="font-semibold"
                    style={{
                      color: accentColor,
                      fontFamily: "var(--brand-font-body)",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {formatPrice(product.price, product.currency)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        addedId === product.id
                          ? "var(--brand-text)"
                          : accentColor,
                      color:
                        addedId === product.id
                          ? "var(--brand-surface)"
                          : "var(--brand-accent-text)",
                      minHeight: "32px",
                    }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {addedId === product.id ? "Added!" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

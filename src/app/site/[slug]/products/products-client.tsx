"use client";

import { useState, useMemo } from "react";
import { getTemplate } from "@/lib/templates/website-templates";
import type { PublicProduct } from "@/lib/db/queries/public-brand";

interface ProductsClientProps {
  brand: {
    name: string;
    accentColor: string;
  };
  products: PublicProduct[];
  templateId: string;
}

function getCardStyle(
  cardStyle: string,
  accentColor: string,
  borderRadius: string
): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: cardStyle === "rounded" ? "16px" : borderRadius,
    overflow: "hidden",
    transition: "transform 200ms ease, box-shadow 200ms ease",
  };

  switch (cardStyle) {
    case "minimal":
      return { ...base, borderBottom: "1px solid var(--brand-border)", borderRadius: "0" };
    case "bordered":
      return { ...base, border: "2px solid var(--brand-border)", padding: "16px" };
    case "elevated":
      return { ...base, backgroundColor: "var(--brand-surface)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "16px" };
    case "flat":
      return { ...base, backgroundColor: "var(--brand-surface)", padding: "16px" };
    case "rounded":
      return { ...base, backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}20`, padding: "16px" };
    default:
      return { ...base, padding: "16px" };
  }
}

export function ProductsClient({ brand, products, templateId }: ProductsClientProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!template) return null;

  const { typography, cardStyle, borderRadius } = template.preview;

  // Extract unique categories
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

  return (
    <div style={{ padding: `var(--brand-section-padding, 64px) 0` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: "var(--brand-font-heading)",
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingTracking,
              textTransform:
                typography.headingCase === "uppercase" ? "uppercase" : "none",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--brand-text)",
            }}
          >
            Our Products
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: "var(--brand-muted)",
              fontSize: typography.bodySize,
            }}
          >
            {products.length} product{products.length !== 1 ? "s" : ""} from{" "}
            {brand.name}
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all"
              style={{
                backgroundColor:
                  selectedCategory === "all"
                    ? brand.accentColor
                    : "transparent",
                color:
                  selectedCategory === "all"
                    ? "var(--brand-accent-text)"
                    : "var(--brand-text)",
                border: `1px solid ${
                  selectedCategory === "all"
                    ? brand.accentColor
                    : "var(--brand-border)"
                }`,
                minHeight: "44px",
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all"
                style={{
                  backgroundColor:
                    selectedCategory === cat
                      ? brand.accentColor
                      : "transparent",
                  color:
                    selectedCategory === cat
                      ? "var(--brand-accent-text)"
                      : "var(--brand-text)",
                  border: `1px solid ${
                    selectedCategory === cat
                      ? brand.accentColor
                      : "var(--brand-border)"
                  }`,
                  minHeight: "44px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-2">📦</p>
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
                className="group cursor-pointer hover:translate-y-[-2px]"
                style={getCardStyle(cardStyle, brand.accentColor, borderRadius)}
              >
                {/* Image */}
                <div
                  className="aspect-square mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: `${brand.accentColor}08`,
                    borderRadius:
                      cardStyle === "rounded" ? "12px" : borderRadius,
                  }}
                >
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      style={{
                        borderRadius:
                          cardStyle === "rounded" ? "12px" : borderRadius,
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      className="text-xs opacity-20"
                      style={{ color: "var(--brand-text)" }}
                    >
                      Image
                    </span>
                  )}
                </div>

                {/* Category */}
                {product.category && (
                  <p
                    className="text-xs mb-1 uppercase tracking-wider"
                    style={{ color: brand.accentColor, opacity: 0.8 }}
                  >
                    {product.category}
                  </p>
                )}

                {/* Name */}
                <h3
                  className="font-semibold mb-1"
                  style={{
                    fontFamily: "var(--brand-font-heading)",
                    color: "var(--brand-text)",
                    fontSize: "0.9375rem",
                  }}
                >
                  {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: "var(--brand-muted)" }}
                  >
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <p
                  className="font-semibold"
                  style={{
                    color: brand.accentColor,
                    fontFamily: "var(--brand-font-body)",
                    fontSize: "0.9375rem",
                  }}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: product.currency,
                  }).format(product.price)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

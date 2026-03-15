"use client";

import Link from "next/link";
import type { PublicProduct } from "@/lib/db/queries/public-brand";
import type { WebsiteTemplate } from "@/lib/templates/website-templates";

interface FeaturedProductsProps {
  products: PublicProduct[];
  slug: string;
  template: WebsiteTemplate;
  accentColor: string;
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
      return {
        ...base,
        borderBottom: "1px solid var(--brand-border)",
        borderRadius: "0",
        padding: "16px 0",
      };
    case "bordered":
      return {
        ...base,
        border: "2px solid var(--brand-border)",
        padding: "16px",
      };
    case "elevated":
      return {
        ...base,
        backgroundColor: "var(--brand-surface)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: "16px",
      };
    case "flat":
      return {
        ...base,
        backgroundColor: "var(--brand-surface)",
        padding: "16px",
      };
    case "rounded":
      return {
        ...base,
        backgroundColor: `${accentColor}08`,
        border: `1px solid ${accentColor}20`,
        padding: "16px",
      };
    default:
      return { ...base, padding: "16px" };
  }
}

export function FeaturedProducts({
  products,
  slug,
  template,
  accentColor,
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const { cardStyle, borderRadius, typography } = template.preview;
  const featured = products.slice(0, 4);

  return (
    <section
      style={{ padding: `var(--brand-section-padding, 64px) 0` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2
            style={{
              fontFamily: "var(--brand-font-heading)",
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingTracking,
              textTransform:
                typography.headingCase === "uppercase"
                  ? "uppercase"
                  : "none",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--brand-text)",
            }}
          >
            Featured Products
          </h2>
          <p
            className="mt-2"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: "var(--brand-muted)",
              fontSize: typography.bodySize,
            }}
          >
            Discover what makes us special
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: "var(--brand-card-gap, 16px)" }}
        >
          {featured.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer hover:translate-y-[-2px]"
              style={getCardStyle(cardStyle, accentColor, borderRadius)}
            >
              {/* Image placeholder */}
              <div
                className="aspect-square mb-3 flex items-center justify-center"
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
                  style={{ color: accentColor, opacity: 0.8 }}
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

              {/* Price */}
              <p
                className="font-semibold"
                style={{
                  color: accentColor,
                  fontFamily: "var(--brand-font-body)",
                  fontSize: "0.875rem",
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

        {products.length > 4 && (
          <div className="text-center mt-8">
            <Link
              href={`/site/${slug}/products`}
              className="inline-flex items-center transition-transform active:scale-[0.98]"
              style={{
                fontFamily: "var(--brand-font-body)",
                fontSize: "var(--brand-button-font-size, 14px)",
                fontWeight: 500,
                border: `1.5px solid ${accentColor}`,
                color: accentColor,
                padding: `var(--brand-button-py, 10px) var(--brand-button-px, 24px)`,
                borderRadius: `var(--brand-button-radius, ${borderRadius})`,
              }}
            >
              View All Products →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

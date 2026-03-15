"use client";

import { useMemo } from "react";
import { TEMPLATE_MAP } from "@/lib/templates/website-templates";
import type { WizardProduct } from "@/lib/types/wizard";

interface SitePreviewProps {
  brandName: string;
  tagline: string;
  templateId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  products: WizardProduct[];
  viewMode: "desktop" | "tablet" | "mobile";
}

const VIEW_DIMENSIONS = {
  desktop: { width: 1200, height: 800, scale: 0.38 },
  tablet: { width: 768, height: 1024, scale: 0.35 },
  mobile: { width: 375, height: 667, scale: 0.42 },
};

export function SitePreview({
  brandName,
  tagline,
  templateId,
  primaryColor,
  secondaryColor,
  accentColor,
  fontHeading,
  fontBody,
  products,
  viewMode,
}: SitePreviewProps) {
  const template = useMemo(
    () => TEMPLATE_MAP.get(templateId),
    [templateId]
  );

  const dims = VIEW_DIMENSIONS[viewMode];
  const containerWidth = dims.width * dims.scale;
  const containerHeight = dims.height * dims.scale;

  const preview = template?.preview;
  const borderRadius = preview?.borderRadius || "8px";

  // Determine text color for accent bg
  const textOnAccent = useMemo(() => {
    if (!accentColor) return "#FFFFFF";
    const hex = accentColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }, [accentColor]);

  const navLinks = ["Home", "Products", "About", "Contact"];

  return (
    <div
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden shadow-[var(--shadow-lg)]"
      style={{ width: containerWidth, height: containerHeight }}
    >
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-center">
          <div className="inline-block bg-[var(--bg-surface)] rounded px-3 py-0.5 text-[8px] text-[var(--text-tertiary)] font-mono">
            {brandName
              ? `${brandName.toLowerCase().replace(/\s+/g, "")}.com`
              : "yoursite.com"}
          </div>
        </div>
      </div>

      {/* Site Content - Scaled */}
      <div
        style={{
          width: dims.width,
          height: dims.height - 40,
          transform: `scale(${dims.scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
          backgroundColor: secondaryColor,
          color: primaryColor,
        }}
      >
        {/* Nav */}
        <nav
          className="flex items-center justify-between px-8 py-4"
          style={{
            borderBottom: `1px solid ${accentColor}20`,
          }}
        >
          <span
            style={{
              fontFamily: fontHeading,
              fontWeight: preview?.typography.headingWeight || "600",
              fontSize: "18px",
              letterSpacing:
                preview?.navStyle === "centered" ? "0.08em" : "-0.02em",
              textTransform:
                preview?.typography.headingCase === "uppercase"
                  ? "uppercase"
                  : "none",
            }}
          >
            {brandName || "Brand"}
          </span>
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <span
                key={link}
                style={{
                  fontFamily: fontBody,
                  fontSize: "13px",
                  opacity: 0.7,
                  letterSpacing:
                    preview?.navStyle === "spread" ? "0.05em" : "normal",
                  textTransform:
                    preview?.navStyle === "spread" ? "uppercase" : "none",
                }}
              >
                {link}
              </span>
            ))}
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "12px",
                backgroundColor: accentColor,
                color: textOnAccent,
                padding: "6px 16px",
                borderRadius,
                fontWeight: 500,
              }}
            >
              Get Started
            </span>
          </div>
        </nav>

        {/* Hero */}
        <HeroSection
          brandName={brandName}
          tagline={tagline}
          heroStyle={preview?.heroStyle || "centered"}
          fontHeading={fontHeading}
          fontBody={fontBody}
          primaryColor={primaryColor}
          accentColor={accentColor}
          textOnAccent={textOnAccent}
          borderRadius={borderRadius}
          typography={preview?.typography}
        />

        {/* Products */}
        {products.length > 0 && (
          <ProductsSection
            products={products.slice(0, 3)}
            fontHeading={fontHeading}
            fontBody={fontBody}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            textOnAccent={textOnAccent}
            cardStyle={preview?.cardStyle || "elevated"}
            borderRadius={borderRadius}
          />
        )}
      </div>
    </div>
  );
}

function HeroSection({
  brandName,
  tagline,
  heroStyle,
  fontHeading,
  fontBody,
  primaryColor,
  accentColor,
  textOnAccent,
  borderRadius,
  typography,
}: {
  brandName: string;
  tagline: string;
  heroStyle: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  accentColor: string;
  textOnAccent: string;
  borderRadius: string;
  typography?: {
    headingWeight: string;
    headingTracking: string;
    headingCase: "normal" | "uppercase" | "capitalize";
    bodySize: string;
  };
}) {
  const align =
    heroStyle === "left-aligned" || heroStyle === "split"
      ? "left"
      : "center";
  const padding =
    heroStyle === "full-width" ? "80px 40px" : "60px 80px";

  return (
    <div
      style={{
        padding,
        textAlign: align,
        display: heroStyle === "split" ? "flex" : "block",
        alignItems: "center",
        gap: heroStyle === "split" ? "40px" : undefined,
        minHeight: "300px",
      }}
    >
      <div style={{ flex: heroStyle === "split" ? 1 : undefined }}>
        <h1
          style={{
            fontFamily: fontHeading,
            fontSize: heroStyle === "full-width" ? "48px" : "36px",
            fontWeight: typography?.headingWeight || "600",
            letterSpacing: typography?.headingTracking || "-0.025em",
            textTransform:
              typography?.headingCase === "uppercase"
                ? "uppercase"
                : typography?.headingCase === "capitalize"
                  ? "capitalize"
                  : "none",
            lineHeight: 1.1,
            marginBottom: "16px",
            color: primaryColor,
          }}
        >
          {brandName || "Your Brand"}
        </h1>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: typography?.bodySize || "16px",
            opacity: 0.7,
            maxWidth: align === "center" ? "500px" : "400px",
            margin: align === "center" ? "0 auto 24px" : "0 0 24px",
            lineHeight: 1.6,
            color: primaryColor,
          }}
        >
          {tagline || "Build something extraordinary with your digital presence."}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: accentColor,
              color: textOnAccent,
              padding: "10px 24px",
              borderRadius,
              display: "inline-block",
            }}
          >
            Get Started
          </span>
          <span
            style={{
              fontFamily: fontBody,
              fontSize: "14px",
              fontWeight: 500,
              border: `1.5px solid ${accentColor}`,
              color: accentColor,
              padding: "10px 24px",
              borderRadius,
              display: "inline-block",
            }}
          >
            Learn More
          </span>
        </div>
      </div>

      {heroStyle === "split" && (
        <div
          style={{
            flex: 1,
            height: "200px",
            backgroundColor: `${accentColor}15`,
            borderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ opacity: 0.3, fontSize: "14px", color: primaryColor }}>
            Hero Image
          </span>
        </div>
      )}
    </div>
  );
}

function ProductsSection({
  products,
  fontHeading,
  fontBody,
  primaryColor,
  secondaryColor,
  accentColor,
  textOnAccent,
  cardStyle,
  borderRadius,
}: {
  products: WizardProduct[];
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textOnAccent: string;
  cardStyle: string;
  borderRadius: string;
}) {
  const getCardStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: "20px",
      borderRadius: cardStyle === "rounded" ? "16px" : borderRadius,
    };

    switch (cardStyle) {
      case "minimal":
        return {
          ...base,
          borderBottom: `1px solid ${primaryColor}15`,
          borderRadius: "0",
        };
      case "bordered":
        return {
          ...base,
          border: `2px solid ${primaryColor}20`,
        };
      case "elevated":
        return {
          ...base,
          backgroundColor: secondaryColor,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        };
      case "flat":
        return {
          ...base,
          backgroundColor: `${primaryColor}05`,
        };
      case "rounded":
        return {
          ...base,
          backgroundColor: `${accentColor}08`,
          border: `1px solid ${accentColor}20`,
        };
      default:
        return base;
    }
  };

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2
        style={{
          fontFamily: fontHeading,
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "24px",
          textAlign: "center",
          color: primaryColor,
        }}
      >
        Our Products
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`,
          gap: "16px",
        }}
      >
        {products.map((product) => (
          <div key={product.id} style={getCardStyles()}>
            <div
              style={{
                height: "100px",
                backgroundColor: `${accentColor}10`,
                borderRadius: cardStyle === "rounded" ? "12px" : borderRadius,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ opacity: 0.2, fontSize: "12px", color: primaryColor }}>
                Image
              </span>
            </div>
            <h3
              style={{
                fontFamily: fontHeading,
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "4px",
                color: primaryColor,
              }}
            >
              {product.name}
            </h3>
            {product.price !== undefined && (
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: "13px",
                  fontWeight: "600",
                  color: accentColor,
                  marginBottom: "8px",
                }}
              >
                ${product.price.toFixed(2)}
              </p>
            )}
            <span
              style={{
                fontFamily: fontBody,
                fontSize: "11px",
                fontWeight: 500,
                backgroundColor: accentColor,
                color: textOnAccent,
                padding: "4px 12px",
                borderRadius,
                display: "inline-block",
              }}
            >
              View Details
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

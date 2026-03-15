"use client";

import Link from "next/link";
import type { WebsiteTemplate } from "@/lib/templates/website-templates";

interface HeroSectionProps {
  brandName: string;
  tagline: string | null;
  description: string | null;
  slug: string;
  template: WebsiteTemplate;
  accentColor: string;
}

export function HeroSection({
  brandName,
  tagline,
  description,
  slug,
  template,
  accentColor,
}: HeroSectionProps) {
  const { heroStyle, typography, borderRadius } = template.preview;

  const isSplit = heroStyle === "split";
  const isCenter = heroStyle === "centered" || heroStyle === "stacked";
  const isFullWidth = heroStyle === "full-width";

  const headingStyle: React.CSSProperties = {
    fontFamily: "var(--brand-font-heading)",
    fontWeight: typography.headingWeight,
    letterSpacing: typography.headingTracking,
    textTransform:
      typography.headingCase === "uppercase"
        ? "uppercase"
        : typography.headingCase === "capitalize"
          ? "capitalize"
          : "none",
    lineHeight: 1.1,
    fontSize: "clamp(2rem, 6vw, 4rem)",
    color: "var(--brand-text)",
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        padding: `var(--brand-section-padding, 64px) 0`,
        ...(isFullWidth
          ? {
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
            }
          : {}),
      }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isSplit
            ? "flex flex-col md:flex-row items-center gap-8 md:gap-12"
            : ""
        }`}
      >
        <div
          className={`${isSplit ? "flex-1" : ""} ${
            isCenter ? "text-center mx-auto max-w-3xl" : "max-w-2xl"
          }`}
        >
          <h1 style={headingStyle} className="mb-4 sm:mb-6">
            {brandName}
          </h1>

          {(tagline || description) && (
            <p
              className="mb-6 sm:mb-8 leading-relaxed"
              style={{
                fontFamily: "var(--brand-font-body)",
                fontSize: typography.bodySize,
                color: "var(--brand-muted)",
                maxWidth: isCenter ? "600px" : "500px",
                margin: isCenter ? "0 auto" : undefined,
                marginBottom: "1.5rem",
              }}
            >
              {tagline || description}
            </p>
          )}

          <div
            className={`flex flex-wrap gap-3 ${
              isCenter ? "justify-center" : ""
            }`}
          >
            <Link
              href={`/site/${slug}/products`}
              className="inline-flex items-center transition-transform active:scale-[0.98]"
              style={{
                fontFamily: "var(--brand-font-body)",
                fontSize: "var(--brand-button-font-size, 14px)",
                fontWeight: 500,
                backgroundColor: accentColor,
                color: "var(--brand-accent-text)",
                padding: `var(--brand-button-py, 12px) var(--brand-button-px, 24px)`,
                borderRadius: `var(--brand-button-radius, ${borderRadius})`,
              }}
            >
              Explore Products
            </Link>
            <Link
              href={`/site/${slug}/about`}
              className="inline-flex items-center transition-transform active:scale-[0.98]"
              style={{
                fontFamily: "var(--brand-font-body)",
                fontSize: "var(--brand-button-font-size, 14px)",
                fontWeight: 500,
                border: `1.5px solid ${accentColor}`,
                color: accentColor,
                padding: `var(--brand-button-py, 12px) var(--brand-button-px, 24px)`,
                borderRadius: `var(--brand-button-radius, ${borderRadius})`,
              }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Split hero: image placeholder */}
        {isSplit && (
          <div
            className="flex-1 w-full aspect-[4/3] md:aspect-auto md:h-[350px] rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}10`,
              borderRadius,
            }}
          >
            <span
              className="text-sm opacity-30"
              style={{ color: "var(--brand-text)" }}
            >
              Hero Image
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

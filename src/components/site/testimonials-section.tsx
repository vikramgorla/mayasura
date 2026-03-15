"use client";

import { Star } from "lucide-react";
import type { PublicTestimonial } from "@/lib/db/queries/public-brand";
import type { WebsiteTemplate } from "@/lib/templates/website-templates";

interface TestimonialsSectionProps {
  testimonials: PublicTestimonial[];
  template: WebsiteTemplate;
  accentColor: string;
}

export function TestimonialsSection({
  testimonials,
  template,
  accentColor,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  const { typography, borderRadius } = template.preview;
  const displayed = testimonials.slice(0, 3);

  return (
    <section
      style={{
        padding: `var(--brand-section-padding, 64px) 0`,
        backgroundColor: "var(--brand-surface)",
      }}
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
            What People Say
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "var(--brand-card-gap, 16px)" }}
        >
          {displayed.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-lg"
              style={{
                backgroundColor: `${accentColor}05`,
                border: "1px solid var(--brand-border)",
                borderRadius,
              }}
            >
              {/* Stars */}
              {t.rating && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      style={{
                        color:
                          i < t.rating! ? accentColor : "var(--brand-border)",
                        fill:
                          i < t.rating! ? accentColor : "none",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <p
                className="mb-4 leading-relaxed"
                style={{
                  fontFamily: "var(--brand-font-body)",
                  color: "var(--brand-text)",
                  fontSize: "0.9375rem",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatarUrl}
                    alt={t.authorName}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      color: accentColor,
                    }}
                  >
                    {t.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--brand-text)" }}
                  >
                    {t.authorName}
                  </p>
                  {(t.authorRole || t.authorCompany) && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--brand-muted)" }}
                    >
                      {[t.authorRole, t.authorCompany]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

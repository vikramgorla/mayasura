"use client";

import { useMemo } from "react";
import { getTemplate } from "@/lib/templates/website-templates";

interface AboutClientProps {
  brand: {
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    industry: string | null;
    accentColor: string;
  };
  templateId: string;
}

const VALUES = [
  {
    icon: "✨",
    title: "Quality First",
    desc: "We never compromise on the quality of our products and services.",
  },
  {
    icon: "🤝",
    title: "Customer Focus",
    desc: "Every decision we make starts with our customers in mind.",
  },
  {
    icon: "🌱",
    title: "Continuous Growth",
    desc: "We're always learning, improving, and pushing boundaries.",
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "We embrace new ideas and creative solutions to complex problems.",
  },
];

export function AboutClient({ brand, templateId }: AboutClientProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) return null;

  const { typography, borderRadius } = template.preview;

  return (
    <div style={{ padding: `var(--brand-section-padding, 64px) 0` }}>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--brand-font-heading)",
            fontWeight: typography.headingWeight,
            letterSpacing: typography.headingTracking,
            textTransform:
              typography.headingCase === "uppercase"
                ? "uppercase"
                : "none",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--brand-text)",
          }}
        >
          About {brand.name}
        </h1>

        {brand.tagline && (
          <p
            className="text-lg mb-6"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: brand.accentColor,
              fontWeight: 500,
            }}
          >
            {brand.tagline}
          </p>
        )}

        {brand.description && (
          <div
            className="leading-relaxed space-y-4"
            style={{
              fontFamily: "var(--brand-font-body)",
              color: "var(--brand-text)",
              fontSize: typography.bodySize,
              opacity: 0.85,
            }}
          >
            {brand.description.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {brand.industry && (
          <div className="mt-6">
            <span
              className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full"
              style={{
                backgroundColor: `${brand.accentColor}15`,
                color: brand.accentColor,
              }}
            >
              {brand.industry}
            </span>
          </div>
        )}
      </section>

      {/* Values */}
      <section
        style={{
          backgroundColor: "var(--brand-surface)",
          padding: `var(--brand-section-padding, 64px) 0`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-center mb-8"
            style={{
              fontFamily: "var(--brand-font-heading)",
              fontWeight: typography.headingWeight,
              letterSpacing: typography.headingTracking,
              textTransform:
                typography.headingCase === "uppercase"
                  ? "uppercase"
                  : "none",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--brand-text)",
            }}
          >
            Our Values
          </h2>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: "var(--brand-card-gap, 16px)" }}
          >
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="p-6 text-center"
                style={{
                  border: "1px solid var(--brand-border)",
                  borderRadius,
                }}
              >
                <div className="text-3xl mb-3">{value.icon}</div>
                <h3
                  className="font-semibold mb-2"
                  style={{
                    fontFamily: "var(--brand-font-heading)",
                    color: "var(--brand-text)",
                    fontSize: "1rem",
                  }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--brand-muted)" }}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

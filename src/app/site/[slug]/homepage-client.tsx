"use client";

import { useMemo } from "react";
import { getTemplate } from "@/lib/templates/website-templates";
import { HeroSection } from "@/components/site/hero-section";
import { FeaturedProducts } from "@/components/site/featured-products";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { NewsletterCta } from "@/components/site/newsletter-cta";
import type { PublicProduct, PublicTestimonial } from "@/lib/db/queries/public-brand";

interface HomepageClientProps {
  brand: {
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    accentColor: string;
  };
  products: PublicProduct[];
  testimonials: PublicTestimonial[];
  templateId: string;
}

export function HomepageClient({
  brand,
  products,
  testimonials,
  templateId,
}: HomepageClientProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) return null;

  return (
    <>
      <HeroSection
        brandName={brand.name}
        tagline={brand.tagline}
        description={brand.description}
        slug={brand.slug}
        template={template}
        accentColor={brand.accentColor}
      />

      <FeaturedProducts
        products={products}
        slug={brand.slug}
        template={template}
        accentColor={brand.accentColor}
      />

      <TestimonialsSection
        testimonials={testimonials}
        template={template}
        accentColor={brand.accentColor}
      />

      <NewsletterCta
        slug={brand.slug}
        brandName={brand.name}
        accentColor={brand.accentColor}
        borderRadius={template.preview.borderRadius}
      />
    </>
  );
}

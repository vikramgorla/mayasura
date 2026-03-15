import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { generateBrandMetadata } from "@/components/seo/meta-tags";
import { HomepageClient } from "./homepage-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return generateBrandMetadata(brand);
}

export default async function SiteHomePage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);

  if (!template) {
    notFound();
  }

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <HomepageClient
      brand={{
        name: brand.name,
        slug: brand.slug,
        tagline: brand.tagline,
        description: brand.description,
        accentColor,
      }}
      products={brand.products}
      testimonials={brand.testimonials}
      templateId={templateId}
    />
  );
}

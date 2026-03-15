import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { ShopProductGrid } from "./shop-product-grid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `Shop — ${brand.name}`,
    description: `Browse and shop products from ${brand.name}`,
  };
}

export default async function ShopPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <ShopProductGrid
      slug={slug}
      brandName={brand.name}
      products={brand.products}
      accentColor={accentColor}
      templateId={templateId}
    />
  );
}
